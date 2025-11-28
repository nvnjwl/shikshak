import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';

export default function ParentLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate('/parent/dashboard');
        } catch (error) {
            alert("Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-secondary/10 flex items-center justify-center p-4 font-body">
            <Card className="w-full max-w-md border-t-4 border-t-secondary">
                <h2 className="text-2xl font-heading text-center mb-2 text-secondary">Parent Portal</h2>
                <p className="text-center text-text-secondary mb-6">Monitor your child's progress</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-text-secondary mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-text-secondary mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                            required
                        />
                    </div>
                    <Button variant="secondary" disabled={loading} className="w-full mt-6">
                        {loading ? 'Accessing...' : 'View Dashboard'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
