import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        category: 'General',
        questions: [
            {
                q: 'What is Shikshak?',
                a: 'Shikshak is an AI-powered educational platform that provides personalized tutoring for students in Classes 4-8. Using Google Gemini AI, we offer unlimited tutoring sessions, practice questions, and progress tracking—all for just ₹1,400-2,400 per month.',
            },
            {
                q: 'Which classes and boards are supported?',
                a: 'We currently support Classes 4-8 for CBSE, ICSE, and State Board curricula. All major subjects including Math, Science, Social Studies, English, and Hindi are covered.',
            },
            {
                q: 'How does AI tutoring work?',
                a: 'Our AI tutor, powered by Google Gemini, provides personalized explanations, answers questions, and guides students through concepts step-by-step. It adapts to each student\'s learning pace and style.',
            },
        ],
    },
    {
        category: 'Pricing & Billing',
        questions: [
            {
                q: 'How much does Shikshak cost?',
                a: 'Pricing varies by class level, ranging from ₹1,400/month for Class 4 to ₹2,400/month for Class 8. Higher classes get bigger discounts (30-40% off). All plans include unlimited access to all features.',
            },
            {
                q: 'Is there a free trial?',
                a: 'Yes! All new users get a 7-day free trial with full access to premium features. No credit card required to start the trial.',
            },
            {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets through our secure payment partner, Razorpay.',
            },
            {
                q: 'Can I cancel anytime?',
                a: 'Absolutely! You can cancel your subscription anytime from your account dashboard. Cancellation takes effect at the end of your current billing period.',
            },
            {
                q: 'Do you offer refunds?',
                a: 'Yes! We offer a 7-day money-back guarantee. If you\'re not satisfied within the first 7 days of payment, we\'ll refund you in full—no questions asked.',
            },
        ],
    },
    {
        category: 'Features',
        questions: [
            {
                q: 'What features are included in the subscription?',
                a: 'Premium subscription includes: Unlimited AI tutoring sessions, access to all subjects, unlimited practice questions, detailed progress analytics, parent dashboard, study session recordings, and priority support.',
            },
            {
                q: 'What\'s the difference between free and paid tiers?',
                a: 'Free tier: 5 AI questions/day, access to 1 subject, 5 practice questions/day. Paid tier: Unlimited AI tutoring, all subjects, unlimited practice, progress analytics, parent dashboard, and more.',
            },
            {
                q: 'Can parents track their child\'s progress?',
                a: 'Yes! Parents get access to a dedicated dashboard showing real-time progress, study time, performance trends, and weekly reports.',
            },
            {
                q: 'Is the content aligned with school curriculum?',
                a: 'Yes! All our content is carefully aligned with CBSE, ICSE, and State Board curricula to complement what students learn in school.',
            },
        ],
    },
    {
        category: 'Technical',
        questions: [
            {
                q: 'What devices can I use Shikshak on?',
                a: 'Shikshak works on any device with a web browser—laptops, tablets, and smartphones. We recommend using Chrome, Firefox, or Safari for the best experience.',
            },
            {
                q: 'Do I need to download anything?',
                a: 'No! Shikshak is a web-based platform. Simply visit our website and log in—no downloads or installations required.',
            },
            {
                q: 'What if I have technical issues?',
                a: 'Our support team is available Mon-Sat, 9 AM - 6 PM IST. Contact us at support@shikshak.com or call +91 123 456 7890.',
            },
            {
                q: 'Is my data secure?',
                a: 'Absolutely! We use industry-standard encryption and security measures. All data is encrypted in transit and at rest. We never share student data with third parties. See our Privacy Policy for details.',
            },
        ],
    },
    {
        category: 'Getting Started',
        questions: [
            {
                q: 'How do I get started?',
                a: 'Simply click "Start Free Trial", create an account, complete the quick onboarding (name, class, board), and start learning immediately!',
            },
            {
                q: 'Do I need a credit card for the free trial?',
                a: 'No! You can start your 7-day free trial without entering any payment information.',
            },
            {
                q: 'What happens after the free trial?',
                a: 'After 7 days, you\'ll be prompted to subscribe to continue accessing premium features. You can choose to subscribe or continue with limited free tier access.',
            },
        ],
    },
];

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Card className="mb-3 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
                <span className="font-semibold pr-4">{question}</span>
                {isOpen ? <ChevronUp className="flex-shrink-0" size={20} /> : <ChevronDown className="flex-shrink-0" size={20} />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 text-text-secondary">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}

export default function FAQ() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
            {/* Header */}
            <header className="bg-white shadow-sm p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-heading font-bold text-primary">Shikshak</h1>
                    <div className="flex gap-4">
                        <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
                        <Button onClick={() => navigate('/signup')}>Start Free Trial</Button>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <div className="max-w-4xl mx-auto px-6 py-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HelpCircle className="text-primary" size={32} />
                    </div>
                    <h1 className="text-5xl font-heading font-bold mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-text-secondary">
                        Got questions? We've got answers! Find everything you need to know about Shikshak.
                    </p>
                </motion.div>
            </div>

            {/* FAQ Sections */}
            <div className="max-w-4xl mx-auto px-6 pb-12">
                {faqs.map((category, idx) => (
                    <motion.div
                        key={category.category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl font-heading font-bold mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">
                                {idx + 1}
                            </span>
                            {category.category}
                        </h2>
                        <div>
                            {category.questions.map((faq, i) => (
                                <FAQItem key={i} question={faq.q} answer={faq.a} />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Still Have Questions */}
            <div className="bg-gradient-to-r from-primary to-secondary text-white py-12">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-heading font-bold mb-4">
                        Still Have Questions?
                    </h2>
                    <p className="text-xl mb-6 text-white/90">
                        Our support team is here to help!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="mailto:support@shikshak.com" className="text-white hover:underline">
                            📧 support@shikshak.com
                        </a>
                        <a href="tel:+911234567890" className="text-white hover:underline">
                            📞 +91 123 456 7890
                        </a>
                    </div>
                    <div className="mt-8">
                        <Button
                            onClick={() => navigate('/signup')}
                            className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4"
                        >
                            Start Your Free Trial
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
