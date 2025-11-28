import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { XCircle, RefreshCw, HelpCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentFailure() {
    const navigate = useNavigate();
    const location = useLocation();
    const { plan, error } = location.state || {};

    const handleRetry = () => {
        navigate('/checkout', { state: { selectedClass: plan } });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-background to-orange/5 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full"
            >
                <Card className="p-8 md:p-12 text-center">
                    {/* Failure Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <XCircle className="text-red-600" size={56} />
                    </motion.div>

                    {/* Failure Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h1 className="text-4xl font-heading font-bold mb-4">
                            Payment Failed
                        </h1>
                        <p className="text-xl text-text-secondary mb-8">
                            Don't worry! Your payment was not processed.
                        </p>
                    </motion.div>

                    {/* Error Details */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8"
                        >
                            <p className="text-sm text-red-800">
                                <strong>Error:</strong> {error}
                            </p>
                        </motion.div>
                    )}

                    {/* Common Reasons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="text-left mb-8"
                    >
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <HelpCircle className="text-primary" />
                            Common Reasons for Payment Failure
                        </h2>
                        <ul className="space-y-2 text-text-secondary">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Insufficient balance in your account</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Incorrect card details or CVV</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Card limit exceeded</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Payment gateway timeout or network issue</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Bank declined the transaction</span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Button
                            onClick={handleRetry}
                            className="text-lg px-8 py-6"
                        >
                            <RefreshCw size={20} />
                            Try Again
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/pricing')}
                            className="text-lg px-8 py-6"
                        >
                            <ArrowLeft size={20} />
                            Back to Pricing
                        </Button>
                    </motion.div>

                    {/* Help Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="mt-8 pt-8 border-t"
                    >
                        <p className="text-sm text-text-secondary mb-4">
                            Still having trouble? We're here to help!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                            <a href="mailto:support@shikshak.com" className="text-primary hover:underline">
                                📧 support@shikshak.com
                            </a>
                            <a href="tel:+911234567890" className="text-primary hover:underline">
                                📞 +91 123 456 7890
                            </a>
                        </div>
                    </motion.div>
                </Card>
            </motion.div>
        </div>
    );
}
