import { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Star, BookOpen } from 'lucide-react';
import { useProfile } from '../../../contexts/ProfileContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import logger from '../../../utils/logger';
import { motion } from 'framer-motion';
import { getSubjectIcon, getSubjectTheme } from '../../../utils/subjectUtils';

export default function SyllabusHome() {
    const navigate = useNavigate();
    const { profile } = useProfile();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (profile?.class) {
            fetchSubjects();
        }
    }, [profile]);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            // Normalize class string (e.g., "6th" -> "6")
            const classId = profile.class.replace(/\D/g, '');

            const subjectsColl = collection(db, 'syllabus');
            const q = query(subjectsColl, where('classId', '==', classId));
            const snapshot = await getDocs(q);

            const data = snapshot.docs.map((doc, index) => {
                const docData = doc.data();
                return {
                    id: docData.subjectId,
                    name: docData.subject_name,
                    icon: getSubjectIcon(docData.subject_name),
                    theme: getSubjectTheme(index),
                    progress: 0, // TODO: Calculate real progress
                    chaptersCount: docData.chapters?.length || 0,
                    topicsCount: docData.chapters?.reduce((acc, c) => acc + (c.key_topics?.length || 0), 0) || 0
                };
            });

            setSubjects(data);
        } catch (error) {
            logger.error('SyllabusHome', 'Error fetching subjects', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading your learning path...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="font-body pb-20 md:pb-0">
            {/* Hero Section */}
            <div className="bg-primary/5 border-b border-primary/10">
                <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-white border border-primary/20 text-primary text-sm font-bold shadow-sm">
                                Class {profile?.class || '...'}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-text-secondary">
                                <Sparkles size={14} className="text-secondary" /> AI-Powered Curriculum
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
                            Your Learning Map
                        </h1>
                        <p className="text-xl text-text-secondary leading-relaxed">
                            Explore your subjects, track your progress, and master every topic with Shikshak's intelligent guidance.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 md:p-8">
                {subjects.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjects.map((sub, index) => (
                            <motion.div
                                key={sub.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card
                                    className={`h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 ${sub.theme.border} hover:border-primary/50 overflow-hidden relative`}
                                    onClick={() => navigate(`/syllabus/${sub.id}`)}
                                >
                                    {/* Background Decor */}
                                    <div className={`absolute top-0 right-0 w-32 h-32 ${sub.theme.bg} rounded-bl-full opacity-50 transition-transform group-hover:scale-110`} />

                                    <div className="p-6 relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${sub.theme.iconBg} ${sub.theme.text} shadow-sm group-hover:scale-110 transition-transform`}>
                                                <sub.icon size={28} />
                                            </div>
                                            <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold border border-gray-100 shadow-sm flex items-center gap-1">
                                                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                                {sub.progress}%
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                                            {sub.name}
                                        </h3>

                                        <div className="flex items-center gap-4 text-sm text-text-secondary mb-6">
                                            <span>{sub.chaptersCount} Chapters</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span>{sub.topicsCount} Topics</span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-medium text-text-secondary">
                                                <span>Progress</span>
                                                <span>{sub.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${sub.theme.bg.replace('bg-', 'bg-').replace('-50', '-500')}`} // Hacky way to get darker color
                                                    style={{ width: `${sub.progress}%`, backgroundColor: 'currentColor' }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-6 flex items-center text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                                            Start Learning <ArrowRight size={16} className="ml-2" />
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200"
                    >
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No subjects found</h3>
                        <p className="text-text-secondary max-w-md mx-auto">
                            We couldn't find the syllabus for Class {profile?.class}. Please contact support if this persists.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
