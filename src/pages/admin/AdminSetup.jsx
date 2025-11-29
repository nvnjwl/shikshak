import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSetup() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const navigate = useNavigate();

    const setupAdmin = async () => {
        const adminEmail = 'admin@edutainverse.com';
        const adminPassword = 'admin123';

        setLoading(true);
        setStatus(null);

        try {
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
            const user = userCredential.user;

            // Create admin profile in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                profile: {
                    name: 'Admin',
                    email: adminEmail,
                    isAdmin: true,
                    onboardingCompleted: true,
                    onboardingSkipped: false,
                    createdAt: new Date().toISOString()
                }
            });

            setStatus({
                type: 'success',
                message: 'Admin user created successfully!',
                details: `Email: ${adminEmail}\nPassword: ${adminPassword}`
            });

            toast.success('Admin account created! You can now login.');

            // Redirect to admin login after 3 seconds
            setTimeout(() => {
                navigate('/admin/login');
            }, 3000);

        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setStatus({
                    type: 'warning',
                    message: 'Admin user already exists',
                    details: 'The admin account is already set up. You can login at /admin/login'
                });
                toast.error('Admin already exists!');
            } else {
                setStatus({
                    type: 'error',
                    message: 'Error creating admin user',
                    details: error.message
                });
                toast.error('Failed to create admin account');
            }
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
                        Admin Setup
                    </h1>
                    <p className="text-text-secondary">
                        Initialize the admin account for Shikshak
                    </p>
                </div>

                {!status && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                            <p className="font-medium">Admin Credentials:</p>
                            <p className="text-text-secondary">Email: admin@edutainverse.com</p>
                            <p className="text-text-secondary">Password: admin123</p>
                        </div>

                        <Button
                            onClick={setupAdmin}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
                        </Button>

                        <p className="text-xs text-text-secondary text-center">
                            This will create the admin user in Firebase Authentication and Firestore
                        </p>
                    </div>
                )}

                {status && (
                    <div className={`p-4 rounded-lg ${status.type === 'success' ? 'bg-green-50 border border-green-200' :
                            status.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                                'bg-red-50 border border-red-200'
                        }`}>
                        <div className="flex items-start gap-3">
                            {status.type === 'success' && <CheckCircle className="text-green-600 flex-shrink-0" size={24} />}
                            {status.type === 'warning' && <AlertCircle className="text-yellow-600 flex-shrink-0" size={24} />}
                            {status.type === 'error' && <AlertCircle className="text-red-600 flex-shrink-0" size={24} />}

                            <div className="flex-1">
                                <h3 className={`font-bold mb-1 ${status.type === 'success' ? 'text-green-900' :
                                        status.type === 'warning' ? 'text-yellow-900' :
                                            'text-red-900'
                                    }`}>
                                    {status.message}
                                </h3>
                                <p className={`text-sm whitespace-pre-line ${status.type === 'success' ? 'text-green-700' :
                                        status.type === 'warning' ? 'text-yellow-700' :
                                            'text-red-700'
                                    }`}>
                                    {status.details}
                                </p>
                            </div>
                        </div>

                        {status.type === 'success' && (
                            <p className="text-sm text-green-700 mt-4 text-center">
                                Redirecting to admin login...
                            </p>
                        )}

                        {status.type !== 'success' && (
                            <div className="mt-4 flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/admin/login')}
                                    className="flex-1"
                                >
                                    Go to Login
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setStatus(null)}
                                    className="flex-1"
                                >
                                    Try Again
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm text-text-secondary hover:text-primary transition-colors"
                    >
                        ← Back to Home
                    </button>
                </div>
            </Card>
        </div>
    );
}
