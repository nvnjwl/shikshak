import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const { plan, amount, paymentId } = location.state || {};

    useEffect(() => {
        // Trigger confetti animation
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#6366F1', '#8B5CF6', '#EC4899'],
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#6366F1', '#8B5CF6', '#EC4899'],
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    if (!plan) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Invalid Access</h2>
                    <Button onClick={() => navigate('/app')}>Go to Dashboard</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-primary/5 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full"
            >
                <Card className="p-8 md:p-12 text-center">
                    {/* Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle className="text-green-600" size={56} />
                    </motion.div>

                    {/* Success Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h1 className="text-4xl font-heading font-bold mb-4">
                            Payment Successful! 🎉
                        </h1>
                        <p className="text-xl text-text-secondary mb-8">
                            Welcome to Shikshak Premium! Your learning journey starts now.
                        </p>
                    </motion.div>

                    {/* Payment Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-primary/5 rounded-xl p-6 mb-8"
                    >
                        <div className="grid md:grid-cols-3 gap-4 text-left">
                            <div>
                                <p className="text-sm text-text-secondary mb-1">Plan</p>
                                <p className="font-bold text-primary">{plan}</p>
                            </div>
                            <div>
                                <p className="text-sm text-text-secondary mb-1">Amount Paid</p>
                                <p className="font-bold">₹{amount}</p>
                            </div>
                            <div>
                                <p className="text-sm text-text-secondary mb-1">Payment ID</p>
                                <p className="font-mono text-xs">{paymentId?.slice(0, 20)}...</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Next Steps */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                            <Sparkles className="text-primary" />
                            What's Next?
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4 text-left">
                            {[
                                {
                                    step: '1',
                                    title: 'Explore Dashboard',
                                    desc: 'Check out your personalized learning dashboard',
                                },
                                {
                                    step: '2',
                                    title: 'Start Learning',
                                    desc: 'Begin with any subject or topic you like',
                                },
                                {
                                    step: '3',
                                    title: 'Track Progress',
                                    desc: 'Monitor your improvement and achievements',
                                },
                            ].map((item) => (
                                <div key={item.step} className="bg-white rounded-lg p-4 border border-gray-100">
                                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-2">
                                        {item.step}
                                    </div>
                                    <h3 className="font-bold mb-1">{item.title}</h3>
                                    <p className="text-sm text-text-secondary">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Button
                            onClick={() => navigate('/app')}
                            className="text-lg px-8 py-6"
                        >
                            Go to Dashboard
                            <ArrowRight size={20} />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/syllabus')}
                            className="text-lg px-8 py-6"
                        >
                            Browse Syllabus
                        </Button>
                    </motion.div>

                    {/* Receipt Note */}
                    <p className="text-sm text-text-secondary mt-8">
                        📧 A payment receipt has been sent to your email
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}
