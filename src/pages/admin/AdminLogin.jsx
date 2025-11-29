import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { isAdmin } = useProfile();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            // Check if admin status is synced, might need a moment or profile reload
            // For now, we rely on the redirect in AdminRoute or manual navigation
            navigate('/admin');
        } catch (err) {
            console.error(err);
            setError('Failed to log in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const setupDefaultAdmin = async () => {
        setLoading(true);
        setError('');
        const adminEmail = 'admin@edutainverse.com';
        const adminPass = 'admin123';

        try {
            // 1. Try to login first
            try {
                await login(adminEmail, adminPass);
                // If successful, ensure admin flag is true
                const user = auth.currentUser;
                await setDoc(doc(db, 'users', user.uid), {
                    profile: {
                        name: 'Super Admin',
                        email: adminEmail,
                        isAdmin: true,
                        role: 'admin',
                        createdAt: new Date().toISOString()
                    }
                }, { merge: true });
                navigate('/admin');
                return;
            } catch (loginErr) {
                // Login failed, likely user doesn't exist, proceed to create
                if (loginErr.code !== 'auth/user-not-found' && loginErr.code !== 'auth/invalid-credential') {
                    throw loginErr;
                }
            }

            // 2. Create user
            const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPass);
            const user = userCredential.user;

            // 3. Set admin profile
            await setDoc(doc(db, 'users', user.uid), {
                profile: {
                    name: 'Super Admin',
                    email: adminEmail,
                    isAdmin: true,
                    role: 'admin',
                    createdAt: new Date().toISOString()
                }
            });

            navigate('/admin');

        } catch (err) {
            console.error(err);
            setError('Failed to setup admin: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-body">
            <Card className="w-full max-w-md p-8 bg-white shadow-xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-2xl font-heading font-bold text-gray-900">Admin Portal</h1>
                    <p className="text-text-secondary mt-2">Sign in to manage Shikshak</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="admin@edutainverse.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-2.5"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <Lock size={18} className="mr-2" />}
                        Access Dashboard
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-xs text-center text-gray-500 mb-4">Development Tools</p>
                    <Button
                        variant="outline"
                        className="w-full text-xs"
                        onClick={setupDefaultAdmin}
                        disabled={loading}
                    >
                        Setup Default Admin (admin@edutainverse.com)
                    </Button>
                </div>
            </Card>
        </div>
    );
}
