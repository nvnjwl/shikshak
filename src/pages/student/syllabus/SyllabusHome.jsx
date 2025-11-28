import { Card } from '../../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { Calculator, FlaskConical, Languages, Globe } from 'lucide-react';

const subjects = [
    { id: 'math', name: 'Mathematics', icon: Calculator, color: 'bg-blue-100 text-blue-600', progress: 45 },
    { id: 'science', name: 'Science', icon: FlaskConical, color: 'bg-green-100 text-green-600', progress: 30 },
    { id: 'english', name: 'English', icon: Languages, color: 'bg-purple-100 text-purple-600', progress: 60 },
    { id: 'social', name: 'Social Science', icon: Globe, color: 'bg-orange-100 text-orange-600', progress: 15 },
];

export default function SyllabusHome() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background p-8 font-body">
            <header className="mb-8">
                <h1 className="text-4xl text-primary font-heading mb-2">My Syllabus</h1>
                <p className="text-text-secondary">Pick a subject to start exploring!</p>
            </header>

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
        </div>
    );
}
