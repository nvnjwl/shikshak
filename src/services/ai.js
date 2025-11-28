import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from "../utils/logger";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// System prompt for Shikshak AI - defines personality and teaching style
const SYSTEM_PROMPT = `You are Shikshak, a friendly and patient AI tutor for Indian students (Class 4-8). 

Your personality:
- Warm, encouraging, and patient like a caring teacher
- Never get frustrated, always ready to explain again
- Use simple language appropriate for children
- Celebrate small successes to build confidence
- Use Indian context (cricket, festivals, Indian food) in examples

Your teaching approach:
- Start with "why" before "how"
- Use visual descriptions and real-life examples
- Break complex concepts into small steps
- Ask questions to check understanding
- Give hints instead of direct answers for practice problems
- Connect new concepts to what student already knows

For homework help:
- Guide students to the answer, don't solve it for them
- Ask "What do you think?" to encourage thinking
- Give step-by-step hints
- Praise effort, not just correct answers

Language:
- Use mix of English and simple Hindi words (like "dal", "roti", "cricket")
- Avoid complex vocabulary
- Use emojis occasionally to make it friendly (📚, 🎯, ✨)
- Keep responses concise (2-3 paragraphs max)

Remember: You're replacing a home tutor, so be as helpful and patient as a good teacher would be!`;

// Video explanation prompt
const VIDEO_EXPLANATION_PROMPT = `Create a detailed video script for explaining this concept to a Class {class} student.

Structure the script as:
1. Hook (10 seconds) - Start with an interesting question or real-life example
2. Introduction (20 seconds) - What we'll learn today
3. Main Explanation (2-3 minutes) - Break into 3-5 simple steps with visual descriptions
4. Examples (1 minute) - 2-3 relatable examples
5. Practice (30 seconds) - Quick question to check understanding
6. Summary (20 seconds) - Key takeaways

For each section, describe:
- What visuals to show (animations, diagrams, real objects)
- What the narrator should say (simple, child-friendly language)
- Any on-screen text or highlights

Make it engaging and visual-first!`;

// Create chat session with context
async function createChatSession(conversationHistory = []) {
    logger.debug('AI Service', 'Creating chat session', { historyLength: conversationHistory.length });

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_PROMPT
    });

    const history = conversationHistory.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({
        history: history,
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
        },
    });

    return chat;
}

// Main function to send message to Shikshak AI
export async function sendMessageToShikshak(userMessage, conversationHistory = [], image = null) {
    logger.ai('sendMessageToShikshak called', {
        messageLength: userMessage?.length,
        historyLength: conversationHistory.length,
        hasImage: !!image
    });

    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            logger.warning('AI Service', 'Gemini API key not configured, using mock responses');
            const mockResponse = getMockResponse(userMessage, image);
            return mockResponse;
        }

        if (image) {
            const response = await analyzeImageWithGemini(image, userMessage);
            return response;
        }

        const chat = await createChatSession(conversationHistory);
        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        const responseText = response.text();

        logger.success('AI Service', 'Response received from Gemini');
        return responseText;

    } catch (error) {
        logger.error('AI Service', 'Gemini AI Error', error);
        const mockResponse = getMockResponse(userMessage, image);
        return mockResponse;
    }
}

