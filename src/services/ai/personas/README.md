# AI Teacher Personas - Quick Reference Guide

## System Overview

The AI persona system intelligently selects the right teacher for each student based on:
- **Student's class** (5th-8th)
- **Performance level** (struggling <60%, average 60-80%, advanced >80%)
- **Language preference** (Hinglish vs English)
- **Subject being taught**

---

## Class 5 Teachers (Implemented ✅)

### 1. **Priya Ma'am** - The Loving Sister
- **Type:** Loving, Hinglish-Friendly
- **Best For:** All students, especially those who prefer Hindi-English mix
- **Style:** Warm, patient, uses stories and games
- **Language:** 50% Hindi, 50% English
- **Example:** "Chalo beta, fractions toh pizza slices jaisa hai!"

### 2. **Kavita Ma'am** - The Professional
- **Type:** Structured, Organized
- **Best For:** Students who need discipline and clear structure
- **Style:** Step-by-step, methodical
- **Language:** Formal English
- **Example:** "Let's understand this systematically. Step 1: Identify the operation..."

### 3. **Rajesh Sir** - The Excellence Coach
- **Type:** Challenging, Inspiring
- **Best For:** High performers (>80%) who need to be pushed
- **Style:** Thought-provoking, advanced concepts
- **Language:** Motivational English
- **Example:** "Good! Now can you find 3 different methods to solve this?"

### 4. **Amit Sir** - The Confidence Builder
- **Type:** Patient, Encouraging
- **Best For:** Average/struggling students (<60%) who need confidence
- **Style:** Breaks down complexity, celebrates small wins
- **Language:** Simple, clear English
- **Example:** "Don't worry, we'll take it slow. You CAN do this!"

---

## How It Works

### Automatic Teacher Selection

```javascript
// System automatically selects based on student profile
const studentProfile = {
    class: 5,
    performance: 75,  // percentage
    languagePreference: 'hinglish'
};

// This will select Priya Ma'am (Hinglish + medium performance)
const teacher = selectTeacher(studentProfile, 'math');
```

### Selection Logic

| Performance | Language Pref | Teacher Selected |
|-------------|---------------|------------------|
| > 80% | Any | Rajesh Sir (Excellence Coach) |
| < 60% | Any | Amit Sir (Confidence Builder) |
| 60-80% | Hinglish/Hindi | Priya Ma'am (Loving) |
| 60-80% | English | Kavita Ma'am (Professional) |

---

## Usage in Code

### In Chat/Topic Learning Components

```javascript
import { sendMessageToShikshak } from '../services/ai';

// Get student profile from context
const { profile } = useProfile();

// Create student profile for persona selection
const studentProfile = {
    class: parseInt(profile.class),
    performance: calculatePerformance(profile), // or default to 70
    languagePreference: profile.languagePreference || 'hinglish'
};

// Send message with persona
const response = await sendMessageToShikshak(
    userMessage,
    conversationHistory,
    image,
    apiKey,
    studentProfile,  // ← New parameter
    'math'           // ← Subject (optional)
);
```

---

## Teacher Personas by Class

### Class 5 (Ages 10-11) ✅ IMPLEMENTED
- **Priya Ma'am** - Loving, Hinglish
- **Kavita Ma'am** - Professional
- **Rajesh Sir** - Excellence Coach
- **Amit Sir** - Confidence Builder

### Class 6 (Ages 11-12) 🚧 TODO
- **Sneha Ma'am** - Loving, Hinglish (uses teen-friendly examples)
- **Meera Ma'am** - Professional (more detailed)
- **Vikram Sir** - Excellence Coach (competitive)
- **Rohan Sir** - Confidence Builder (supportive)

### Class 7 (Ages 12-13) 🚧 TODO
- **Anjali Ma'am** - Loving, Hinglish (understands peer pressure)
- **Pooja Ma'am** - Professional (exam-focused)
- **Arjun Sir** - Excellence Coach (challenge-based)
- **Karan Sir** - Confidence Builder (personalized)

### Class 8 (Ages 13-14) 🚧 TODO
- **Nisha Ma'am** - Loving, Hinglish (board exam prep + life skills)
- **Ritu Ma'am** - Professional (strategic exam prep)
- **Aditya Sir** - Excellence Coach (career-oriented)
- **Sameer Sir** - Confidence Builder (stress-free learning)

