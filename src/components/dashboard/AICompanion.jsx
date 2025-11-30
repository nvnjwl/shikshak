import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, Send, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export default function AICompanion({ userName }) {
    const navigate = useNavigate();
    const [input, setInput] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (input.trim()) {
            // Navigate to chat with the initial message
            navigate('/chat', { state: { initialMessage: input } });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto mb-12 text-center"
        >
            <div className="mb-6 inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto shadow-lg mb-4 animate-bounce-slow">
                    <Sparkles className="text-white w-12 h-12" />
                </div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-2">
                    🎉 Hey {userName}!
                </h1>
                <p className="text-2xl text-text-secondary font-medium">
                    Ready to learn something AWESOME today?
                </p>
            </div>

            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                    <div className="relative flex items-center bg-white rounded-full shadow-xl p-2 border-2 border-gray-100 hover:border-primary/30 transition-colors">
                        <div className="pl-4 text-gray-400">
                            <MessageCircle size={28} />
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything! Like 'Why is the sky blue?' 🌈"
                            className="w-full px-4 py-4 text-lg bg-transparent border-none focus:ring-0 placeholder-gray-400 text-gray-800"
                        />
                        <div className="flex items-center gap-2 pr-2">
                            <button type="button" className="p-2 text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-gray-50">
                                <Mic size={22} />
                            </button>
                            <Button
                                type="submit"
                                size="icon"
                                className="rounded-full w-12 h-12 bg-primary hover:bg-primary-dark text-white shadow-md hover:scale-110 transition-transform"
                            >
                                <Send size={20} className="ml-0.5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </form>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
                <span className="text-sm text-gray-500 py-2 font-medium">Try asking:</span>
                {[
                    { text: '🔬 Science Tricks', query: 'Show me a cool science experiment' },
                    { text: '📐 Math Games', query: 'Teach me math with a fun game' },
                    { text: '📚 Story Time', query: 'Tell me an interesting story' }
                ].map((suggestion) => (
                    <button
                        key={suggestion.text}
                        onClick={() => navigate('/chat', { state: { initialMessage: suggestion.query } })}
                        className="text-sm px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-100 text-gray-700 hover:border-primary hover:shadow-md transition-all font-medium hover:scale-105"
                    >
                        {suggestion.text}
                    </button>
                ))}
            </div>
        </motion.div>
    );
}
