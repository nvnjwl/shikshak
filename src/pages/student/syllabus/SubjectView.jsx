import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, Lock, CheckCircle, PlayCircle } from 'lucide-react';

// Mock Data - In real app, fetch from Firestore based on subjectId
const chapters = {
    math: [
        { id: 1, title: 'Knowing Our Numbers', status: 'completed' },
        { id: 2, title: 'Whole Numbers', status: 'in-progress' },
        { id: 3, title: 'Playing with Numbers', status: 'locked' },
        { id: 4, title: 'Basic Geometrical Ideas', status: 'locked' },
    ],
    science: [
        { id: 1, title: 'Food: Where Does It Come From?', status: 'completed' },
        { id: 2, title: 'Components of Food', status: 'in-progress' },
    ]
};

export default function SubjectView() {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const subjectChapters = chapters[subjectId] || [];

    return (
        <div className="min-h-screen bg-background p-8 font-body">
            <header className="flex items-center gap-4 mb-8">
                <Button variant="ghost" onClick={() => navigate('/syllabus')} className="px-2">
                    <ArrowLeft />
                </Button>
                <div>
                    <h1 className="text-3xl text-primary font-heading capitalize">{subjectId}</h1>
                    <p className="text-text-secondary">{subjectChapters.length} Chapters</p>
                </div>
            </header>

            <div className="space-y-4 max-w-3xl">
                {subjectChapters.map((chapter, index) => (
                    <Card
                        key={chapter.id}
                        className={`flex items-center justify-between p-4 transition-all ${chapter.status === 'locked' ? 'opacity-60 bg-gray-50' : 'hover:shadow-lg cursor-pointer'
                            }`}
                        onClick={() => chapter.status !== 'locked' && navigate(`/syllabus/${subjectId}/${chapter.id}`)}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${chapter.status === 'completed' ? 'bg-green-100 text-green-600' :
                                    chapter.status === 'in-progress' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                                }`}>
                                {index + 1}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{chapter.title}</h3>
                                <p className="text-xs text-text-secondary capitalize">{chapter.status.replace('-', ' ')}</p>
                            </div>
                        </div>

                        <div>
                            {chapter.status === 'locked' && <Lock size={20} className="text-gray-400" />}
                            {chapter.status === 'completed' && <CheckCircle size={24} className="text-green-500" />}
                            {chapter.status === 'in-progress' && <PlayCircle size={24} className="text-primary" />}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
