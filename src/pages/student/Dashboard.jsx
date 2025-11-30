import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Settings, LogOut, GraduationCap, Calculator, FlaskConical, Languages, Globe, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Card } from '../../components/ui/Card';
import AICompanion from '../../components/dashboard/AICompanion';
import ClassSwitcher from '../../components/dashboard/ClassSwitcher';
import toast from 'react-hot-toast';

// Helper to get BIGGER icons for kids!
const getSubjectIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('math')) return <Calculator size={48} />;
    if (n.includes('science')) return <FlaskConical size={48} />;
    if (n.includes('english') || n.includes('hindi')) return <Languages size={48} />;
    if (n.includes('social') || n.includes('history') || n.includes('evs')) return <Globe size={48} />;
    return <BookOpen size={48} />;
};

// Helper to get fun progress emoji based on completion
const getProgressEmoji = (progress) => {
    if (progress === 0) return { emoji: '🌱', text: 'Just started!' };
    if (progress < 25) return { emoji: '🌱', text: 'Just started!' };
    if (progress < 50) return { emoji: '🚀', text: 'Getting there!' };
    if (progress < 75) return { emoji: '⭐', text: "You're a star!" };
    if (progress < 100) return { emoji: '🏆', text: 'Almost a champion!' };
    return { emoji: '👑', text: 'You did it!' };
};

// Helper to get fun subject descriptions
const getSubjectDescription = (name, totalTopics) => {
    const n = name.toLowerCase();
    if (n.includes('math')) return `🎯 ${totalTopics} Cool Tricks to Learn!`;
    if (n.includes('science')) return `🔬 ${totalTopics} Amazing Experiments!`;
    if (n.includes('english')) return `📖 ${totalTopics} Fun Stories!`;
    if (n.includes('hindi')) return `✨ ${totalTopics} Awesome Lessons!`;
    if (n.includes('social') || n.includes('evs')) return `🌍 ${totalTopics} Cool Facts!`;
    return `📚 ${totalTopics} Topics to Explore!`;
};

