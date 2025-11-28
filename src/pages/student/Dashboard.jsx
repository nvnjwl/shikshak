import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { BookOpen, Star, MessageCircle, Calendar, Clock, Trophy, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Dashboard() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [streak, setStreak] = useState(5);

    // Mock Daily Plan
    const dailyPlan = [
        {
            id: 1,
            time: "Morning (9:00 AM)",
            subject: "Math",
            topic: "Fractions - Addition",
            duration: "30 mins",
            status: "completed",
            icon: "📐"
        },
        {
            id: 2,
            time: "Afternoon (2:00 PM)",
            subject: "Science",
            topic: "Photosynthesis",
            duration: "25 mins",
            status: "in-progress",
            icon: "🔬"
        },
        {
            id: 3,
            time: "Evening (5:00 PM)",
            subject: "English",
            topic: "Grammar - Verbs",
            duration: "20 mins",
            status: "pending",
            icon: "📚"
        },
    ];

    const subjects = [
        { name: "Math", progress: 65, color: "bg-blue-500", icon: "📐" },
        { name: "Science", progress: 45, color: "bg-green-500", icon: "🔬" },
        { name: "English", progress: 80, color: "bg-purple-500", icon: "📚" },
        { name: "Social Science", progress: 30, color: "bg-orange-500", icon: "🌍" },
    ];

    return (
        <div className="min-h-screen bg-background p-6 md:p-8 font-body">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.header
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <h1 className="text-3xl md:text-4xl text-primary font-heading">Hi, Rohan! 👋</h1>
                        <p className="text-xl text-text-secondary">Ready to learn something new?</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <div className="text-sm text-text-secondary">Study Streak</div>
                            <div className="text-2xl font-bold text-primary">{streak} Days 🔥</div>
                        </div>
                        <Button variant="ghost" onClick={() => logout()}>Logout</Button>
                    </div>
                </motion.header>

                {/* Today's Plan */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
                            <Calendar className="text-primary" /> Today's Plan
                        </h2>
                        <span className="text-sm text-text-secondary">Monday, Nov 24</span>
                    </div>

                    <div className="space-y-4">
                        {dailyPlan.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                            >
                                <Card className={`p-4 hover:shadow-lg transition-all cursor-pointer ${activity.status === 'completed' ? 'bg-green-50 border-green-200' :
                                        activity.status === 'in-progress' ? 'bg-primary/5 border-primary/20' : ''
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="text-4xl">{activity.icon}</div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-lg">{activity.subject}</h3>
                                                    {activity.status === 'completed' && (
                                                        <span className="text-green-600 text-sm">✓ Completed</span>
                                                    )}
                                                    {activity.status === 'in-progress' && (
                                                        <span className="text-primary text-sm animate-pulse">● In Progress</span>
                                                    )}
                                                </div>
                                                <p className="text-text-secondary">{activity.topic}</p>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} /> {activity.duration}
                                                    </span>
                                                    <span>{activity.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant={activity.status === 'completed' ? 'ghost' : 'primary'}
                                            disabled={activity.status === 'completed'}
                                            onClick={() => navigate('/study-session')}
                                        >
                                            {activity.status === 'completed' ? 'Review' : 'Start'}
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Subject Progress */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2">
                        <Trophy className="text-secondary" /> Your Progress
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {subjects.map((subject, index) => (
                            <motion.div
                                key={subject.name}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl">{subject.icon}</span>
                                        <h3 className="font-bold">{subject.name}</h3>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                                        <motion.div
                                            className={`${subject.color} h-3 rounded-full`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${subject.progress}%` }}
                                            transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                                        />
                                    </div>
                                    <p className="text-xs text-text-secondary text-right">{subject.progress}% Complete</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Quick Actions */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="p-6 hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/syllabus')}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-primary/20 rounded-xl text-primary">
                                    <BookOpen size={32} />
                                </div>
                                <h2 className="text-xl font-bold">Browse Syllabus</h2>
                            </div>
                            <p className="text-text-secondary mb-4">Explore all subjects and chapters</p>
                            <div className="flex items-center text-primary font-bold">
                                View All <ChevronRight size={20} />
                            </div>
                        </Card>

                        <Card className="p-6 hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/chat')}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-secondary/20 rounded-xl text-secondary">
                                    <MessageCircle size={32} />
                                </div>
                                <h2 className="text-xl font-bold">Ask Shikshak</h2>
                            </div>
                            <p className="text-text-secondary mb-4">Get instant help with any doubt</p>
                            <div className="flex items-center text-secondary font-bold">
                                Start Chat <ChevronRight size={20} />
                            </div>
                        </Card>

                        <Card className="p-6 hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/history')}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                                    <Star size={32} />
                                </div>
                                <h2 className="text-xl font-bold">My Journey</h2>
                            </div>
                            <p className="text-text-secondary mb-4">View your learning history</p>
                            <div className="flex items-center text-purple-600 font-bold">
                                See Progress <ChevronRight size={20} />
                            </div>
                        </Card>
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
