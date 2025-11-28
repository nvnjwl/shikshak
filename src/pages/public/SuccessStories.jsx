import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
    {
        id: 1,
        name: "Priya Sharma",
        relation: "Mother of Aarav (Class 6)",
        location: "Mumbai, Maharashtra",
        rating: 5,
        text: "My son's math scores improved from 65% to 88% in just 3 months! Shikshak's AI tutor explains concepts in a way he actually understands. Best ₹2,000 I spend every month.",
        improvement: "+23% in Math"
    },
    {
        id: 2,
        name: "Rajesh Kumar",
        relation: "Father of Diya (Class 7)",
        location: "Delhi",
        rating: 5,
        text: "We were spending ₹8,000 on home tuition. Shikshak is not only more affordable but also more effective. The daily study plan keeps my daughter disciplined.",
        improvement: "Saved ₹6,000/month"
    },
    {
        id: 3,
        name: "Anita Patel",
        relation: "Mother of Rohan (Class 5)",
        location: "Ahmedabad, Gujarat",
        rating: 5,
        text: "The homework help feature is a lifesaver! Rohan can upload his questions and get step-by-step explanations. His confidence has grown so much.",
        improvement: "Homework completion: 100%"
    },
    {
        id: 4,
        name: "Vikram Singh",
        relation: "Father of Meera (Class 8)",
        location: "Bangalore, Karnataka",
        rating: 5,
        text: "As working parents, we couldn't always help with studies. Shikshak fills that gap perfectly. The parent dashboard lets us track progress easily.",
        improvement: "Overall grade: B to A"
    },
    {
        id: 5,
        name: "Sunita Reddy",
        relation: "Mother of Arjun (Class 4)",
        location: "Hyderabad, Telangana",
        rating: 5,
        text: "My son actually looks forward to his study sessions! The AI makes learning fun and interactive. His teachers have noticed the improvement too.",
        improvement: "Class rank: 15th to 5th"
    },
    {
        id: 6,
        name: "Amit Desai",
        relation: "Father of Kavya (Class 6)",
        location: "Pune, Maharashtra",
        rating: 5,
        text: "The science explanations are phenomenal. Kavya went from struggling with concepts to being the top student in her class. Worth every rupee!",
        improvement: "+35% in Science"
    }
];

export default function SuccessStories() {
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

            <div className="max-w-6xl mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-heading font-bold mb-4">Success Stories</h1>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                        Real results from real families across India
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-2xl shadow-card hover:shadow-lg transition-shadow"
                        >
                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={20} fill="#FFC107" className="text-primary" />
                                ))}
                            </div>

                            {/* Testimonial */}
                            <p className="text-text-secondary italic mb-4 text-lg">
                                "{testimonial.text}"
                            </p>

                            {/* Improvement Badge */}
                            <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-4">
                                ✓ {testimonial.improvement}
                            </div>

                            {/* Author */}
                            <div className="border-t pt-4">
                                <div className="font-bold text-lg">{testimonial.name}</div>
                                <div className="text-text-secondary text-sm">{testimonial.relation}</div>
                                <div className="text-text-secondary text-xs">{testimonial.location}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-16 p-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl"
                >
                    <h2 className="text-3xl font-heading font-bold mb-4">Ready to see results like these?</h2>
                    <p className="text-text-secondary mb-6 text-lg">Join 10,000+ students learning with Shikshak</p>
                    <Button className="text-lg px-8 py-4" onClick={() => navigate('/signup')}>
                        Start Your Free Trial
                    </Button>
                </motion.div>
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
