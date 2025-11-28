import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, FileText, Video, HelpCircle } from 'lucide-react';

export default function ChapterView() {
    const { subjectId, chapterId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background p-8 font-body">
            <header className="flex items-center gap-4 mb-8">
                <Button variant="ghost" onClick={() => navigate(`/syllabus/${subjectId}`)} className="px-2">
                    <ArrowLeft />
                </Button>
                <div>
                    <h1 className="text-3xl text-primary font-heading">Chapter {chapterId}</h1>
                    <p className="text-text-secondary capitalize">{subjectId}</p>
                </div>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FileText className="text-secondary" /> Study Notes
                        </h2>
                        <Card className="hover:bg-gray-50 cursor-pointer transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-100 text-red-600 rounded-xl">PDF</div>
                                <div className="flex-1">
                                    <h3 className="font-bold group-hover:text-primary transition-colors">Complete Chapter Summary</h3>
                                    <p className="text-sm text-text-secondary">Read time: 15 mins</p>
                                </div>
                                <Button variant="ghost" className="text-primary">Read</Button>
                            </div>
                        </Card>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Video className="text-secondary" /> Video Explanations
                        </h2>
                        <div className="grid gap-4">
                            {[1, 2].map(i => (
                                <Card key={i} className="hover:bg-gray-50 cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">▶</div>
                                        <div>
                                            <h3 className="font-bold">Concept Part {i}</h3>
                                            <p className="text-sm text-text-secondary">10:00 mins</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-4">
                    <Card className="bg-primary/5 border-primary/20">
                        <h3 className="font-bold text-lg mb-2">Practice Mode</h3>
                        <p className="text-sm text-text-secondary mb-4">Test your knowledge with AI-generated questions.</p>
                        <Button className="w-full" onClick={() => navigate('/chat')}>Start Quiz</Button>
                    </Card>

                    <Card>
                        <h3 className="font-bold text-lg mb-2">Have a Doubt?</h3>
                        <p className="text-sm text-text-secondary mb-4">Ask Shikshak to explain any concept.</p>
                        <Button variant="secondary" className="w-full" onClick={() => navigate('/chat')}>Ask Shikshak</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
