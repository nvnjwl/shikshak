import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, Trophy, Clock, Star, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Landing() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const features = [
        { icon: Brain, title: "AI-Powered Learning", desc: "Personalized tutoring with Google Gemini AI" },
        { icon: Clock, title: "Daily Study Plans", desc: "Structured 45-min sessions tailored to your class" },
        { icon: BookOpen, title: "Complete Syllabus", desc: "CBSE/ICSE Class 4-8, all subjects covered" },
        { icon: Trophy, title: "Track Progress", desc: "Real-time analytics and performance insights" },
    ];

    const stats = [
        { value: "10,000+", label: "Students Learning" },
        { value: "95%", label: "Parent Satisfaction" },
        { value: "₹2,000", label: "Per Month" },
    ];

    return (
        <div className="min-h-screen bg-background font-body">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                            श
                        </div>
                        <span className="text-2xl font-heading font-bold text-primary">Shikshak</span>
                    </div>
                    <div className="hidden md:flex gap-8 text-text-secondary font-semibold">
                        <a href="#features" className="hover:text-primary transition-colors">Features</a>
                        <a href="#success" className="hover:text-primary transition-colors">Success Stories</a>
                        <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
                        <a href="/about" className="hover:text-primary transition-colors">About</a>
                    </div>
                    <div className="flex gap-3">
                        {currentUser ? (
                            <>
                                <Button onClick={() => navigate('/app')}>
                                    Go to Dashboard
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        // Logout handled by auth context
                                        localStorage.clear();
                                        window.location.reload();
                                    }}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
                                <Button onClick={() => navigate('/signup')}>Start Free Trial</Button>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-bold mb-6">
                        🎓 The Only Tuition You Need Outside School
                    </div>
                    <h1 className="text-5xl md:text-7xl font-heading font-bold text-text-primary mb-6 leading-tight">
                        Your Personal AI Tutor<br />
                        <span className="text-primary">For Just ₹2,000/Month</span>
                    </h1>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
                        Shikshak replaces expensive home tutors with AI-powered learning.
                        Perfect for Class 4-8 students. Study smarter, score better.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        {currentUser ? (
                            <>
                                <Button className="text-lg px-8 py-4" onClick={() => navigate('/app')}>
                                    Go to Dashboard 🚀
                                </Button>
                                <Button variant="outline" className="text-lg px-8 py-4" onClick={() => navigate('/chat')}>
                                    Ask Shikshak AI 🤖
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button className="text-lg px-8 py-4" onClick={() => navigate('/signup')}>
                                    Start 7-Day Free Trial
                                </Button>
                                <Button variant="outline" className="text-lg px-8 py-4" onClick={() => navigate('/parent/login')}>
                                    Parent Login
                                </Button>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="grid md:grid-cols-3 gap-8 mt-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {stats.map((stat, i) => (
                        <div key={i} className="p-6 bg-white rounded-2xl shadow-card">
                            <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                            <div className="text-text-secondary">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="features" className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-heading font-bold text-center mb-4">Why Parents Choose Shikshak</h2>
                    <p className="text-center text-text-secondary mb-12 text-lg">Everything your child needs to excel in school</p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                className="bg-white p-6 rounded-2xl shadow-card hover:shadow-lg transition-all cursor-pointer group"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <feature.icon size={28} className="text-primary" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                                <p className="text-text-secondary text-sm">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Stories Preview */}
            <section id="success" className="py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-heading font-bold mb-12">Success Stories</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-card">
                                <div className="flex gap-1 justify-center mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} size={20} fill="#FFC107" className="text-primary" />
                                    ))}
                                </div>
                                <p className="text-text-secondary italic mb-4">
                                    "My son's math scores improved from 65% to 88% in just 3 months!"
                                </p>
                                <div className="font-bold">Parent of Class 6 Student</div>
                            </div>
                        ))}
                    </div>
                    <Button className="mt-8" onClick={() => navigate('/success-stories')}>
                        Read More Stories
                    </Button>
                </div>
            </section>

            {/* Pricing CTA */}
            <section id="pricing" className="bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-heading font-bold mb-4">Simple, Transparent Pricing</h2>
                    <div className="text-6xl font-bold text-primary my-8">₹2,000<span className="text-2xl text-text-secondary">/month</span></div>
                    <ul className="text-left max-w-md mx-auto space-y-3 mb-8">
                        {[
                            "All subjects for your class",
                            "Unlimited AI tutoring sessions",
                            "Daily personalized study plans",
                            "Parent progress dashboard",
                            "Homework help & doubt solving"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    <Button className="text-lg px-10 py-4" onClick={() => navigate('/signup')}>
                        Start Your Free Trial Now
                    </Button>
                    <p className="text-sm text-text-secondary mt-4">No credit card required • Cancel anytime</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="text-2xl font-heading font-bold mb-4">Shikshak</div>
                        <p className="text-gray-400">Your personal AI tutor for Class 4-8</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Product</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#features" className="hover:text-white">Features</a></li>
                            <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                            <li><a href="/about" className="hover:text-white">About Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white">Help Center</a></li>
                            <li><a href="#" className="hover:text-white">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Connect</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">f</a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">t</a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">in</a>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
                    © 2025 Shikshak. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