---

## Subject Adaptations

Each teacher adapts their style based on the subject:

### Math
- **Priya:** "Fractions toh pizza slices jaisa hai!"
- **Kavita:** "Step 1: Identify the operation. Step 2: Apply the rule."
- **Rajesh:** "Can you find 3 different methods?"
- **Amit:** "Let's break this into tiny steps."

### Science
- **Priya:** "Plants bhi breathing karte hain!"
- **Kavita:** "Let's classify this systematically."
- **Rajesh:** "What would happen if we changed this variable?"
- **Amit:** "Think of it like your daily routine..."

### English
- **Priya:** "Is word ka matlab Hindi mein..."
- **Kavita:** "Grammar rules must be followed precisely."
- **Rajesh:** "Can you make this sentence more impactful?"
- **Amit:** "Express it in your own words first."

---

## Testing the System

### Test Different Personas

```javascript
// Test with high performer
const highPerformer = { class: 5, performance: 85, languagePreference: 'english' };
// Should get: Rajesh Sir

// Test with struggling student
const struggling = { class: 5, performance: 45, languagePreference: 'hinglish' };
// Should get: Amit Sir

// Test with average Hinglish student
const average = { class: 5, performance: 70, languagePreference: 'hinglish' };
// Should get: Priya Ma'am

// Test with average English student
const averageEng = { class: 5, performance: 70, languagePreference: 'english' };
// Should get: Kavita Ma'am
```

---

## Next Steps

### Phase 1: Complete ✅
- [x] Create 4 personas for Class 5
- [x] Build persona selector logic
- [x] Integrate into AI service
- [x] Add subject adaptations

### Phase 2: In Progress 🚧
- [ ] Create personas for Class 6, 7, 8
- [ ] Update frontend to pass student profile
- [ ] Add UI for teacher selection (optional)
- [ ] Test with real students

### Phase 3: Future 📋
- [ ] Add more context awareness (time of day, mood)
- [ ] Performance tracking per teacher
- [ ] Student can choose preferred teacher
- [ ] Teacher "voice" consistency across sessions

---

## Benefits

### For Students
✅ **Personalized Learning** - Teacher matches their needs
✅ **Comfort Level** - Can choose Hinglish or English
✅ **Right Challenge** - Not too easy, not too hard
✅ **Emotional Connection** - Teacher understands them

### For Platform
✅ **Better Engagement** - Students connect with "their" teacher
✅ **Improved Outcomes** - Right teaching style = better results
✅ **Unique Feature** - No other platform has this
✅ **Scalable** - AI handles all personas

---

## File Structure

```
src/services/ai/
├── personas/
│   ├── class5/
│   │   ├── priya.js      ✅ Loving, Hinglish
│   │   ├── kavita.js     ✅ Professional
│   │   ├── rajesh.js     ✅ Excellence Coach
│   │   ├── amit.js       ✅ Confidence Builder
│   │   └── index.js      ✅ Exports all Class 5 teachers
│   ├── class6/           🚧 TODO
│   ├── class7/           🚧 TODO
│   ├── class8/           🚧 TODO
│   └── personaSelector.js ✅ Selection logic
└── ai.js                  ✅ Main AI service (updated)
```

---

## Example Interactions

### Same Question, Different Teachers

**Question:** "I don't understand fractions"

**Priya Ma'am:**
> "Arre beta, tension mat lo! Fractions toh bahut easy hai. Dekho, agar tumhare paas ek pizza hai aur tum apne 3 friends ke saath share karo, toh har ek ko kitna milega? Chalo, saath mein samajhte hain! 🍕"

**Kavita Ma'am:**
> "Let's understand fractions systematically. A fraction represents a part of a whole. It has two components: numerator (top number) and denominator (bottom number). Let me explain with a clear example."

**Rajesh Sir:**
> "Fractions are the foundation of advanced math! Once you master this, you'll be solving complex problems easily. Let's not just understand fractions - let's become fraction experts! Ready for the challenge?"

**Amit Sir:**
> "Don't worry! Fractions seem hard, but we'll break it down into tiny, easy steps. You already know how to share things equally, right? That's basically what fractions are! Let's start simple."

---

This system makes Shikshak feel like a **real school with real teachers**! 🎓
