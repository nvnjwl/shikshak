import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { User, BookOpen, LogOut, Crown, ArrowLeft, Check, Save, X, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { sendTestEmail } from '../../services/email';

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

    // BYOK State
    const [useOwnApiKey, setUseOwnApiKey] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [apiKeyStatus, setApiKeyStatus] = useState(null);
    const [verifyingKey, setVerifyingKey] = useState(false);

    useEffect(() => {
        if (profile) {
            setUseOwnApiKey(profile.useOwnApiKey || false);
            setApiKey(profile.apiKey || '');
            setApiKeyStatus(profile.apiKeyStatus || null);
            setEmailNotifications(profile.emailNotifications ?? true);
        }
    }, [profile]);

    // Notification State
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [sendingTestEmail, setSendingTestEmail] = useState(false);

    const handleToggleNotifications = async (enabled) => {
        setEmailNotifications(enabled);
        try {
            await updateProfile({ emailNotifications: enabled });
            toast.success(enabled ? 'Email notifications enabled' : 'Email notifications disabled');
        } catch (error) {
            console.error('Error updating notification settings:', error);
            toast.error('Failed to update settings');
        }
    };

    const handleSendTestEmail = async () => {
        if (!currentUser?.email) {
            toast.error('No email address found');
            return;
        }

        setSendingTestEmail(true);
        try {
            const result = await sendTestEmail(currentUser);
            if (result.success) {
                toast.success('Test email sent! Check your inbox 📧');
            } else {
                toast.error('Failed to send email. Check API keys.');
            }
        } catch (error) {
            console.error('Error sending test email:', error);
            toast.error('Failed to send test email');
        } finally {
            setSendingTestEmail(false);
        }
    };

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

    // BYOK Handlers
    const handleToggleBYOK = async (enabled) => {
        setUseOwnApiKey(enabled);
        if (!enabled) {
            // Disable BYOK and remove key
            try {
                await updateProfile({
                    useOwnApiKey: false,
                    apiKey: null,
                    apiKeyStatus: null,
                    apiKeyLastVerified: null
                });
                setApiKey('');
                setApiKeyStatus(null);
                toast.success('Switched back to platform key');
            } catch (error) {
                console.error('Error disabling BYOK:', error);
                toast.error('Failed to update settings');
            }
        }
    };

    const handleVerifyApiKey = async () => {
        if (!apiKey || apiKey.trim().length < 20) {
            toast.error('Please enter a valid API key');
            return;
        }

        setVerifyingKey(true);
        try {
            // Import AI service for verification
            const { verifyGeminiKey } = await import('../../services/ai');

            const isValid = await verifyGeminiKey(apiKey.trim());

            if (isValid) {
                // Save to profile
                await updateProfile({
                    useOwnApiKey: true,
                    apiKey: apiKey.trim(),
                    apiKeyStatus: 'active',
                    apiKeyLastVerified: new Date().toISOString()
                });
                setApiKeyStatus('active');
                toast.success('API key verified and saved! 🎉');
            } else {
                setApiKeyStatus('invalid');
                toast.error('Invalid API key. Please check and try again.');
            }
        } catch (error) {
            console.error('Error verifying API key:', error);
            setApiKeyStatus('invalid');
            toast.error('Failed to verify key. Please try again.');
        } finally {
            setVerifyingKey(false);
        }
    };

    const handleRemoveApiKey = async () => {
        if (window.confirm('Are you sure you want to remove your API key? You\'ll switch back to the platform key with rate limits.')) {
            try {
                await updateProfile({
                    useOwnApiKey: false,
                    apiKey: null,
                    apiKeyStatus: null,
                    apiKeyLastVerified: null
                });
                setUseOwnApiKey(false);
                setApiKey('');
                setApiKeyStatus(null);
                toast.success('API key removed successfully');
            } catch (error) {
                console.error('Error removing API key:', error);
                toast.error('Failed to remove key');
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

                {/* AI Configuration Section */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                        <BookOpen className="text-purple-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-heading font-bold">AI Configuration</h2>
                        <p className="text-sm text-text-secondary">Use your own Gemini API key for unlimited access</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h3 className="font-bold text-gray-900">Bring Your Own Key (BYOK)</h3>
                            <p className="text-sm text-text-secondary">Use your personal Gemini API key instead of the platform key</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={useOwnApiKey}
                                onChange={(e) => handleToggleBYOK(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>

                    {useOwnApiKey && (
                        <div className="p-4 border border-gray-200 rounded-lg space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Gemini API Key
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="AIzaSy..."
                                        className="flex-1 p-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none font-mono text-sm"
                                        disabled={apiKeyStatus === 'active'}
                                    />
                                    {apiKeyStatus === 'active' ? (
                                        <Button
                                            variant="outline"
                                            onClick={handleRemoveApiKey}
                                            className="text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50"
                                        >
                                            Remove
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleVerifyApiKey}
                                            disabled={verifyingKey || !apiKey}
                                            className="bg-purple-600 hover:bg-purple-700"
                                        >
                                            {verifyingKey ? 'Verifying...' : 'Verify & Save'}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {apiKeyStatus === 'active' && (
                                <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                                    <Check size={16} />
                                    <span>API Key verified and active! You have unlimited access.</span>
                                </div>
                            )}

                            <div className="text-xs text-text-secondary">
                                <p>Don't have a key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Get one from Google AI Studio</a> (it's free!)</p>
                                <p className="mt-1">Your key is stored securely on your device and never shared.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Notifications Section */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <Mail className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-heading font-bold">Notifications</h2>
                        <p className="text-sm text-text-secondary">Manage how we contact you</p>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h3 className="font-bold text-gray-900">Email Notifications</h3>
                            <p className="text-sm text-text-secondary">Receive important updates and progress reports</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={emailNotifications}
                                onChange={(e) => handleToggleNotifications(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    {emailNotifications && (
                        <div className="flex justify-end">
                            <Button
                                variant="outline"
                                onClick={handleSendTestEmail}
                                disabled={sendingTestEmail}
                                className="text-sm"
                            >
                                {sendingTestEmail ? 'Sending...' : 'Send Test Email'}
                            </Button>
                        </div>
                    )}
                </div>

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