// Generate video explanation script using AI
export async function generateVideoExplanation(topic, subject, studentClass) {
    logger.ai('Generating video explanation', { topic, subject, class: studentClass });

    try {
        if (!import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY === 'your_gemini_api_key_here') {
            return getMockVideoScript(topic, subject);
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_PROMPT
        });

        const prompt = VIDEO_EXPLANATION_PROMPT.replace('{class}', studentClass) +
            `\n\nTopic: ${topic}\nSubject: ${subject}\nClass: ${studentClass}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const script = response.text();

        logger.success('AI Service', 'Video script generated', { scriptLength: script.length });
        return script;

    } catch (error) {
        logger.error('AI Service', 'Video generation error', error);
        return getMockVideoScript(topic, subject);
    }
}

// Convert text to speech using Web Speech API
export function speakText(text, options = {}) {
    logger.ai('Text-to-speech requested', { textLength: text.length });

    if (!('speechSynthesis' in window)) {
        logger.error('AI Service', 'Text-to-speech not supported in this browser');
        return false;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Configure voice settings for Indian English
    utterance.lang = options.lang || 'en-IN';
    utterance.rate = options.rate || 0.9; // Slightly slower for clarity
    utterance.pitch = options.pitch || 1.1; // Slightly higher for friendliness
    utterance.volume = options.volume || 1;

    // Try to use Indian English voice if available
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(voice =>
        voice.lang === 'en-IN' || voice.lang.startsWith('en-IN')
    );

    if (indianVoice) {
        utterance.voice = indianVoice;
        logger.debug('AI Service', 'Using Indian English voice', { voiceName: indianVoice.name });
    }

    utterance.onstart = () => logger.ai('Speech started');
    utterance.onend = () => logger.ai('Speech ended');
    utterance.onerror = (error) => logger.error('AI Service', 'Speech error', error);

    window.speechSynthesis.speak(utterance);
    return true;
}

// Stop ongoing speech
export function stopSpeaking() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        logger.ai('Speech stopped');
    }
}

// Convert speech to text using Web Speech API
export function startVoiceInput(onResult, onError) {
    logger.ai('Voice input requested');

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        logger.error('AI Service', 'Speech recognition not supported in this browser');
        onError?.('Voice input not supported in your browser');
        return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-IN'; // Indian English
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        logger.ai('Voice recognition started');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;

        logger.success('AI Service', 'Voice recognized', {
            transcript,
            confidence: (confidence * 100).toFixed(0) + '%'
        });

        onResult?.(transcript, confidence);
    };

    recognition.onerror = (event) => {
        logger.error('AI Service', 'Voice recognition error', event.error);
        onError?.(event.error);
    };

    recognition.onend = () => {
        logger.ai('Voice recognition ended');
    };

    recognition.start();
    return recognition;
}

// Handle image analysis for homework help
async function analyzeImageWithGemini(imageBase64, question = "") {
    logger.ai('Analyzing image with Gemini Vision', { questionLength: question?.length });

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_PROMPT + "\n\nFor homework images: Identify the problem, guide the student with hints, don't give direct answers. Ask what they've tried so far."
        });

        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

        const imageParts = [{
            inlineData: {
                data: base64Data,
                mimeType: "image/jpeg"
            }
        }];

        const prompt = question || "I need help with this homework problem. Can you guide me?";

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const responseText = response.text();

        logger.success('AI Service', 'Image analyzed successfully', { responseLength: responseText.length });
        return responseText;

    } catch (error) {
        logger.error('AI Service', 'Image analysis error', error);
        return "I can see your homework question! 📸\n\nLet me help you solve it step by step:\n\n1. First, let's identify what we need to find\n2. What information is given in the problem?\n3. Which formula or concept should we use?\n\nTell me what you think, and I'll guide you! 🎯";
    }
}

// Mock responses as fallback
function getMockResponse(userMessage, image) {
    logger.debug('AI Service', 'Generating mock response', { hasImage: !!image });

    if (image) {
        return "I can see your homework question! 📸\n\nLet me help you solve it step by step. First, tell me:\n1. What is the question asking you to find?\n2. What information is given?\n3. Have you tried any approach?\n\nI'll guide you through it! 🎯";
    }

    const msg = userMessage.toLowerCase();

    if (msg.includes('fraction') || msg.includes('divide')) {
        return "Great question about fractions! 🎯\n\nLet's break this down:\n\n1️⃣ When dividing fractions, we flip the second fraction and multiply\n2️⃣ For example: 1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2\n\nThink of it like this: If you have half a pizza and want to divide it into quarter slices, how many quarters fit in a half? 4 quarters!\n\nWant to try a practice problem? 📚";
    }

    if (msg.includes('photosynthesis')) {
        return "Photosynthesis is how plants make their food! 🌱\n\nRemember the formula:\n**6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂**\n\nIn simple words:\n- Plants take in carbon dioxide (CO₂) from air\n- They take water (H₂O) from soil\n- Using sunlight, they make glucose (sugar/food) and oxygen\n\nThat's why plants are so important - they give us oxygen to breathe! 🌿\n\nDo you understand each part? Ask me anything!";
    }

    if (msg.includes('verb') || msg.includes('grammar')) {
        return "Verbs are action words! 🏃\n\nThey tell us what someone or something is doing.\n\n**Examples:**\n- Run, jump, eat, sleep (action verbs)\n- Is, am, are, was, were (helping verbs)\n\n**Try this:** Find the verb in 'The cat sleeps on the mat.'\n\nHint: What is the cat doing? 😺\n\nTell me your answer!";
    }

    if (msg.includes('help') || msg.includes('homework') || msg.includes('doubt')) {
        return "I'm here to help! 📚\n\nYou can:\n1. Ask me to explain any concept\n2. Upload a photo of your homework\n3. Practice with questions\n4. Get help with any subject\n\nWhat subject are you working on today? Math, Science, English, or something else?";
    }

    if (msg.includes('thank')) {
        return "You're welcome! 😊\n\nKeep up the great work! Remember, learning is a journey, and I'm always here to help you understand better.\n\nWant to practice more or move to the next topic? 🎯";
    }

    return `That's an interesting question! 🤔\n\nLet me help you understand this better. ${msg.includes('?') ? 'To answer your question' : 'About this topic'}:\n\n(Note: For the best experience, please configure your Gemini API key in the .env file. I'll give you detailed, personalized explanations!)\n\nFor now, can you tell me:\n- Which class are you in?\n- Which subject is this about?\n- What specifically are you finding difficult?\n\nThis will help me explain better! 📖`;
}

// Mock video script generator
function getMockVideoScript(topic, subject) {
    return `🎬 Video Script: ${topic} (${subject})

