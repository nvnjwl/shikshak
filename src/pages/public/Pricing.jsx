import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Check, Sparkles, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const pricingPlans = [
    {
        class: 'Class 4',
        originalPrice: 2000,
        discount: 30,
        features: ['All subjects (Math, EVS, English, Hindi)', 'AI Tutor 24/7', 'Homework Help', 'Practice Questions', 'Progress Tracking'],
        color: 'from-blue-400 to-blue-600',
        popular: false
    },
    {
        class: 'Class 5',
        originalPrice: 2500,
        discount: 32,
        features: ['All subjects (Math, EVS, English, Hindi)', 'AI Tutor 24/7', 'Homework Help', 'Practice Questions', 'Progress Tracking', 'Weekly Tests'],
        color: 'from-green-400 to-green-600',
        popular: false
    },
    {
        class: 'Class 6',
        originalPrice: 3000,
        discount: 35,
        features: ['All subjects (Math, Science, Social, English, Hindi)', 'AI Tutor 24/7', 'Homework Help', 'Practice Questions', 'Progress Tracking', 'Weekly Tests', 'Video Explanations'],
        color: 'from-yellow-400 to-yellow-600',
        popular: true
    },
    {
        class: 'Class 7',
        originalPrice: 3500,
        discount: 37,
        features: ['All subjects (Math, Science, Social, English, Hindi)', 'AI Tutor 24/7', 'Homework Help', 'Practice Questions', 'Progress Tracking', 'Weekly Tests', 'Video Explanations', 'Exam Preparation'],
        color: 'from-orange-400 to-orange-600',
        popular: false
    },
    {
        class: 'Class 8',
        originalPrice: 4000,
        discount: 40,
        features: ['All subjects (Math, Science, Social, English, Hindi)', 'AI Tutor 24/7', 'Homework Help', 'Practice Questions', 'Progress Tracking', 'Weekly Tests', 'Video Explanations', 'Exam Preparation', 'Board Exam Focus'],
        color: 'from-red-400 to-red-600',
        popular: false
    }
];

export default function Pricing() {
    const navigate = useNavigate();
    const [selectedClass, setSelectedClass] = useState('Class 6');

    const calculateDiscountedPrice = (original, discount) => {
        return Math.round(original * (1 - discount / 100));
    };

    const handleSubscribe = (classLevel) => {
        // Navigate to checkout page with selected plan
        navigate('/checkout', { state: { selectedClass: classLevel } });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 font-body">
            {/* Header */}
            <header className="bg-white shadow-sm p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-heading font-bold text-primary">Shikshak</h1>
                    <div className="flex gap-4">
                        <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
                        <Button onClick={() => navigate('/login')}>Login</Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl font-heading font-bold mb-4">
                        Choose Your <span className="text-primary">Learning Plan</span>
                    </h1>
                    <p className="text-xl text-text-secondary mb-2">
                        Higher classes get bigger discounts! 🎉
                    </p>
                    <p className="text-lg text-text-secondary">
                        All plans include unlimited AI tutoring, all subjects, and 24/7 support
                    </p>
                </motion.div>

                {/* Discount Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-6 mb-12 text-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Sparkles size={32} />
                        <h2 className="text-3xl font-bold">Limited Time Offer!</h2>
                        <Sparkles size={32} />
                    </div>
                    <p className="text-xl">Save 30-40% on all plans • Higher classes = Higher savings!</p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {pricingPlans.map((plan, index) => {
                        const discountedPrice = calculateDiscountedPrice(plan.originalPrice, plan.discount);
                        const savings = plan.originalPrice - discountedPrice;

                        return (
                            <motion.div
                                key={plan.class}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card
                                    className={`relative overflow-hidden transition-all hover:shadow-2xl ${plan.popular ? 'ring-4 ring-primary scale-105' : ''
                                        }`}
                                >
                                    {/* Popular Badge */}
                                    {plan.popular && (
                                        <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 rounded-bl-xl font-bold flex items-center gap-1">
                                            <Award size={16} />
                                            Most Popular
                                        </div>
                                    )}

                                    {/* Gradient Header */}
                                    <div className={`bg-gradient-to-r ${plan.color} text-white p-6 -m-6 mb-6`}>
                                        <h3 className="text-3xl font-heading font-bold mb-2">{plan.class}</h3>

                                        {/* Discount Badge */}
                                        <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold mb-4">
                                            🎉 {plan.discount}% OFF
                                        </div>

                                        {/* Pricing */}
                                        <div className="flex items-end gap-2 mb-2">
                                            <span className="text-2xl line-through opacity-70">₹{plan.originalPrice}</span>
                                            <span className="text-5xl font-bold">₹{discountedPrice}</span>
                                            <span className="text-xl mb-2">/month</span>
                                        </div>
                                        <p className="text-white/90">Save ₹{savings}/month!</p>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-3 mb-6">
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-2">
                                                <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-text-secondary">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <Button
                                        onClick={() => handleSubscribe(plan.class)}
                                        className="w-full text-lg py-6"
                                        variant={plan.popular ? 'primary' : 'outline'}
                                    >
                                        Start Learning {plan.class} 🚀
                                    </Button>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Comparison Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="p-6">
                        <h2 className="text-3xl font-heading font-bold mb-6 text-center">
                            Why Higher Classes Cost More? 📚
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6 text-center">
                            <div>
                                <TrendingUp size={48} className="mx-auto mb-3 text-primary" />
                                <h3 className="font-bold text-xl mb-2">More Subjects</h3>
                                <p className="text-text-secondary">
                                    Class 4-5: 4 subjects<br />
                                    Class 6-8: 5 subjects
                                </p>
                            </div>
                            <div>
                                <Award size={48} className="mx-auto mb-3 text-secondary" />
                                <h3 className="font-bold text-xl mb-2">Advanced Content</h3>
                                <p className="text-text-secondary">
                                    Higher classes need deeper explanations and more practice
                                </p>
                            </div>
                            <div>
                                <Sparkles size={48} className="mx-auto mb-3 text-purple-500" />
                                <h3 className="font-bold text-xl mb-2">Bigger Discounts</h3>
                                <p className="text-text-secondary">
                                    Class 4: 30% off<br />
                                    Class 8: 40% off!
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-12 text-center"
                >
                    <h2 className="text-3xl font-heading font-bold mb-6">Still Have Questions? 🤔</h2>
                    <div className="flex gap-4 justify-center">
                        <Button onClick={() => navigate('/about')} variant="outline">
                            Learn More About Us
                        </Button>
                        <Button onClick={() => navigate('/success-stories')}>
                            See Success Stories
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
