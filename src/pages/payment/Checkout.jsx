import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { createOrder, displayRazorpay, savePaymentRecord } from '../../services/razorpay';
import { db } from '../../lib/firebase';
import { Check, Shield, CreditCard, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import logger from '../../utils/logger';
import CouponInput from '../../components/CouponInput';

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();
    const {
        activateSubscription,
        startTrial,
        activateTrial,
        hasUsedCoupon,
        canStartTrial,
        SUBSCRIPTION_PLANS,
        TRIAL_CONFIG,
        COUPONS
    } = useSubscription();

    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isTrial, setIsTrial] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);

    useEffect(() => {
        // Get plan and trial flag from navigation state
        const plan = location.state?.selectedClass || '6th';
        const isTrialFlow = location.state?.isTrial || false;

        setSelectedPlan(plan);
        setIsTrial(isTrialFlow);

        // Redirect if not logged in
        if (!currentUser) {
            navigate('/login', { state: { from: '/checkout', selectedClass: plan, isTrial: isTrialFlow } });
        }
    }, [currentUser, location.state, navigate]);

    if (!selectedPlan || !SUBSCRIPTION_PLANS[selectedPlan]) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Invalid Plan</h2>
                    <Button onClick={() => navigate('/pricing')}>View Pricing</Button>
                </Card>
            </div>
        );
    }

    const planDetails = SUBSCRIPTION_PLANS[selectedPlan];

    const handlePayment = async () => {
        setLoading(true);
        try {
            logger.info('Checkout', 'Initiating payment', { plan: selectedPlan });

            // Create order
            const orderResponse = await createOrder(
                planDetails.discounted,
                selectedPlan,
                {
                    userId: currentUser.uid,
                    email: currentUser.email,
                }
            );

            if (!orderResponse.success) {
                throw new Error('Failed to create order');
            }

            // Display Razorpay modal
            await displayRazorpay(
                {
                    ...orderResponse,
                    plan: selectedPlan,
                },
                {
                    userId: currentUser.uid,
                    email: currentUser.email,
                    name: currentUser.displayName || 'Student',
                },
                async (paymentData) => {
                    // Payment success
                    logger.success('Checkout', 'Payment successful', paymentData);

                    // Save payment record
                    await savePaymentRecord(db, paymentData, currentUser.uid);

                    // Activate subscription
                    await activateSubscription(selectedPlan, {
                        subscriptionId: paymentData.orderId,
                        paymentId: paymentData.paymentId,
                    });

                    // Redirect to success page
                    navigate('/payment/success', {
                        state: {
                            plan: selectedPlan,
                            amount: planDetails.discounted,
                            paymentId: paymentData.paymentId,
                        },
                    });
                },
                (error) => {
                    // Payment failure
                    logger.error('Checkout', 'Payment failed', error);
                    navigate('/payment/failure', {
                        state: {
                            plan: selectedPlan,
                            error: error.error || 'Payment failed',
                        },
                    });
                }
            );
        } catch (error) {
            logger.error('Checkout', 'Error in payment flow', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-heading font-bold mb-2">Complete Your Purchase</h1>
                    <p className="text-text-secondary">You're one step away from unlimited learning!</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Order Summary */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center pb-4 border-b">
                                <span className="font-semibold">Plan</span>
                                <span className="text-primary font-bold">{selectedPlan}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Original Price</span>
                                <span className="line-through text-text-secondary">₹{planDetails.original}</span>
                            </div>

                            <div className="flex justify-between items-center text-green-600">
                                <span>Discount ({planDetails.discount}%)</span>
                                <span>-₹{planDetails.original - planDetails.discounted}</span>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t text-xl font-bold">
                                <span>Total</span>
                                <span className="text-primary">₹{planDetails.discounted}/month</span>
                            </div>
                        </div>

                        {/* Features Included */}
                        <div className="bg-primary/5 rounded-xl p-4 mb-6">
                            <h3 className="font-bold mb-3 flex items-center gap-2">
                                <Check className="text-green-500" size={20} />
                                What's Included
                            </h3>
                            <ul className="space-y-2 text-sm">
                                {[
                                    'Unlimited AI Tutoring',
                                    'All Subjects Access',
                                    'Unlimited Practice Questions',
                                    'Progress Analytics',
                                    'Parent Dashboard',
                                    '24/7 Support',
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <Check size={16} className="text-green-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Payment Button */}
                        <Button
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full text-lg py-6"
                        >
                            {loading ? (
                                'Processing...'
                            ) : (
                                <>
                                    <CreditCard size={20} />
                                    Pay ₹{planDetails.discounted}
                                </>
                            )}
                        </Button>

                        <p className="text-xs text-center text-text-secondary mt-4">
                            By proceeding, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </Card>

                    {/* Security & Guarantees */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Shield className="text-green-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-2">Secure Payment</h3>
                                        <p className="text-sm text-text-secondary">
                                            Your payment information is encrypted and secure. We use Razorpay,
                                            India's most trusted payment gateway.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check className="text-blue-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-2">7-Day Money Back Guarantee</h3>
                                        <p className="text-sm text-text-secondary">
                                            Not satisfied? Get a full refund within 7 days, no questions asked.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Lock className="text-purple-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-2">Cancel Anytime</h3>
                                        <p className="text-sm text-text-secondary">
                                            No long-term commitment. Cancel your subscription anytime from your dashboard.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Trust Badges */}
                        <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
                            <p className="text-center text-sm font-semibold mb-3">Trusted by 10,000+ Students</p>
                            <div className="flex justify-center gap-4 text-2xl">
                                <span>⭐⭐⭐⭐⭐</span>
                            </div>
                            <p className="text-center text-xs text-text-secondary mt-2">
                                4.9/5 rating from parents
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