📌 HOOK (10 seconds)
Visual: Show a cricket match
Narrator: "Have you ever wondered how Virat Kohli calculates the run rate? It's all about ${topic}!"

📚 INTRODUCTION (20 seconds)
Visual: Animated title card with colorful graphics
Narrator: "Hi! I'm Shikshak, your AI teacher. Today we'll learn ${topic} in a fun and easy way!"

🎯 MAIN EXPLANATION (2-3 minutes)
[Step 1]
Visual: Simple diagram with bright colors
Narrator: "Let's start with the basics..."

[Step 2]
Visual: Real-life example (fruits, toys, etc.)
Narrator: "Now, imagine you have..."

[Step 3]
Visual: Step-by-step animation
Narrator: "Here's how we solve it..."

📝 EXAMPLES (1 minute)
Visual: 2-3 worked examples with highlighting
Narrator: "Let's try some examples together..."

✅ PRACTICE (30 seconds)
Visual: Question on screen with timer
Narrator: "Now it's your turn! Can you solve this?"

🎉 SUMMARY (20 seconds)
Visual: Key points with checkmarks
Narrator: "Great job! Remember these 3 things..."

---
Total Duration: ~4 minutes
Engagement Level: High (animations, real-life examples, interactive)`;
}

// Helper functions
export async function getSubjectHelp(subject, topic, studentClass) {
    const prompt = `I'm a Class ${studentClass} student. Can you explain ${topic} in ${subject} in a simple way with examples?`;
    logger.ai('Getting subject help', { subject, topic, class: studentClass });
    return await sendMessageToShikshak(prompt, []);
}

export async function getPracticeQuestion(subject, topic, difficulty = 'medium') {
    const prompt = `Give me a ${difficulty} level practice question on ${topic} in ${subject}. After I answer, tell me if I'm right and explain why.`;
    logger.ai('Generating practice question', { subject, topic, difficulty });
    return await sendMessageToShikshak(prompt, []);
}
