import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import logger from '../../utils/logger';

export default function PracticeQuestions() {
    const { subjectId, chapterId, topicId } = useParams();
    const navigate = useNavigate();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);

    // Mock questions (replace with actual data)
    const questions = [
        {
            id: 1,
            question: "What is 1/2 + 1/4?",
            options: ["1/6", "2/6", "3/4", "2/4"],
            correct: 2,
            explanation: "To add fractions, we need the same denominator. 1/2 = 2/4, so 2/4 + 1/4 = 3/4"
        },
        {
            id: 2,
            question: "Which is larger: 2/3 or 3/4?",
            options: ["2/3", "3/4", "Both equal", "Cannot compare"],
            correct: 1,
            explanation: "Converting to same denominator: 2/3 = 8/12 and 3/4 = 9/12. So 3/4 is larger."
        },
        {
            id: 3,
            question: "What is 1/3 × 2?",
            options: ["2/3", "1/6", "2/6", "3/2"],
            correct: 0,
            explanation: "When multiplying a fraction by a whole number, multiply the numerator: 1×2/3 = 2/3"
        }
    ];

    const handleAnswerSelect = (index) => {
        if (showResult) return;
        setSelectedAnswer(index);
    };

    const handleSubmit = () => {
        if (selectedAnswer === null) return;

        setShowResult(true);
        logger.info('PracticeQuestions', 'Answer submitted', {
            question: currentQuestion,
            selected: selectedAnswer,
            correct: questions[currentQuestion].correct
        });

        if (selectedAnswer === questions[currentQuestion].correct) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            setCompleted(true);
            logger.success('PracticeQuestions', 'Practice completed', {
                score: score + (selectedAnswer === questions[currentQuestion].correct ? 1 : 0),
                total: questions.length
            });
        }
    };

    const question = questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;
    const finalScore = completed ? score : (score + (isCorrect && showResult ? 1 : 0));

    if (completed) {
        const percentage = (finalScore / questions.length) * 100;
        const passed = percentage >= 70;

        return (
            <div className="min-h-screen bg-background font-body flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Card className="max-w-2xl p-12 text-center">
                        <div className="text-8xl mb-6">
                            {passed ? '🎉' : '💪'}
                        </div>
                        <h1 className="text-4xl font-heading font-bold mb-4">
                            {passed ? 'Excellent Work!' : 'Good Effort!'}
                        </h1>
                        <div className="text-6xl font-bold mb-6 text-primary">
                            {finalScore}/{questions.length}
                        </div>
                        <p className="text-2xl text-text-secondary mb-8">
                            You scored {percentage.toFixed(0)}%
                        </p>

                        {passed ? (
                            <div className="bg-green-50 p-6 rounded-xl mb-6">
                                <Trophy size={48} className="mx-auto mb-3 text-yellow-500" />
                                <p className="text-lg font-bold text-green-700">
                                    You've mastered this topic! 🌟
                                </p>
                                <p className="text-green-600 mt-2">
                                    +10 coins earned!
                                </p>
                            </div>
                        ) : (
                            <div className="bg-blue-50 p-6 rounded-xl mb-6">
                                <Lightbulb size={48} className="mx-auto mb-3 text-blue-500" />
                                <p className="text-lg font-bold text-blue-700">
                                    Keep practicing to improve! 📚
                                </p>
                                <p className="text-blue-600 mt-2">
                                    Try reviewing the topic again
                                </p>
                            </div>
                        )}

                        <div className="flex gap-4 justify-center">
                            <Button
                                onClick={() => navigate(`/learn/${subjectId}/${chapterId}/${topicId}`)}
                                variant="outline"
                            >
                                Review Topic
                            </Button>
                            <Button onClick={() => navigate('/app')}>
                                Back to Dashboard
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background font-body">
            {/* Header */}
            <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
                    >
                        <ArrowLeft size={24} />
                        <span className="font-bold">Back</span>
                    </button>
                    <div className="text-center">
                        <h1 className="text-xl font-heading font-bold text-primary">Practice Questions</h1>
                        <p className="text-sm text-text-secondary">
                            Question {currentQuestion + 1} of {questions.length}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{score}</div>
                        <div className="text-xs text-text-secondary">Score</div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto p-6">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-text-secondary mb-2">
                        <span>Progress</span>
                        <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                            className="h-full bg-gradient-to-r from-primary to-secondary"
                        />
                    </div>
                </div>

                {/* Question Card */}
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Card className="p-8 mb-6">
                        <h2 className="text-3xl font-heading font-bold mb-8">
                            {question.question}
                        </h2>

                        {/* Options */}
                        <div className="space-y-4">
                            {question.options.map((option, index) => {
                                const isSelected = selectedAnswer === index;
                                const isCorrectAnswer = index === question.correct;
                                const showCorrect = showResult && isCorrectAnswer;
                                const showWrong = showResult && isSelected && !isCorrectAnswer;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(index)}
                                        disabled={showResult}
                                        className={`w-full p-6 rounded-xl border-2 text-left text-lg transition-all ${showCorrect
                                                ? 'border-green-500 bg-green-50'
                                                : showWrong
                                                    ? 'border-red-500 bg-red-50'
                                                    : isSelected
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-gray-200 hover:border-primary/50'
                                            } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{option}</span>
                                            {showCorrect && <CheckCircle className="text-green-500" size={24} />}
                                            {showWrong && <XCircle className="text-red-500" size={24} />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Explanation */}
                        {showResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mt-6 p-6 rounded-xl ${isCorrect ? 'bg-green-50' : 'bg-blue-50'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <Lightbulb className={isCorrect ? 'text-green-500' : 'text-blue-500'} size={24} />
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">
                                            {isCorrect ? 'Correct! 🎉' : 'Not quite! 🤔'}
                                        </h3>
                                        <p className="text-text-secondary">{question.explanation}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end">
                        {!showResult ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={selectedAnswer === null}
                                className="px-8 py-4 text-lg"
                            >
                                Submit Answer ✓
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                className="px-8 py-4 text-lg"
                            >
                                {currentQuestion < questions.length - 1 ? 'Next Question →' : 'See Results 🎯'}
                            </Button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
