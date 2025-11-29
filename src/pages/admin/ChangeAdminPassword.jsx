import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChangeAdminPassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const navigate = useNavigate();

    const adminEmail = 'admin@edutainverse.com';

    const handleChangePassword = async (e) => {
        e.preventDefault();

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (newPassword === currentPassword) {
            toast.error('New password must be different from current password');
            return;
        }

        setLoading(true);
        setStatus(null);

        try {
            // Sign in with current credentials
            const userCredential = await signInWithEmailAndPassword(auth, adminEmail, currentPassword);
            const user = userCredential.user;

            // Update password
            await updatePassword(user, newPassword);

            setStatus({
                type: 'success',
                message: 'Password changed successfully!',
                details: 'You can now login with your new password.'
            });

            toast.success('Password changed successfully!');

            // Clear form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/admin/login');
            }, 3000);

        } catch (error) {
            let errorMessage = 'Failed to change password';

            if (error.code === 'auth/wrong-password') {
                errorMessage = 'Current password is incorrect';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'Admin user not found';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'New password is too weak (min 6 characters)';
            } else if (error.code === 'auth/requires-recent-login') {
                errorMessage = 'Session expired. Please login again.';
            }

            setStatus({
                type: 'error',
                message: 'Password Change Failed',
                details: errorMessage
            });

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-4 font-body">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="text-primary" size={32} />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-primary mb-2">
                        Change Admin Password
                    </h1>
                    <p className="text-text-secondary">
                        Update your admin account password
                    </p>
                </div>

                {!status && (
                    <form onSubmit={handleChangePassword} className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg text-sm text-text-secondary">
                            <p className="font-medium mb-1">Admin Email:</p>
                            <p>{adminEmail}</p>
                        </div>

                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                                <input
                                    type={showCurrent ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Enter current password"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary"
                                >
                                    {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Enter new password"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary"
                                >
                                    {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <p className="text-xs text-text-secondary mt-1">
                                Minimum 6 characters
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 p-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Confirm new password"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary"
                                >
                                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Changing Password...' : 'Change Password'}
                        </Button>
                    </form>
                )}

                {status && (
                    <div className={`p-4 rounded-lg ${status.type === 'success' ? 'bg-green-50 border border-green-200' :
                            'bg-red-50 border border-red-200'
                        }`}>
                        <div className="flex items-start gap-3">
                            {status.type === 'success' ? (
                                <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                            ) : (
                                <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
                            )}

                            <div className="flex-1">
                                <h3 className={`font-bold mb-1 ${status.type === 'success' ? 'text-green-900' : 'text-red-900'
                                    }`}>
                                    {status.message}
                                </h3>
                                <p className={`text-sm ${status.type === 'success' ? 'text-green-700' : 'text-red-700'
                                    }`}>
                                    {status.details}
                                </p>
                            </div>
                        </div>

                        {status.type === 'success' && (
                            <p className="text-sm text-green-700 mt-4 text-center">
                                Redirecting to login...
                            </p>
                        )}

                        {status.type === 'error' && (
                            <Button
                                variant="outline"
                                onClick={() => setStatus(null)}
                                className="w-full mt-4"
                            >
                                Try Again
                            </Button>
                        )}
                    </div>
                )}

                <div className="mt-6 text-center space-y-2">
                    <button
                        onClick={() => navigate('/admin/login')}
                        className="text-sm text-text-secondary hover:text-primary transition-colors"
                    >
                        ← Back to Login
                    </button>
                </div>
            </Card>
        </div>
    );
}
