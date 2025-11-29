import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layouts/AdminLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Search, Filter, Eye, MoreVertical } from 'lucide-react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import logger from '../../../utils/logger';
import { useNavigate } from 'react-router-dom';

export default function StudentList() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const usersColl = collection(db, 'users');
            const q = query(usersColl, orderBy('profile.createdAt', 'desc'));
            const snapshot = await getDocs(q);

            const studentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setStudents(studentsData);
        } catch (error) {
            logger.error('StudentList', 'Error fetching students', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter students
    const filteredStudents = students.filter(student => {
        const profile = student.profile || {};
        const subscription = student.subscription || {};

        // Search
        const matchesSearch = (profile.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (profile.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        // Filter Class
        const matchesClass = filterClass === 'all' || profile.class === filterClass;

        // Filter Status
        const status = subscription.status || 'free';
        const matchesStatus = filterStatus === 'all' || status === filterStatus;

        return matchesSearch && matchesClass && matchesStatus;
    });

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary">Students</h1>
                    <p className="text-text-secondary">Manage all registered students</p>
                </div>
                <Button onClick={() => fetchStudents()}>Refresh List</Button>
            </div>

            <Card className="p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <select
                            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                            value={filterClass}
                            onChange={(e) => setFilterClass(e.target.value)}
                        >
                            <option value="all">All Classes</option>
                            <option value="5th">Class 5</option>
                            <option value="6th">Class 6</option>
                            <option value="7th">Class 7</option>
                            <option value="8th">Class 8</option>
                        </select>
                        <select
                            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="free">Free</option>
                            <option value="free_trial">Trial</option>
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                        </select>
                    </div>
                </div>
            </Card>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-sm text-text-secondary">Student</th>
                                <th className="px-6 py-4 font-semibold text-sm text-text-secondary">Class</th>
                                <th className="px-6 py-4 font-semibold text-sm text-text-secondary">Status</th>
                                <th className="px-6 py-4 font-semibold text-sm text-text-secondary">Joined</th>
                                <th className="px-6 py-4 font-semibold text-sm text-text-secondary">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-text-secondary">Loading students...</td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-text-secondary">No students found matching your filters.</td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => {
                                    const profile = student.profile || {};
                                    const subscription = student.subscription || {};
                                    const status = subscription.status || 'free';

                                    let statusColor = 'bg-gray-100 text-gray-600';
                                    if (status === 'active') statusColor = 'bg-green-100 text-green-600';
                                    if (status === 'free_trial') statusColor = 'bg-yellow-100 text-yellow-600';
                                    if (status === 'expired') statusColor = 'bg-red-100 text-red-600';

                                    return (
                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-text-primary">{profile.name || 'Unknown'}</div>
                                                        <div className="text-xs text-text-secondary">{profile.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">
                                                    {profile.class || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColor}`}>
                                                    {status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-secondary">
                                                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/admin/students/${student.id}`)}
                                                >
                                                    <Eye size={18} />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
