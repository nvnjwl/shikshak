import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { BookOpen, Check, GraduationCap, ChevronRight } from 'lucide-react';

export default function ProfileSetup() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { profile, updateProfile, completeOnboarding, skipOnboarding, getSubjectsForClass } = useProfile();

    // Pre-fill name from Google sign-in
    const [name, setName] = useState('');

    useEffect(() => {
        if (currentUser?.displayName) {
            setName(currentUser.displayName);
        }
        if (profile?.name) {
            setName(profile.name);
        }
    }, [currentUser, profile]);

    const handleClassSelect = (className) => {
        setSelectedClass(className);
        setSelectedSubjects([]); // Reset subjects when class changes
    };

    const handleSubjectToggle = (subject) => {
        setSelectedSubjects(prev =>
            prev.includes(subject)
                ? prev.filter(s => s !== subject)
                : [...prev, subject]
        );
    };

    const handleSkip = async () => {
        try {
            setLoading(true);
            await skipOnboarding();
            navigate('/app');
        } catch (error) {
            console.error('Error skipping onboarding:', error);
            alert('Failed to skip onboarding. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        if (step === 1) {
            // Save name and move to class selection
            if (name.trim()) {
                await updateProfile({ name: name.trim() });
            }
            setStep(2);
        } else if (step === 2) {
            // Move to subject selection
            setStep(3);
        } else {
            // Final step - save everything
            await handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Save profile with class and subjects
            await updateProfile({
                name: name.trim(),
                class: selectedClass,
                subjects: selectedSubjects
            });

            // Mark onboarding as completed
            await completeOnboarding();

            // Navigate to dashboard
            navigate('/app');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const availableSubjects = selectedClass ? getSubjectsForClass(selectedClass) : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-4 font-body">
            <Card className="w-full max-w-2xl min-h-[600px] flex flex-col">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-heading font-bold text-primary mb-2">
                        Welcome to Shikshak! 🎉
                    </h1>
                    <p className="text-text-secondary">
                        Let's personalize your learning experience
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-2 rounded-full transition-all duration-300 ${step >= s ? 'w-12 bg-primary' : 'w-8 bg-gray-200'
                                }`}
                        />
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Name */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -50, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <GraduationCap className="text-primary" size={32} />
                                    </div>
                                    <h2 className="text-2xl font-heading font-bold mb-2">
                                        What should we call you?
                                    </h2>
                                    <p className="text-text-secondary text-sm">
                                        This helps us personalize your experience
                                    </p>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-lg"
                                        autoFocus
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Class Selection */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -50, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="text-secondary" size={32} />
                                    </div>
                                    <h2 className="text-2xl font-heading font-bold mb-2">
                                        Which class are you in?
                                    </h2>
                                    <p className="text-text-secondary text-sm">
                                        We'll customize content for your grade level
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {['5th', '6th', '7th', '8th'].map((cls) => (
                                        <motion.button
                                            key={cls}
                                            onClick={() => handleClassSelect(cls)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`p-6 rounded-xl border-2 transition-all ${selectedClass === cls
                                                    ? 'border-primary bg-primary/10 text-primary font-bold shadow-lg'
                                                    : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="text-3xl mb-2">
                                                {cls === '5th' && '📚'}
                                                {cls === '6th' && '📖'}
                                                {cls === '7th' && '📝'}
                                                {cls === '8th' && '🎓'}
                                            </div>
                                            <div className="text-xl font-bold">Class {cls}</div>
                                            {selectedClass === cls && (
                                                <div className="mt-2">
                                                    <Check className="mx-auto text-primary" size={20} />
                                                </div>
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Subject Selection */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -50, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check className="text-purple-600" size={32} />
                                    </div>
                                    <h2 className="text-2xl font-heading font-bold mb-2">
                                        Select your subjects
                                    </h2>
                                    <p className="text-text-secondary text-sm">
                                        Choose the subjects you want to focus on
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    {availableSubjects.map((subject) => (
                                        <motion.button
                                            key={subject}
                                            onClick={() => handleSubjectToggle(subject)}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${selectedSubjects.includes(subject)
                                                    ? 'border-primary bg-primary/10 text-primary font-bold'
                                                    : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="text-lg">{subject}</span>
                                            {selectedSubjects.includes(subject) && (
                                                <Check size={20} className="text-primary" />
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                                {selectedSubjects.length === 0 && (
                                    <p className="text-center text-sm text-text-secondary">
                                        Select at least one subject to continue
                                    </p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Actions */}
                <div className="mt-8 flex justify-between items-center">
                    <Button
                        variant="ghost"
                        onClick={handleSkip}
                        disabled={loading}
                        className="text-text-secondary"
                    >
                        Skip for now
                    </Button>
                    <div className="flex gap-3">
                        {step > 1 && (
                            <Button
                                variant="outline"
                                onClick={() => setStep(step - 1)}
                                disabled={loading}
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            onClick={handleNext}
                            disabled={
                                (step === 1 && !name.trim()) ||
                                (step === 2 && !selectedClass) ||
                                (step === 3 && selectedSubjects.length === 0) ||
                                loading
                            }
                            className="flex items-center gap-2"
                        >
                            {step === 3 ? (
                                loading ? 'Setting up...' : 'Complete Setup'
                            ) : (
                                <>
                                    Next <ChevronRight size={18} />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
