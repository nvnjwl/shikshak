import { useState, useRef, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Send, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sendMessageToShikshak } from '../../services/ai';
import { clsx } from 'clsx';

export default function ChatSession() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { role: 'ai', text: "Namaste! I'm Shikshak. What are we studying today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    async function handleSend(e) {
        e.preventDefault();
        if (!input.trim() && !image) return;

        const userMsg = { role: 'user', text: input, image: image };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setImage(null);
        setLoading(true);

        try {
            const responseText = await sendMessageToShikshak(input, messages, image);
            const aiMsg = { role: 'ai', text: responseText };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("AI Error:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col font-body">
            {/* Header */}
            <header className="bg-surface shadow-sm p-4 flex items-center gap-4 sticky top-0 z-10">
                <button onClick={() => navigate('/app')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-text-secondary" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
                        S
                    </div>
                    <div>
                        <h1 className="font-heading font-bold text-lg">Shikshak</h1>
                        <p className="text-xs text-green-500 font-bold">Online</p>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 pb-32">
                {messages.map((msg, idx) => (
                    <div key={idx} className={clsx(
                        "flex w-full",
                        msg.role === 'user' ? "justify-end" : "justify-start"
                    )}>
                        <div className={clsx(
                            "max-w-[80%] p-4 rounded-2xl text-lg shadow-sm space-y-2",
                            msg.role === 'user'
                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                : "bg-white border border-gray-100 rounded-tl-none"
                        )}>
                            {msg.image && (
                                <img src={msg.image} alt="Homework" className="rounded-lg max-h-60 object-cover" />
                            )}
                            {msg.text && <p>{msg.text}</p>}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface border-t border-gray-100">
                {image && (
                    <div className="mb-2 p-2 bg-gray-50 rounded-lg flex items-center justify-between max-w-4xl mx-auto">
                        <span className="text-sm text-text-secondary">Image selected</span>
                        <button onClick={() => setImage(null)} className="text-red-500 text-sm font-bold">Remove</button>
                    </div>
                )}
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        className="px-3 rounded-xl"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Camera size={24} />
                    </Button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your doubt here..."
                        className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-lg"
                    />
                    <Button type="submit" disabled={loading || (!input.trim() && !image)} className="px-4 rounded-xl">
                        <Send size={24} />
                    </Button>
                </form>
            </div>
        </div>
    );
}
