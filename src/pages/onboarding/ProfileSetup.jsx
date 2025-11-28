import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { User, GraduationCap, Target, Check } from 'lucide-react';

const steps = [
    { id: 1, title: "Who are you?", icon: User },
    { id: 2, title: "Academic Details", icon: GraduationCap },
    { id: 3, title: "Your Goals", icon: Target },
];

export default function ProfileSetup() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        grade: '',
        board: '',
        goals: []
    });

    const updateData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const toggleGoal = (goal) => {
        setFormData(prev => {
            const goals = prev.goals.includes(goal)
                ? prev.goals.filter(g => g !== goal)
                : [...prev.goals, goal];
            return { ...prev, goals };
        });
    };

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else handleSubmit();
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Save to localStorage for demo (works without Firebase auth)
            localStorage.setItem('shikshak_user_profile', JSON.stringify({
                ...formData,
                onboardingCompleted: true,
                createdAt: new Date().toISOString(),
                coins: 100
            }));

            // Try to save to Firebase if user is authenticated
            if (auth.currentUser) {
                try {
                    await setDoc(doc(db, "users", auth.currentUser.uid), {
                        ...formData,
                        onboardingCompleted: true,
                        createdAt: new Date(),
                        coins: 100
                    });
                } catch (firebaseError) {
                    console.warn('Firebase save failed, but continuing with localStorage:', firebaseError);
                }
            }

            // Navigate to dashboard
            setTimeout(() => {
                navigate('/app');
            }, 500);

        } catch (error) {
            console.error("Error saving profile:", error);
            alert('There was an error saving your profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 font-body">
            <Card className="w-full max-w-2xl min-h-[500px] flex flex-col">
                {/* Progress Bar */}
                <div className="flex justify-between mb-8 px-4">
                    {steps.map((s) => (
                        <div key={s.id} className="flex flex-col items-center gap-2 relative z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${step >= s.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                                }`}>
                                <s.icon size={20} />
                            </div>
                            <span className={`text-xs font-bold ${step >= s.id ? 'text-primary' : 'text-gray-300'}`}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                    {/* Connecting Line */}
                    <div className="absolute top-[5rem] left-[20%] right-[20%] h-1 bg-gray-100 -z-0 hidden md:block">
                        <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${((step - 1) / 2) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -50, opacity: 0 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-heading text-center">Let's get to know you!</h2>
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">What should we call you?</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => updateData('name', e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-lg"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -50, opacity: 0 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-heading text-center">Where do you study?</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {['Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'].map((cls) => (
                                        <button
                                            key={cls}
                                            onClick={() => updateData('grade', cls)}
                                            className={`p-4 rounded-xl border-2 transition-all ${formData.grade === cls
                                                ? 'border-primary bg-primary/10 text-primary font-bold'
                                                : 'border-gray-100 hover:border-primary/50'
                                                }`}
                                        >
                                            {cls}
                                        </button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    {['CBSE', 'ICSE', 'State Board'].map((brd) => (
                                        <button
                                            key={brd}
                                            onClick={() => updateData('board', brd)}
                                            className={`p-4 rounded-xl border-2 transition-all ${formData.board === brd
                                                ? 'border-secondary bg-secondary/10 text-secondary font-bold'
                                                : 'border-gray-100 hover:border-secondary/50'
                                                }`}
                                        >
                                            {brd}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -50, opacity: 0 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-heading text-center">What's your main goal?</h2>
                                <div className="space-y-3">
                                    {[
                                        "Improve my Grades 📈",
                                        "Understand Concepts Better 🧠",
                                        "Homework Help 🏠",
                                        "Prepare for Exams 📝"
                                    ].map((goal) => (
                                        <button
                                            key={goal}
                                            onClick={() => toggleGoal(goal)}
                                            className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${formData.goals.includes(goal)
                                                ? 'border-primary bg-primary/10 text-primary font-bold'
                                                : 'border-gray-100 hover:bg-gray-50'
                                                }`}
                                        >
                                            {goal}
                                            {formData.goals.includes(goal) && <Check size={20} />}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Actions */}
                <div className="mt-8 flex justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => setStep(step - 1)}
                        disabled={step === 1}
                        className={step === 1 ? 'invisible' : ''}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={
                            (step === 1 && !formData.name) ||
                            (step === 2 && (!formData.grade || !formData.board)) ||
                            (step === 3 && formData.goals.length === 0) ||
                            loading
                        }
                    >
                        {step === 3 ? (loading ? 'Setting up...' : 'Finish') : 'Next'}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
