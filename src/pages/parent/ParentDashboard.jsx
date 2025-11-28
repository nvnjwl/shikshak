import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BarChart, Activity, Clock, Bell } from 'lucide-react';

export default function ParentDashboard() {
    return (
        <div className="min-h-screen bg-gray-50 font-body">
            {/* Header */}
            <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-heading font-bold text-secondary">Shikshak Parent</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-text-secondary">Rohan's Dad</span>
                        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-bold">R</div>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto p-6 space-y-6">
                {/* Overview Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Study Streak</p>
                            <h3 className="text-2xl font-bold">5 Days 🔥</h3>
                        </div>
                    </Card>
                    <Card className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Time Today</p>
                            <h3 className="text-2xl font-bold">45 mins</h3>
                        </div>
                    </Card>
                    <Card className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                            <BarChart size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Questions Solved</p>
                            <h3 className="text-2xl font-bold">12/15</h3>
                        </div>
                    </Card>
                </div>

                {/* Weekly Report */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                        <h3 className="font-bold text-lg mb-4">Weekly Progress</h3>
                        <div className="h-64 flex items-end justify-between gap-2 px-4">
                            {[40, 60, 30, 80, 45, 0, 0].map((h, i) => (
                                <div key={i} className="w-full bg-gray-100 rounded-t-lg relative group">
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-secondary rounded-t-lg transition-all hover:bg-secondary-hover"
                                        style={{ height: `${h}%` }}
                                    />
                                    <span className="absolute -bottom-6 left-0 right-0 text-center text-xs text-text-secondary">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="space-y-6">
                        <Card>
                            <h3 className="font-bold text-lg mb-2">Actions</h3>
                            <p className="text-sm text-text-secondary mb-4">Encourage Rohan to keep learning!</p>
                            <Button className="w-full flex items-center justify-center gap-2">
                                <Bell size={18} /> Send Nudge
                            </Button>
                        </Card>

                        <Card className="bg-yellow-50 border-yellow-100">
                            <h3 className="font-bold text-lg mb-2 text-yellow-800">Teacher's Note</h3>
                            <p className="text-sm text-yellow-700">
                                "Rohan is doing great in Science but needs a little more practice with Fractions in Math."
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
