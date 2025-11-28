import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFeatureAccess from '../hooks/useFeatureAccess';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Feature Gate Component
 * Wraps content that requires subscription access
 * Shows upgrade prompt if user doesn't have access
 */
export default function FeatureGate({
    featureName,
    children,
    fallback = null,
    showUpgradePrompt = true,
    customMessage = null,
}) {
    const { canAccess, getTier, getTrialInfo } = useFeatureAccess();
    const navigate = useNavigate();
    const [showPrompt, setShowPrompt] = useState(true);

    const hasAccess = canAccess(featureName);
    const tier = getTier();
    const { isOnTrial, daysRemaining } = getTrialInfo();

    // If user has access, render children
    if (hasAccess) {
        return <>{children}</>;
    }

    // If fallback provided, render it
    if (fallback) {
        return <>{fallback}</>;
    }

    // Show upgrade prompt
    if (showUpgradePrompt && showPrompt) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative"
                >
                    <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-purple-100 rounded-2xl p-8 text-center border-2 border-primary/20">
                        {/* Lock Icon */}
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="text-primary" size={32} />
                        </div>

                        {/* Message */}
                        <h3 className="text-2xl font-heading font-bold mb-2">
                            {customMessage || 'Premium Feature'}
                        </h3>
                        <p className="text-text-secondary mb-6">
                            {isOnTrial
                                ? `You have ${daysRemaining} days left in your trial. Upgrade now to continue using this feature after your trial ends.`
                                : 'Upgrade to Premium to unlock unlimited access to all features.'
                            }
                        </p>

                        {/* Benefits */}
                        <div className="bg-white/80 rounded-xl p-4 mb-6 text-left max-w-md mx-auto">
                            <p className="font-bold mb-3 flex items-center gap-2">
                                <Sparkles className="text-primary" size={20} />
                                Premium Benefits:
                            </p>
                            <ul className="space-y-2 text-sm">
                                {[
                                    'Unlimited AI tutoring sessions',
                                    'Access to all subjects',
                                    'Unlimited practice questions',
                                    'Detailed progress analytics',
                                    'Parent dashboard access',
                                ].map((benefit, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                onClick={() => navigate('/pricing')}
                                className="text-lg px-8 py-4"
                            >
                                Upgrade Now
                                <ArrowRight size={20} />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowPrompt(false)}
                            >
                                Maybe Later
                            </Button>
                        </div>

                        {/* Trial Info */}
                        {!isOnTrial && (
                            <p className="text-sm text-text-secondary mt-4">
                                💡 Start with a 7-day free trial • No credit card required
                            </p>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // Don't render anything if prompt dismissed
    return null;
}
