import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, BookOpen, ChevronRight, PlayCircle, FileText } from 'lucide-react';
import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import logger from '../../../utils/logger';

export default function SubjectView() {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const [subjectName, setSubjectName] = useState('Subject');
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubjectAndChapters();
    }, [subjectId]);

    const fetchSubjectAndChapters = async () => {
        try {
            setLoading(true);

            // 1. Fetch Subject Name
            const subjectDoc = await getDoc(doc(db, 'syllabus_subjects', subjectId));
            if (subjectDoc.exists()) {
                setSubjectName(subjectDoc.data().name);
            } else {
                // Fallback for hardcoded IDs if any (legacy support)
                const legacyNames = { 'math': 'Mathematics', 'science': 'Science', 'english': 'English', 'social': 'Social Science' };
                if (legacyNames[subjectId]) setSubjectName(legacyNames[subjectId]);
            }

            // 2. Fetch Chapters
            const chaptersColl = collection(db, 'syllabus_chapters');
            const q = query(
                chaptersColl,
                where('subjectId', '==', subjectId),
                orderBy('order', 'asc')
            );
            const snapshot = await getDocs(q);

            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                progress: 0 // TODO: Calculate real progress
            }));

            setChapters(data);
        } catch (error) {
            logger.error('SubjectView', 'Error fetching chapters', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading chapters...</div>;
    }

    return (
        <div className="min-h-screen bg-background p-8 font-body">
            <header className="mb-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/syllabus')}
                    className="mb-4 pl-0 hover:pl-2 transition-all"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to Syllabus
                </Button>
                <h1 className="text-4xl text-primary font-heading mb-2">{subjectName}</h1>
                <p className="text-text-secondary">Select a chapter to start learning</p>
            </header>

            <div className="space-y-4">
                {chapters.map((chapter) => (
                    <Card
                        key={chapter.id}
                        className="p-6 hover:shadow-md transition-shadow cursor-pointer group"
                        onClick={() => navigate(`/syllabus/${subjectId}/${chapter.id}`)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                                        {chapter.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                                        <span className="flex items-center gap-1">
                                            <PlayCircle size={14} /> {chapter.topics?.length || 0} Topics
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FileText size={14} /> 0 Resources
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right hidden md:block">
                                    <div className="text-sm font-bold text-primary mb-1">{chapter.progress}%</div>
                                    <div className="w-24 bg-gray-100 rounded-full h-1.5">
                                        <div
                                            className="bg-primary h-1.5 rounded-full"
                                            style={{ width: `${chapter.progress}%` }}
                                        />
                                    </div>
                                </div>
                                <ChevronRight className="text-gray-300 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    </Card>
                ))}

                {chapters.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No chapters found</h3>
                        <p className="text-text-secondary">Content for this subject is being updated.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
