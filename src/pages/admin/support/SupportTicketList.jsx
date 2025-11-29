import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layouts/AdminLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Search, Filter, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import logger from '../../../utils/logger';
import { useNavigate } from 'react-router-dom';

export default function SupportTicketList() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const ticketsColl = collection(db, 'support_tickets');
            const q = query(ticketsColl, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
            }));

            setTickets(data);
        } catch (error) {
            logger.error('SupportTicketList', 'Error fetching tickets', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
        const matchesSearch = (ticket.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (ticket.userEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (ticket.id?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-600';
            case 'in_progress': return 'bg-yellow-100 text-yellow-600';
            case 'resolved': return 'bg-green-100 text-green-600';
            case 'closed': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'high': return <AlertCircle size={16} className="text-red-500" />;
            case 'medium': return <Clock size={16} className="text-yellow-500" />;
            case 'low': return <CheckCircle size={16} className="text-blue-500" />;
            default: return null;
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary">Support Tickets</h1>
                    <p className="text-text-secondary">Manage user inquiries and issues</p>
                </div>
                <Button onClick={() => fetchTickets()}>Refresh List</Button>
            </div>

            <Card className="p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by subject, email, or ID..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </Card>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12">Loading tickets...</div>
                ) : filteredTickets.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No tickets found</h3>
                        <p className="text-text-secondary">Great job! All caught up.</p>
                    </div>
                ) : (
                    filteredTickets.map(ticket => (
                        <Card
                            key={ticket.id}
                            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate(`/admin/support/${ticket.id}`)}
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(ticket.status)}`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                        <span className="text-xs text-text-secondary font-mono">#{ticket.id.substring(0, 8)}</span>
                                        {ticket.priority && (
                                            <div className="flex items-center gap-1 text-xs font-medium capitalize">
                                                {getPriorityIcon(ticket.priority)}
                                                {ticket.priority} Priority
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">{ticket.subject}</h3>
                                    <p className="text-sm text-text-secondary line-clamp-1">{ticket.message}</p>
                                </div>
                                <div className="flex flex-col items-end justify-between text-right">
                                    <div className="text-sm font-medium">{ticket.userName || 'Unknown User'}</div>
                                    <div className="text-xs text-text-secondary">{ticket.userEmail}</div>
                                    <div className="text-xs text-text-secondary mt-2">
                                        {ticket.createdAt.toLocaleDateString()} {ticket.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </AdminLayout>
    );
}
