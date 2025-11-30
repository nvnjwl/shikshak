import { useState } from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { AlertTriangle, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ClassSwitcher({ onClose }) {
    const { profile, switchClass, SUBJECTS_BY_CLASS } = useProfile();
    const [selectedClass, setSelectedClass] = useState(profile?.class || '6th');
    const [confirming, setConfirming] = useState(false);
    const [loading, setLoading] = useState(false);

    const availableClasses = Object.keys(SUBJECTS_BY_CLASS);

    const handleSwitch = async () => {
        if (selectedClass === profile?.class) {
            onClose();
            return;
        }

        if (!confirming) {
            setConfirming(true);
            return;
        }

        try {
            setLoading(true);
            await switchClass(selectedClass);
            toast.success(`Switched to Class ${selectedClass}`);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to switch class");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6 bg-white relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold font-heading mb-4">Switch Class</h2>

                {!confirming ? (
                    <div className="space-y-4">
                        <p className="text-text-secondary">Select your new class. Your dashboard will be updated with the new syllabus.</p>

                        <div className="grid grid-cols-2 gap-3">
                            {availableClasses.map((cls) => (
                                <button
                                    key={cls}
                                    onClick={() => setSelectedClass(cls)}
                                    className={`p-3 rounded-xl border-2 transition-all ${selectedClass === cls
                                            ? 'border-primary bg-primary/5 text-primary font-bold'
                                            : 'border-gray-200 hover:border-primary/50'
                                        }`}
                                >
                                    Class {cls}
                                </button>
                            ))}
                        </div>

                        <Button className="w-full mt-4" onClick={handleSwitch}>
                            Continue
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3">
                            <AlertTriangle className="shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold">Warning: Progress Reset</h3>
                                <p className="text-sm mt-1">
                                    Switching to <strong>Class {selectedClass}</strong> will permanently delete all your progress and history for Class {profile?.class}.
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-center text-text-secondary">
                            Are you sure you want to proceed? This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                className="flex-1"
                                onClick={() => setConfirming(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleSwitch}
                                disabled={loading}
                            >
                                {loading ? 'Switching...' : 'Yes, Switch Class'}
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
