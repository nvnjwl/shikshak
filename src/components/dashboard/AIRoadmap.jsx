import { motion } from 'framer-motion';
import { CheckCircle, Circle, Lock } from 'lucide-react';

export default function AIRoadmap({ subjects }) {
    // Calculate overall progress
    const totalProgress = subjects.reduce((acc, sub) => acc + sub.progress, 0) / (subjects.length || 1);

    return (
        <div className="relative py-8">
            {/* Connecting Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 -translate-x-1/2 rounded-full hidden md:block" />

            <div className="space-y-12 relative">
                {subjects.map((subject, index) => {
                    const isLeft = index % 2 === 0;
                    const isCompleted = subject.progress === 100;
                    const inProgress = subject.progress > 0 && subject.progress < 100;

                    return (
                        <motion.div
                            key={subject.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col`}
                        >
                            {/* Content Card */}
                            <div className={`flex-1 w-full ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                                <div className={`bg-white p-6 rounded-2xl shadow-sm border-2 transition-all hover:shadow-md cursor-pointer
                                    ${inProgress ? 'border-primary' : 'border-transparent'}
                                `}>
                                    <h3 className="text-xl font-bold mb-2">{subject.name}</h3>
                                    <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                                        <div
                                            className={`${subject.color} h-2 rounded-full transition-all duration-1000`}
                                            style={{ width: `${subject.progress}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-text-secondary">
                                        {subject.completedCount} / {subject.totalTopics} Topics Completed
                                    </p>
                                </div>
                            </div>

                            {/* Center Node */}
                            <div className="relative z-10 shrink-0">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 bg-white
                                    ${isCompleted ? 'border-green-500 text-green-500' :
                                        inProgress ? 'border-primary text-primary' : 'border-gray-200 text-gray-300'}
                                `}>
                                    {isCompleted ? <CheckCircle size={24} /> :
                                        inProgress ? <span className="text-lg font-bold">{Math.round(subject.progress)}%</span> :
                                            <Lock size={20} />}
                                </div>
                            </div>

                            {/* Spacer for layout balance */}
                            <div className="flex-1 hidden md:block" />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