// Helper to get color theme for subject
const getSubjectTheme = (index) => {
    const themes = [
        { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', iconBg: 'bg-blue-100', progressBg: 'bg-blue-500' },
        { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', iconBg: 'bg-green-100', progressBg: 'bg-green-500' },
        { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', iconBg: 'bg-purple-100', progressBg: 'bg-purple-500' },
        { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', iconBg: 'bg-orange-100', progressBg: 'bg-orange-500' },
        { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-100', iconBg: 'bg-pink-100', progressBg: 'bg-pink-500' },
        { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100', iconBg: 'bg-teal-100', progressBg: 'bg-teal-500' }
    ];
    return themes[index % themes.length];
};

export default function Dashboard() {
    const navigate = useNavigate();
    const { logout, currentUser } = useAuth();
    const { profile } = useProfile();
    const { subscription } = useSubscription();
    const [showClassSwitcher, setShowClassSwitcher] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!profile?.class || !currentUser) return;

            try {
                setLoading(true);
                const classId = profile.class.replace(/\D/g, '');

                // Fetch Syllabus
                const syllabusQuery = query(
                    collection(db, 'syllabus'),
                    where('classId', '==', classId)
                );
                const syllabusSnapshot = await getDocs(syllabusQuery);

                const subjectsData = [];
                for (const docSnapshot of syllabusSnapshot.docs) {
                    const data = docSnapshot.data();
                    const subjectId = data.subjectId;

                    // Fetch Progress
                    const progressRef = doc(db, 'users', currentUser.uid, 'progress', subjectId);
                    const progressSnap = await getDoc(progressRef);
                    const progressData = progressSnap.exists() ? progressSnap.data() : { completedTopics: [] };

                    // Calculate Progress
                    let totalTopics = 0;
                    data.chapters?.forEach(chapter => {
                        totalTopics += chapter.key_topics?.length || 0;
                    });

                    const completedCount = progressData.completedTopics?.length || 0;
                    const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

                    subjectsData.push({
                        id: subjectId,
                        name: data.subject_name,
                        progress: progressPercent,
                        totalTopics,
                        completedCount
                    });
                }

                setSubjects(subjectsData);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error("Oops! Let's try again 🔄");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [profile, currentUser]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-body pb-20">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 shadow-sm">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                            S
                        </div>
                        <span className="font-heading font-bold text-xl text-primary hidden md:block">Shikshak</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowClassSwitcher(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-full text-sm font-bold transition-all border-2 border-blue-100 hover:border-primary shadow-sm"
                        >
                            <GraduationCap size={18} className="text-primary" />
                            <span>Class {profile?.class || '...'}</span>
                        </button>

                        <div className="h-6 w-px bg-gray-200 mx-1"></div>

                        <button onClick={() => navigate('/settings')} className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                            <Settings size={22} />
                        </button>
                        <button onClick={handleLogout} className="p-2.5 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
                            <LogOut size={22} />
                        </button>
                    </div>
                </div>
            </nav>

            {showClassSwitcher && <ClassSwitcher onClose={() => setShowClassSwitcher(false)} />}

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                {/* 1. AI Companion Hero */}
                <AICompanion userName={profile?.name?.split(' ')[0] || 'Student'} />

                {/* 2. Subject Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-heading font-bold text-gray-900 flex items-center gap-2">
                            📚 Your Subjects
                        </h2>
                        <button
                            onClick={() => navigate('/syllabus')}
                            className="text-primary font-bold text-sm hover:underline px-4 py-2 hover:bg-primary/5 rounded-full transition-colors"
                        >
                            See All Subjects 👀
                        </button>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-64 bg-white/50 rounded-3xl animate-pulse shadow-lg"></div>
                            ))}
                        </div>
                    ) : subjects.length === 0 ? (
                        <Card className="p-12 text-center border-2 border-dashed border-gray-200">
                            <div className="text-6xl mb-4">🌟</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Learning Journey Starts Here!</h3>
                            <p className="text-gray-600 mb-4">Pick any subject below to begin your adventure!</p>
                            <p className="text-sm text-gray-500">💡 Tip: Start with your favorite subject!</p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {subjects.map((sub, index) => {
                                const theme = getSubjectTheme(index);
                                const progressInfo = getProgressEmoji(sub.progress);

                                return (
                                    <motion.div
                                        key={sub.id}
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Card
                                            className={`h-full cursor-pointer border-2 ${theme.border} hover:shadow-2xl transition-all duration-300 overflow-hidden relative group bg-white`}
                                            onClick={() => navigate(`/syllabus/${sub.id}`)}
                                        >
                                            <div className={`absolute top-0 right-0 w-32 h-32 ${theme.bg} rounded-bl-full opacity-50 group-hover:opacity-70 transition-opacity`} />

                                            <div className="p-6 flex flex-col h-full relative z-10">
                                                <div className={`w-20 h-20 rounded-2xl ${theme.iconBg} ${theme.text} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                                                    {getSubjectIcon(sub.name)}
                                                </div>

                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{sub.name}</h3>
                                                <p className="text-sm text-text-secondary mb-4 font-medium">{getSubjectDescription(sub.name, sub.totalTopics)}</p>

                                                <div className="mt-auto space-y-3">
                                                    <div className="flex items-center gap-2 text-sm font-bold">
                                                        <span className="text-3xl">{progressInfo.emoji}</span>
                                                        <span className={theme.text}>{progressInfo.text}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${sub.progress}%` }}
                                                            transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                                                            className={`h-full rounded-full ${theme.progressBg}`}
                                                        />
                                                    </div>
                                                    <div className="text-right text-sm font-bold text-gray-600">
                                                        {sub.progress}% Complete
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>

                {/* 3. Bottom Cards - Adventure & Superpowers */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid md:grid-cols-2 gap-6"
                >
                    {/* Continue Your Adventure Card */}
                    <Card className="p-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-none shadow-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/history')}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/20 transition-colors" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <span className="text-4xl">🎮</span>
                                </div>
                                <h3 className="font-bold text-2xl">Continue Your Adventure!</h3>
                            </div>

                            <p className="text-white/90 mb-2 text-base font-medium">
                                Yesterday you were exploring:
                            </p>
                            <p className="text-white font-bold text-xl mb-6">
                                🔢 Fractions - The Pizza Slice Mystery!
                            </p>

                            <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 hover:scale-110 transition-all shadow-lg flex items-center gap-2">
                                Let's Go! 🚀
                            </button>
                        </div>
                    </Card>

                    {/* Your Superpowers Card */}
                    <Card className="p-8 border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-2xl cursor-pointer hover:shadow-3xl hover:scale-105 transition-all" onClick={() => navigate('/profile')}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-2xl text-gray-900 flex items-center gap-2">
                                🏆 Your Superpowers!
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {/* Streak */}
                            <div className="p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-base font-bold text-gray-700">⭐ Learning Streak</span>
                                    <span className="text-3xl font-bold text-orange-600 flex items-center gap-1">
                                        5 Days 🔥
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '71%' }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-2 font-medium">2 more days to unlock a surprise! 🎁</p>
                            </div>

                            {/* Topics Mastered */}
                            <div className="p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-base font-bold text-gray-700">🎯 Topics Mastered</span>
                                    <span className="text-3xl font-bold text-blue-600">
                                        {subjects.reduce((sum, sub) => sum + sub.completedCount, 0)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">Master 3 more to become a Math Wizard! 🧙‍♂️</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}
