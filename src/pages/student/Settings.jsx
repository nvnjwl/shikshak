import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { User, BookOpen, LogOut, Crown, ArrowLeft, Check, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
    const navigate = useNavigate();
    const { currentUser, signOut } = useAuth();
    const { profile, updateProfile, getSubjectsForClass, SUBJECTS_BY_CLASS } = useProfile();
    const { subscription } = useSubscription();

    // Edit states
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [name, setName] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profile) {
            setName(profile.name || '');
            setSelectedClass(profile.class || '');
            setSelectedSubjects(profile.subjects || []);
        }
    }, [profile]);

    const handleSaveProfile = async () => {
        if (!name.trim()) {
            toast.error('Name cannot be empty');
            return;
        }

        if (!selectedClass) {
            toast.error('Please select a class');
            return;
        }

        if (selectedSubjects.length === 0) {
            toast.error('Please select at least one subject');
            return;
        }

        setLoading(true);
        try {
            await updateProfile({
                name: name.trim(),
                class: selectedClass,
                subjects: selectedSubjects
            });
            setIsEditingProfile(false);
            toast.success('Profile updated successfully! 🎉');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setName(profile?.name || '');
        setSelectedClass(profile?.class || '');
        setSelectedSubjects(profile?.subjects || []);
        setIsEditingProfile(false);
    };

    const handleSubjectToggle = (subject) => {
        setSelectedSubjects(prev =>
            prev.includes(subject)
                ? prev.filter(s => s !== subject)
                : [...prev, subject]
        );
    };

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            try {
                await signOut();
                toast.success('Logged out successfully!');
                navigate('/login');
            } catch (error) {
                console.error('Failed to log out', error);
                toast.error('Failed to logout. Please try again.');
            }
        }
    };

    const availableSubjects = selectedClass ? getSubjectsForClass(selectedClass) : [];

    return (
        <div className="min-h-screen bg-background font-body">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/app')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-heading font-bold text-primary">Settings</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
                {/* Profile Section */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <User className="text-primary" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-heading font-bold">Profile Information</h2>
                                <p className="text-sm text-text-secondary">Manage your personal details</p>
                            </div>
                        </div>
                        {!isEditingProfile && (
                            <Button
                                variant="outline"
                                onClick={() => setIsEditingProfile(true)}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </div>

                    {isEditingProfile ? (
                        <div className="space-y-6">
                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Enter your name"
                                />
                            </div>

                            {/* Class Selection */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Class
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {['5th', '6th', '7th', '8th'].map((cls) => (
                                        <button
                                            key={cls}
                                            onClick={() => setSelectedClass(cls)}
                                            className={`p-3 rounded-lg border-2 transition-all ${selectedClass === cls
                                                    ? 'border-primary bg-primary/10 text-primary font-bold'
                                                    : 'border-gray-200 hover:border-primary/50'
                                                }`}
                                        >
                                            Class {cls}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Subjects Selection */}
                            {selectedClass && (
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        Subjects
                                    </label>
                                    <div className="space-y-2">
                                        {availableSubjects.map((subject) => (
                                            <button
                                                key={subject}
                                                onClick={() => handleSubjectToggle(subject)}
                                                className={`w-full p-3 rounded-lg border-2 flex items-center justify-between transition-all ${selectedSubjects.includes(subject)
                                                        ? 'border-primary bg-primary/10 text-primary font-bold'
                                                        : 'border-gray-200 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span>{subject}</span>
                                                {selectedSubjects.includes(subject) && (
                                                    <Check size={20} className="text-primary" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={loading}
                                    className="flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={handleCancelEdit}
                                    disabled={loading}
                                    className="flex items-center gap-2"
                                >
                                    <X size={18} />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-text-secondary">Name</p>
                                <p className="text-lg font-medium">{profile?.name || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-text-secondary">Email</p>
                                <p className="text-lg font-medium">{currentUser?.email || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-text-secondary">Class</p>
                                <p className="text-lg font-medium">
                                    {profile?.class ? `Class ${profile.class}` : 'Not set'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-text-secondary mb-2">Subjects</p>
                                <div className="flex flex-wrap gap-2">
                                    {profile?.subjects && profile.subjects.length > 0 ? (
                                        profile.subjects.map((subject) => (
                                            <span
                                                key={subject}
                                                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                                            >
                                                {subject}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-text-secondary">No subjects selected</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Subscription Section */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Crown className="text-yellow-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-heading font-bold">Subscription</h2>
                            <p className="text-sm text-text-secondary">Manage your plan</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-text-secondary">Current Plan</p>
                            <p className="text-lg font-medium">{subscription?.plan || 'Free Plan'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Status</p>
                            <p className="text-lg font-medium capitalize">
                                {subscription?.status || 'Active'}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/pricing')}
                            className="w-full sm:w-auto"
                        >
                            Upgrade Plan
                        </Button>
                    </div>
                </Card>

                {/* Account Actions */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-red-100 rounded-full">
                            <LogOut className="text-red-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-heading font-bold">Account Actions</h2>
                            <p className="text-sm text-text-secondary">Manage your account</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto"
                    >
                        <LogOut size={18} className="mr-2" />
                        Logout
                    </Button>
                </Card>
            </div>
        </div>
    );
}
