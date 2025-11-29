import { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { Calculator, FlaskConical, Languages, Globe, BookOpen } from 'lucide-react';
import { useProfile } from '../../../contexts/ProfileContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import logger from '../../../utils/logger';

// Map icons to subject names (simple heuristic)
const getIconForSubject = (name) => {
    const n = name.toLowerCase();
    if (n.includes('math')) return Calculator;
    if (n.includes('science')) return FlaskConical;
    if (n.includes('english') || n.includes('hindi')) return Languages;
    if (n.includes('social') || n.includes('history') || n.includes('geo')) return Globe;
    return BookOpen;
};

const getColorForSubject = (index) => {
    const colors = [
        'bg-blue-100 text-blue-600',
        'bg-green-100 text-green-600',
        'bg-purple-100 text-purple-600',
        'bg-orange-100 text-orange-600',
        'bg-pink-100 text-pink-600',
        'bg-teal-100 text-teal-600'
    ];
    return colors[index % colors.length];
};

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
            const subjectsColl = collection(db, 'syllabus_subjects');
            const q = query(subjectsColl, where('class', '==', profile.class));
            const snapshot = await getDocs(q);

            const data = snapshot.docs.map((doc, index) => ({
                id: doc.id,
                ...doc.data(),
                icon: getIconForSubject(doc.data().name),
                color: getColorForSubject(index),
                progress: 0 // TODO: Calculate real progress
            }));

            setSubjects(data);
        } catch (error) {
            logger.error('SyllabusHome', 'Error fetching subjects', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading syllabus...</div>;
    }

    return (
        <div className="min-h-screen bg-background p-8 font-body">
            <header className="mb-8">
                <h1 className="text-4xl text-primary font-heading mb-2">My Syllabus ({profile?.class || '6th'})</h1>
                <p className="text-text-secondary">Pick a subject to start exploring!</p>
            </header>

            {subjects.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {subjects.map((sub) => (
                        <Card
                            key={sub.id}
                            className="hover:scale-105 transition-transform cursor-pointer group"
                            onClick={() => navigate(`/syllabus/${sub.id}`)}
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${sub.color}`}>
                                <sub.icon size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{sub.name}</h3>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${sub.progress}%` }}
                                />
                            </div>
                            <p className="text-xs text-text-secondary text-right">{sub.progress}% Complete</p>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No subjects found</h3>
                    <p className="text-text-secondary">Syllabus for your class hasn't been added yet.</p>
                </div>
            )}
        </div>
    );
}
