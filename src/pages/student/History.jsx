import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Clock, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const history = [
    { id: 1, subject: 'Math', topic: 'Fractions', date: 'Today, 5:30 PM', duration: '25 mins', score: '8/10' },
    { id: 2, subject: 'Science', topic: 'Photosynthesis', date: 'Yesterday, 6:00 PM', duration: '40 mins', score: 'Completed' },
    { id: 3, subject: 'English', topic: 'Verbs', date: '22 Nov, 4:00 PM', duration: '15 mins', score: 'Practice' },
];

export default function History() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background p-8 font-body">
            <header className="flex items-center gap-4 mb-8">
                <Button variant="ghost" onClick={() => navigate('/')} className="px-2">
                    <ArrowLeft />
                </Button>
                <h1 className="text-3xl text-primary font-heading">Your Journey</h1>
            </header>

            <div className="max-w-3xl space-y-4">
                {history.map((session) => (
                    <Card key={session.id} className="flex items-center justify-between p-4 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold ${session.subject === 'Math' ? 'bg-blue-500' :
                                    session.subject === 'Science' ? 'bg-green-500' : 'bg-purple-500'
                                }`}>
                                {session.subject[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{session.topic}</h3>
                                <div className="flex items-center gap-4 text-sm text-text-secondary">
                                    <span className="flex items-center gap-1"><Calendar size={14} /> {session.date}</span>
                                    <span className="flex items-center gap-1"><Clock size={14} /> {session.duration}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-xs text-text-secondary">Result</p>
                                <p className="font-bold text-primary">{session.score}</p>
                            </div>
                            <ChevronRight className="text-gray-300" />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
