import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
    ArrowLeft, Play, Pause, Volume2, VolumeX, Mic, MicOff,
    MessageCircle, CheckCircle, HelpCircle, Sparkles
} from 'lucide-react';
import {
    generateVideoExplanation,
    sendMessageToShikshak,
    speakText,
    stopSpeaking,
    startVoiceInput
} from '../../services/ai';
import logger from '../../utils/logger';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useProfile } from '../../contexts/ProfileContext';
import toast from 'react-hot-toast';

export default function TopicLearning() {
    const { subjectId, chapterId, topicId } = useParams();
    const navigate = useNavigate();
    const { profile } = useProfile();

    // State
    const [loading, setLoading] = useState(true);
    const [videoScript, setVideoScript] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [activeMode, setActiveMode] = useState('video'); // 'video', 'voice', 'text'
    const [understood, setUnderstood] = useState(false);
    const [topic, setTopic] = useState(null);

    // Load topic details and video explanation
    useEffect(() => {
        const fetchTopicDetails = async () => {
            if (!profile?.class) return;

            try {
                setLoading(true);
                const classNum = profile.class.replace(/\D/g, '');
                const docId = `class${classNum}_${subjectId}`;
                const syllabusRef = doc(db, 'syllabus', docId);
                const syllabusSnap = await getDoc(syllabusRef);

                if (syllabusSnap.exists()) {
                    const data = syllabusSnap.data();
                    const chapter = data.chapters.find(c => c.number.toString() === chapterId);

                    if (chapter) {
                        // In the JSON structure, key_topics is an array of strings.
                        // We need to find the topic string that matches or corresponds to topicId.
                        // Since topicId might be an index or a slug, let's assume for now it's an index 
                        // OR we try to match the string if topicId is a string.
                        // Given the previous code used topicId directly, let's assume topicId is the index in the array for now
                        // to keep it simple, or we can try to match the string.

                        // Let's assume topicId is the index (0-based)
                        const topicIndex = parseInt(topicId);
                        const topicName = chapter.key_topics[topicIndex];

                        if (topicName) {
                            const topicData = {
                                id: topicId,
                                name: topicName,
                                subject: data.subject_name,
                                class: classNum,
                                description: `Learn about ${topicName} in ${chapter.name}`
                            };
                            setTopic(topicData);

                            // Load video after topic is set
                            loadVideoExplanation(topicData);
                        } else {
                            toast.error("Topic not found");
                        }
                    } else {
                        toast.error("Chapter not found");
                    }
                } else {
                    toast.error("Syllabus not found");
                }
            } catch (error) {
                console.error("Error fetching topic:", error);
                toast.error("Failed to load topic details");
            } finally {
                setLoading(false);
            }
        };

        fetchTopicDetails();
    }, [subjectId, chapterId, topicId, profile]);

    const loadVideoExplanation = async (topicData) => {
        // setLoading(true); // Already handled in parent
        logger.info('TopicLearning', 'Loading video explanation', { topic: topicData.name });

        try {
            const apiKey = profile?.useOwnApiKey ? profile.apiKey : null;
            const script = await generateVideoExplanation(topicData.name, topicData.subject, topicData.class, apiKey);
            setVideoScript(script);
            logger.success('TopicLearning', 'Video script loaded');
        } catch (error) {
            logger.error('TopicLearning', 'Failed to load video', error);
        }
    };

    // Handle text-to-speech
    const handleSpeak = (text) => {
        if (isSpeaking) {
            stopSpeaking();
            setIsSpeaking(false);
            logger.ai('Stopped speaking');
        } else {
            const success = speakText(text || videoScript);
            if (success) {
                setIsSpeaking(true);
                logger.ai('Started speaking');

                // Auto-stop after speech ends
                setTimeout(() => setIsSpeaking(false), (text?.length || videoScript?.length) * 50);
            }
        }
    };

    // Handle voice input
    const handleVoiceInput = () => {
        if (isListening) {
            setIsListening(false);
            return;
        }

        setIsListening(true);
        logger.ai('Starting voice input');

        startVoiceInput(
            (transcript) => {
                setUserInput(transcript);
                setIsListening(false);
                handleSendMessage(transcript);
            },
            (error) => {
                setIsListening(false);
                logger.error('TopicLearning', 'Voice input error', error);
                alert('Voice input failed. Please try typing instead.');
            }
        );
    };

    // Handle sending chat message
    const handleSendMessage = async (message = userInput) => {
        if (!message.trim()) return;

        const userMsg = { role: 'user', text: message };
        setChatMessages(prev => [...prev, userMsg]);
        setUserInput('');
        setLoading(true);

        logger.ai('Sending chat message', { message });

        try {
            const apiKey = profile?.useOwnApiKey ? profile.apiKey : null;
            const response = await sendMessageToShikshak(message, chatMessages, null, apiKey);
            const aiMsg = { role: 'ai', text: response };
            setChatMessages(prev => [...prev, aiMsg]);
            logger.success('TopicLearning', 'AI response received');

            // Auto-speak AI response if in voice mode
            if (activeMode === 'voice') {
                speakText(response);
            }
        } catch (error) {
            logger.error('TopicLearning', 'Chat error', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle "I Understood" button
    const handleUnderstood = async () => {
        try {
            setUnderstood(true);
            logger.success('TopicLearning', 'Student marked as understood');

            // Save progress to Firestore
            if (profile?.uid) {
                const progressRef = doc(db, 'users', profile.uid, 'progress', subjectId);

                // Check if doc exists, if not set it, else update it
                const docSnap = await getDoc(progressRef);

                if (!docSnap.exists()) {
                    await setDoc(progressRef, {
                        completedTopics: [topicId], // Storing topic index/ID
                        lastUpdated: new Date().toISOString()
                    });
                } else {
                    await updateDoc(progressRef, {
                        completedTopics: arrayUnion(topicId),
                        lastUpdated: new Date().toISOString()
                    });
                }
                toast.success("Progress saved! 🎉");
            }

            // Show practice questions or move to next topic
            setTimeout(() => {
                navigate(`/practice/${subjectId}/${chapterId}/${topicId}`);
            }, 1500);
        } catch (error) {
            console.error("Error saving progress:", error);
            toast.error("Failed to save progress");
        }
    };

    return (
        <div className="min-h-screen bg-background font-body">
            {/* Header with clear back button */}
            <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
                    >
                        <ArrowLeft size={24} />
                        <span className="font-bold">Back</span>
                    </button>
                    <div className="text-center">
                        <h1 className="text-xl font-heading font-bold text-primary">{topic?.name || 'Loading...'}</h1>
                        <p className="text-sm text-text-secondary">{topic?.subject} - Class {topic?.class}</p>
                    </div>
                    <div className="w-20"></div> {/* Spacer for centering */}
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Mode Selection - Super Clear CTAs */}
                <Card className="p-6">
                    <h2 className="text-2xl font-heading font-bold mb-4 text-center">
                        How do you want to learn? 🎯
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Video Mode */}
                        <button
                            onClick={() => setActiveMode('video')}
                            className={`p-6 rounded-2xl border-2 transition-all ${activeMode === 'video'
                                ? 'border-primary bg-primary/10 shadow-lg scale-105'
                                : 'border-gray-200 hover:border-primary/50'
                                }`}
                        >
                            <div className="text-5xl mb-3">📺</div>
                            <h3 className="text-xl font-bold mb-2">Watch Video</h3>
                            <p className="text-sm text-text-secondary">
                                See animations and examples
                            </p>
                            {activeMode === 'video' && (
                                <div className="mt-3 text-primary font-bold flex items-center justify-center gap-2">
                                    <Sparkles size={16} /> Active
                                </div>
                            )}
                        </button>

                        {/* Voice Mode */}
                        <button
                            onClick={() => setActiveMode('voice')}
                            className={`p-6 rounded-2xl border-2 transition-all ${activeMode === 'voice'
                                ? 'border-secondary bg-secondary/10 shadow-lg scale-105'
                                : 'border-gray-200 hover:border-secondary/50'
                                }`}
                        >
                            <div className="text-5xl mb-3">🎤</div>
                            <h3 className="text-xl font-bold mb-2">Talk to AI</h3>
                            <p className="text-sm text-text-secondary">
                                Speak your questions
                            </p>
                            {activeMode === 'voice' && (
                                <div className="mt-3 text-secondary font-bold flex items-center justify-center gap-2">
                                    <Sparkles size={16} /> Active
                                </div>
                            )}
                        </button>

                        {/* Text Mode */}
                        <button
                            onClick={() => setActiveMode('text')}
                            className={`p-6 rounded-2xl border-2 transition-all ${activeMode === 'text'
                                ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                                : 'border-gray-200 hover:border-purple-300'
                                }`}
                        >
                            <div className="text-5xl mb-3">💬</div>
                            <h3 className="text-xl font-bold mb-2">Type & Chat</h3>
                            <p className="text-sm text-text-secondary">
                                Write your questions
                            </p>
                            {activeMode === 'text' && (
                                <div className="mt-3 text-purple-600 font-bold flex items-center justify-center gap-2">
                                    <Sparkles size={16} /> Active
                                </div>
                            )}
                        </button>
                    </div>
                </Card>

                {/* Video Mode Content */}
                {activeMode === 'video' && (
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-heading font-bold">📺 Video Explanation</h3>
                            <Button
                                onClick={() => handleSpeak()}
                                variant={isSpeaking ? 'secondary' : 'outline'}
                                className="flex items-center gap-2"
                            >
                                {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                {isSpeaking ? 'Stop Audio' : 'Listen to Explanation'}
                            </Button>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin text-6xl mb-4">⏳</div>
                                <p className="text-xl text-text-secondary">Creating your video explanation...</p>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-xl p-6 whitespace-pre-wrap">
                                {videoScript || 'Video script will appear here...'}
                            </div>
                        )}

                        {/* Clear CTA after video */}
                        {videoScript && !understood && (
                            <div className="mt-6 text-center">
                                <h3 className="text-xl font-bold mb-4">Did you understand? 🤔</h3>
                                <div className="flex gap-4 justify-center">
                                    <Button
                                        onClick={handleUnderstood}
                                        className="text-lg px-8 py-4 flex items-center gap-2"
                                    >
                                        <CheckCircle size={24} />
                                        Yes, I Understood! ✅
                                    </Button>
                                    <Button
                                        onClick={() => setActiveMode('text')}
                                        variant="outline"
                                        className="text-lg px-8 py-4 flex items-center gap-2"
                                    >
                                        <HelpCircle size={24} />
                                        I have doubts 🤔
                                    </Button>
                                </div>
                            </div>
                        )}

                        {understood && (
                            <div className="mt-6 text-center bg-green-50 p-6 rounded-xl">
                                <div className="text-6xl mb-3">🎉</div>
                                <h3 className="text-2xl font-bold text-green-600 mb-2">Great job!</h3>
                                <p className="text-lg mb-4">Let's practice what you learned...</p>
                                <div className="animate-pulse">Redirecting to practice questions...</div>
                            </div>
                        )}
                    </Card>
                )}

                {/* Voice Mode Content */}
                {activeMode === 'voice' && (
                    <Card className="p-6">
                        <h3 className="text-2xl font-heading font-bold mb-4 text-center">
                            🎤 Talk to Shikshak AI
                        </h3>

                        {/* Voice Input Button - Super Clear */}
                        <div className="text-center mb-6">
                            <button
                                onClick={handleVoiceInput}
                                className={`w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all ${isListening
                                    ? 'bg-red-500 text-white animate-pulse scale-110'
                                    : 'bg-secondary text-white hover:scale-105'
                                    } shadow-2xl`}
                            >
                                {isListening ? (
                                    <>
                                        <MicOff size={64} />
                                        <span className="mt-4 text-xl font-bold">Listening...</span>
                                        <span className="text-sm">Tap to stop</span>
                                    </>
                                ) : (
                                    <>
                                        <Mic size={64} />
                                        <span className="mt-4 text-xl font-bold">Tap to Speak</span>
                                        <span className="text-sm">Ask anything!</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {chatMessages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                            ? 'bg-primary text-white rounded-tr-none'
                                            : 'bg-gray-100 rounded-tl-none'
                                            }`}
                                    >
                                        <p className="text-lg">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Text Mode Content */}
                {activeMode === 'text' && (
                    <Card className="p-6">
                        <h3 className="text-2xl font-heading font-bold mb-4 text-center">
                            💬 Chat with Shikshak AI
                        </h3>

                        {/* Chat Messages */}
                        <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                            {chatMessages.length === 0 && (
                                <div className="text-center py-12 text-text-secondary">
                                    <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                                    <p className="text-lg">Ask me anything about {topic?.name}!</p>
                                    <p className="text-sm mt-2">I'm here to help you understand 😊</p>
                                </div>
                            )}

                            {chatMessages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                            ? 'bg-primary text-white rounded-tr-none'
                                            : 'bg-gray-100 rounded-tl-none'
                                            }`}
                                    >
                                        <p className="text-lg">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area - Super Clear */}
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your question here... 📝"
                                className="flex-1 p-4 text-lg rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                            <Button
                                onClick={() => handleSendMessage()}
                                disabled={!userInput.trim() || loading}
                                className="px-8 text-lg"
                            >
                                {loading ? '⏳' : 'Send 📤'}
                            </Button>
                        </div>

                        {/* Quick Question Buttons */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            <button
                                onClick={() => setUserInput("Explain this in simple words")}
                                className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                            >
                                Explain Simply 🤔
                            </button>
                            <button
                                onClick={() => setUserInput("Give me an example")}
                                className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                            >
                                Show Example 📝
                            </button>
                            <button
                                onClick={() => setUserInput("I don't understand")}
                                className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                            >
                                I'm Confused 😕
                            </button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
