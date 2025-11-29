import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/layouts/AdminLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, User, Mail, Calendar, MessageSquare, Send, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import logger from '../../../utils/logger';
import { useAuth } from '../../../contexts/AuthContext';

export default function SupportTicketDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchTicket();
    }, [id]);

    const fetchTicket = async () => {
        try {
            setLoading(true);
            const docRef = doc(db, 'support_tickets', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setTicket({
                    id: docSnap.id,
                    ...docSnap.data(),
                    createdAt: docSnap.data().createdAt?.toDate ? docSnap.data().createdAt.toDate() : new Date(docSnap.data().createdAt)
                });
            } else {
                logger.error('SupportTicketDetail', 'Ticket not found');
                navigate('/admin/support');
            }
        } catch (error) {
            logger.error('SupportTicketDetail', 'Error fetching ticket', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!reply.trim()) return;

        try {
            setSending(true);
            const ticketRef = doc(db, 'support_tickets', id);

            const newReply = {
                message: reply,
                sender: 'admin',
                senderName: currentUser.displayName || 'Admin',
                timestamp: new Date().toISOString()
            };

            await updateDoc(ticketRef, {
                replies: arrayUnion(newReply),
                status: 'in_progress', // Auto-update status on reply
                updatedAt: serverTimestamp()
            });

            setTicket(prev => ({
                ...prev,
                replies: [...(prev.replies || []), newReply],
                status: 'in_progress'
            }));
            setReply('');
        } catch (error) {
            logger.error('SupportTicketDetail', 'Error sending reply', error);
            alert('Failed to send reply');
        } finally {
            setSending(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const ticketRef = doc(db, 'support_tickets', id);
            await updateDoc(ticketRef, {
                status: newStatus,
                updatedAt: serverTimestamp()
            });
            setTicket(prev => ({ ...prev, status: newStatus }));
        } catch (error) {
            logger.error('SupportTicketDetail', 'Error updating status', error);
        }
    };

    if (loading) return <AdminLayout><div className="p-8 text-center">Loading ticket...</div></AdminLayout>;
    if (!ticket) return null;

    return (
        <AdminLayout>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <Button variant="ghost" onClick={() => navigate('/admin/support')} className="mb-4 pl-0 hover:pl-2 transition-all">
                        <ArrowLeft size={20} className="mr-2" /> Back to Tickets
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-heading font-bold text-primary">Ticket #{ticket.id.substring(0, 8)}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize 
                            ${ticket.status === 'open' ? 'bg-blue-100 text-blue-600' :
                                ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-600' :
                                    ticket.status === 'resolved' ? 'bg-green-100 text-green-600' :
                                        'bg-gray-100 text-gray-600'}`}>
                            {ticket.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    {ticket.status !== 'resolved' && (
                        <Button
                            variant="outline"
                            className="text-green-600 hover:bg-green-50 border-green-200"
                            onClick={() => handleStatusChange('resolved')}
                        >
                            <CheckCircle size={18} className="mr-2" /> Mark Resolved
                        </Button>
                    )}
                    {ticket.status !== 'closed' && (
                        <Button
                            variant="ghost"
                            className="text-gray-500"
                            onClick={() => handleStatusChange('closed')}
                        >
                            Close Ticket
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Conversation Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Original Message */}
                    <Card className="p-6 border-l-4 border-l-primary">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-lg">{ticket.subject}</h3>
                            <span className="text-xs text-text-secondary">
                                {ticket.createdAt.toLocaleString()}
                            </span>
                        </div>
                        <p className="text-text-primary whitespace-pre-wrap">{ticket.message}</p>
                    </Card>

                    {/* Replies */}
                    {ticket.replies?.map((reply, index) => (
                        <div
                            key={index}
                            className={`flex ${reply.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] rounded-xl p-4 ${reply.sender === 'admin'
                                    ? 'bg-primary text-white rounded-tr-none'
                                    : 'bg-white border border-gray-200 rounded-tl-none'
                                }`}>
                                <div className="flex justify-between items-center gap-4 mb-2">
                                    <span className={`text-xs font-bold ${reply.sender === 'admin' ? 'text-white/90' : 'text-primary'}`}>
                                        {reply.senderName}
                                    </span>
                                    <span className={`text-xs ${reply.sender === 'admin' ? 'text-white/70' : 'text-text-secondary'}`}>
                                        {new Date(reply.timestamp).toLocaleString()}
                                    </span>
                                </div>
                                <p className="whitespace-pre-wrap text-sm">{reply.message}</p>
                            </div>
                        </div>
                    ))}

                    {/* Reply Box */}
                    <Card className="p-4">
                        <form onSubmit={handleReply}>
                            <textarea
                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-y"
                                placeholder="Type your reply here..."
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                            />
                            <div className="flex justify-end mt-2">
                                <Button type="submit" disabled={!reply.trim() || sending}>
                                    {sending ? 'Sending...' : <><Send size={18} className="mr-2" /> Send Reply</>}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="font-bold text-lg mb-4">User Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {ticket.userName ? ticket.userName.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                    <p className="font-bold">{ticket.userName || 'Unknown'}</p>
                                    <p className="text-xs text-text-secondary">Student</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Mail size={16} className="text-gray-400" />
                                <span className="text-text-secondary">{ticket.userEmail}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <User size={16} className="text-gray-400" />
                                <span className="text-text-secondary">ID: {ticket.userId}</span>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <Button variant="outline" className="w-full" onClick={() => navigate(`/admin/students/${ticket.userId}`)}>
                                View Full Profile
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-bold text-lg mb-4">Ticket Info</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Priority</span>
                                <span className={`font-medium capitalize ${ticket.priority === 'high' ? 'text-red-600' :
                                        ticket.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                                    }`}>{ticket.priority || 'Low'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Category</span>
                                <span className="font-medium capitalize">{ticket.category || 'General'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Created</span>
                                <span className="font-medium">{ticket.createdAt.toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Last Updated</span>
                                <span className="font-medium">
                                    {ticket.updatedAt ? new Date(ticket.updatedAt.toDate ? ticket.updatedAt.toDate() : ticket.updatedAt).toLocaleDateString() : 'Never'}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
