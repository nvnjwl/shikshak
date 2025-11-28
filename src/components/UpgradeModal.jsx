import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function UpgradeModal({ isOpen, onClose, feature = null }) {
    const navigate = useNavigate();

    const handleUpgrade = () => {
        onClose();
        navigate('/pricing');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-t-2xl">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles size={32} />
                            <h2 className="text-3xl font-heading font-bold">Upgrade to Premium</h2>
                        </div>
                        <p className="text-white/90">
                            {feature
                                ? `Unlock ${feature} and all premium features`
                                : 'Unlock unlimited learning potential'
                            }
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Comparison Table */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold mb-4">Free vs Premium</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Free Tier */}
                                <div className="border-2 border-gray-200 rounded-xl p-4">
                                    <h4 className="font-bold text-lg mb-3 text-gray-600">Free Tier</h4>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-400 mt-1">•</span>
                                            <span className="text-gray-600">5 AI questions per day</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-400 mt-1">•</span>
                                            <span className="text-gray-600">Access to 1 subject only</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-400 mt-1">•</span>
                                            <span className="text-gray-600">5 practice questions per day</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-400 mt-1">•</span>
                                            <span className="text-gray-600">Basic progress tracking</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Premium Tier */}
                                <div className="border-2 border-primary rounded-xl p-4 bg-primary/5 relative">
                                    <div className="absolute -top-3 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                                        RECOMMENDED
                                    </div>
                                    <h4 className="font-bold text-lg mb-3 text-primary">Premium</h4>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <Check size={16} className="text-green-500 flex-shrink-0 mt-1" />
                                            <span><strong>Unlimited</strong> AI tutoring</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check size={16} className="text-green-500 flex-shrink-0 mt-1" />
                                            <span><strong>All subjects</strong> access</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check size={16} className="text-green-500 flex-shrink-0 mt-1" />
                                            <span><strong>Unlimited</strong> practice questions</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check size={16} className="text-green-500 flex-shrink-0 mt-1" />
                                            <span><strong>Advanced</strong> analytics</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check size={16} className="text-green-500 flex-shrink-0 mt-1" />
                                            <span><strong>Parent dashboard</strong></span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check size={16} className="text-green-500 flex-shrink-0 mt-1" />
                                            <span><strong>Study recordings</strong></span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check size={16} className="text-green-500 flex-shrink-0 mt-1" />
                                            <span><strong>Priority support</strong></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 mb-6 text-center">
                            <p className="text-sm text-text-secondary mb-2">Starting from</p>
                            <div className="text-4xl font-bold text-primary mb-2">
                                ₹1,400<span className="text-lg text-text-secondary">/month</span>
                            </div>
                            <p className="text-sm text-green-600 font-semibold">
                                Save up to 40% • Higher classes get bigger discounts!
                            </p>
                        </div>

                        {/* Testimonial */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                            <div className="flex gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400">⭐</span>
                                ))}
                            </div>
                            <p className="text-sm italic text-text-secondary mb-2">
                                "My daughter's grades improved from 65% to 88% in just 3 months!
                                The unlimited AI tutoring is a game-changer."
                            </p>
                            <p className="text-xs font-semibold">- Parent of Class 6 Student</p>
                        </div>

                        {/* CTA */}
                        <div className="space-y-3">
                            <Button
                                onClick={handleUpgrade}
                                className="w-full text-lg py-6"
                            >
                                View Pricing Plans
                                <ArrowRight size={20} />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="w-full"
                            >
                                Maybe Later
                            </Button>
                        </div>

                        {/* Guarantee */}
                        <p className="text-center text-sm text-text-secondary mt-4">
                            💯 7-day money-back guarantee • Cancel anytime
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
