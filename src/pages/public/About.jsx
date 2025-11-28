import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Target, Heart, Users, Zap } from 'lucide-react';

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background font-body">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                            श
                        </div>
                        <span className="text-2xl font-heading font-bold text-primary">Shikshak</span>
                    </div>
                    <Button onClick={() => navigate('/')}>Back to Home</Button>
                </nav>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-20">
                <h1 className="text-5xl font-heading font-bold text-center mb-6">About Shikshak</h1>
                <p className="text-xl text-text-secondary text-center mb-16 max-w-3xl mx-auto">
                    We're on a mission to make quality education accessible to every child in India
                </p>

                {/* Mission */}
                <section className="mb-20">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-heading font-bold mb-4">Our Mission</h2>
                            <p className="text-text-secondary text-lg mb-4">
                                Shikshak was born from a simple observation: millions of Indian parents struggle to afford quality home tuition,
                                while their children need personalized attention that schools can't always provide.
                            </p>
                            <p className="text-text-secondary text-lg">
                                We leverage cutting-edge AI technology to deliver personalized, affordable tutoring that adapts to each student's
                                learning pace and style. At just ₹2,000/month, we're making premium education accessible to the middle class.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-12 text-center">
                            <div className="text-6xl mb-4">🎯</div>
                            <h3 className="text-2xl font-bold mb-2">Our Goal</h3>
                            <p className="text-text-secondary">Reach 1 million students by 2026</p>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="mb-20">
                    <h2 className="text-3xl font-heading font-bold text-center mb-12">Our Values</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Target, title: "Student-First", desc: "Every decision prioritizes learning outcomes" },
                            { icon: Heart, title: "Empathy", desc: "We understand the struggles of Indian parents" },
                            { icon: Users, title: "Accessibility", desc: "Quality education for all, not just the privileged" },
                            { icon: Zap, title: "Innovation", desc: "Leveraging AI to solve real problems" },
                        ].map((value, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-card text-center">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <value.icon size={28} className="text-primary" />
                                </div>
                                <h3 className="font-bold mb-2">{value.title}</h3>
                                <p className="text-sm text-text-secondary">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Team */}
                <section className="text-center">
                    <h2 className="text-3xl font-heading font-bold mb-4">Built by Educators & Technologists</h2>
                    <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                        Our team combines decades of teaching experience with expertise in AI and product development.
                        We're parents, teachers, and engineers who believe technology can transform education.
                    </p>
                    <Button onClick={() => navigate('/signup')}>Join Our Mission</Button>
                </section>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="text-2xl font-heading font-bold mb-4">Shikshak</div>
                    <p className="text-gray-400">© 2025 Shikshak. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
