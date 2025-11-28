import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setLoading(true);
            await signup(email, password);
            navigate('/onboarding'); // Redirect to profile setup
        } catch (err) {
            setError('Failed to create an account: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 font-body">
            <Card className="w-full max-w-md">
                <h2 className="text-3xl text-center mb-2 text-primary font-heading">Join Shikshak</h2>
                <p className="text-center text-text-secondary mb-6">Your personal AI tutor awaits!</p>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-text-secondary mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-text-secondary mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-text-secondary mb-1">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button disabled={loading} className="w-full mt-6">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>
                <div className="w-full text-center mt-4">
                    <span className="text-text-secondary">Already have an account? </span>
                    <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link>
                </div>
            </Card>
        </div>
    );
}
