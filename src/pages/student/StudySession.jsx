import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, BookOpen, Clock, Target } from 'lucide-react';
import logger from '../../utils/logger';

export default function StudySession() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Deep link parameters
    const subject = searchParams.get('subject');
    const chapter = searchParams.get('chapter');
    const topic = searchParams.get('topic');
    const mode = searchParams.get('mode') || 'learn'; // learn, practice, video

    useEffect(() => {
        logger.navigation('Study Session', 'Deep link accessed', {
            subject,
            chapter,
            topic,
            mode
        });

        // Simulate loading
        setTimeout(() => setLoading(false), 500);

        // If we have all required params, redirect to appropriate page
        if (subject && chapter && topic) {
            const targetRoute = mode === 'practice'
                ? `/practice/${subject}/${chapter}/${topic}`
                : `/learn/${subject}/${chapter}/${topic}`;

            logger.navigation('Study Session', 'Redirecting to target', { targetRoute });
            navigate(targetRoute);
        }
    }, [subject, chapter, topic, mode, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin text-6xl mb-4">📚</div>
                    <p className="text-xl text-text-secondary">Loading your study session...</p>
                </div>
            </div>
        );
    }

    // If no params, show study session selector
    return (
        <div className="min-h-screen bg-background font-body">
            {/* Header */}
            <header className="bg-white shadow-sm p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate('/app')}
                        className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
                    >
                        <ArrowLeft size={24} />
                        <span className="font-bold">Back to Dashboard</span>
                    </button>
                    <h1 className="text-xl font-heading font-bold text-primary">Study Session</h1>
                    <div className="w-32"></div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-heading font-bold mb-4">Start Your Study Session</h1>
                    <p className="text-xl text-text-secondary">Choose what you'd like to study today</p>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <Card className="p-6 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/syllabus')}>
                        <BookOpen size={48} className="text-primary mb-4" />
                        <h3 className="text-xl font-bold mb-2">Browse Syllabus</h3>
                        <p className="text-text-secondary">Explore all subjects and topics</p>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/chat')}>
                        <Target size={48} className="text-secondary mb-4" />
                        <h3 className="text-xl font-bold mb-2">Ask Shikshak</h3>
                        <p className="text-text-secondary">Get help with any doubt</p>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/history')}>
                        <Clock size={48} className="text-purple-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Continue Learning</h3>
                        <p className="text-text-secondary">Resume your last session</p>
                    </Card>
                </div>

                {/* Deep Link Info */}
                <Card className="p-6 bg-blue-50">
                    <h3 className="text-lg font-bold mb-3">📱 Deep Link Support</h3>
                    <p className="text-text-secondary mb-4">
                        You can create direct links to specific study sessions using URL parameters:
                    </p>
                    <div className="bg-white p-4 rounded-lg font-mono text-sm">
                        <p className="mb-2">
                            <strong>Learn Mode:</strong><br />
                            /study-session?subject=math&chapter=chapter1&topic=topic1&mode=learn
                        </p>
                        <p>
                            <strong>Practice Mode:</strong><br />
                            /study-session?subject=math&chapter=chapter1&topic=topic1&mode=practice
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
