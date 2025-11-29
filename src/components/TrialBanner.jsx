import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Button } from './ui/Button';
import { Clock, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrialBanner() {
    const navigate = useNavigate();
    const {
        isOnTrial,
        hasTrialExpired,
        canStartTrial,
        getTrialDaysRemaining,
        hasActiveSubscription
    } = useSubscription();
    const [dismissed, setDismissed] = useState(false);

    // Don't show if dismissed or has active subscription
    if (dismissed || hasActiveSubscription()) return null;

    // Show trial expiry warning
    if (hasTrialExpired()) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-gradient-to-r from-red-500 to-orange-500 text-white"
                >
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Clock className="animate-pulse" size={20} />
                            <div>
                                <p className="font-bold">Your trial has expired!</p>
                                <p className="text-sm opacity-90">Subscribe now to continue accessing all features</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => navigate('/pricing')}
                                className="bg-white text-red-600 hover:bg-gray-100"
                            >
                                Subscribe Now
                            </Button>
                            <button
                                onClick={() => setDismissed(true)}
                                className="p-1 hover:bg-white/20 rounded"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // Show active trial countdown
    if (isOnTrial()) {
        const daysLeft = getTrialDaysRemaining();
        const isUrgent = daysLeft <= 2;

        return (
            <AnimatePresence>
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`${isUrgent
                            ? 'bg-gradient-to-r from-orange-500 to-red-500'
                            : 'bg-gradient-to-r from-primary to-secondary'
                        } text-white`}
                >
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Sparkles className={isUrgent ? 'animate-pulse' : ''} size={20} />
                            <div>
                                <p className="font-bold">
                                    {daysLeft === 0 ? 'Last day' : `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`} in your trial!
                                </p>
                                <p className="text-sm opacity-90">
                                    Enjoying unlimited access? Subscribe to keep it forever
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => navigate('/pricing')}
                                className="bg-white text-primary hover:bg-gray-100"
                            >
                                Subscribe Now
                            </Button>
                            <button
                                onClick={() => setDismissed(true)}
                                className="p-1 hover:bg-white/20 rounded"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // Show trial offer for eligible users
    if (canStartTrial()) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Sparkles className="animate-bounce" size={20} />
                            <div>
                                <p className="font-bold">Try all premium features for just ₹1!</p>
                                <p className="text-sm opacity-90">
                                    7 days unlimited access • Cancel anytime
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => navigate('/pricing')}
                                className="bg-white text-purple-600 hover:bg-gray-100 font-bold"
                            >
                                Start ₹1 Trial
                            </Button>
                            <button
                                onClick={() => setDismissed(true)}
                                className="p-1 hover:bg-white/20 rounded"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    return null;
}
