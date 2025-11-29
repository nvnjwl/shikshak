import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layouts/AdminLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Shield, Check, X, UserPlus, Search, AlertCircle } from 'lucide-react';
import { collection, getDocs, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import logger from '../../../utils/logger';
import { useAuth } from '../../../contexts/AuthContext';
import { useProfile } from '../../../contexts/ProfileContext';

const ROLES = {
    super_admin: { label: 'Super Admin', color: 'bg-purple-100 text-purple-700' },
    teacher: { label: 'Teacher', color: 'bg-blue-100 text-blue-700' },
    sales: { label: 'Sales', color: 'bg-green-100 text-green-700' },
    growth: { label: 'Growth', color: 'bg-orange-100 text-orange-700' }
};

export default function AdminManagement() {
    const { currentUser } = useAuth();
    const { profile } = useProfile();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showInvite, setShowInvite] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const usersRef = collection(db, 'users');
            // Fetch all users who are admins or have a pending status
            // Note: Firestore doesn't support logical OR in a single query easily for this structure
            // So we'll fetch where isAdmin == true
            const q = query(usersRef, where('profile.isAdmin', '==', true));
            const snapshot = await getDocs(q);

            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data().profile
            }));
            setAdmins(data);
        } catch (error) {
            logger.error('AdminManagement', 'Error fetching admins', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async (userId, newRole) => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                'profile.role': newRole,
                'profile.updatedAt': serverTimestamp()
            });

            setAdmins(prev => prev.map(admin =>
                admin.id === userId ? { ...admin, role: newRole } : admin
            ));
            logger.success('AdminManagement', 'Role updated', { userId, newRole });
        } catch (error) {
            logger.error('AdminManagement', 'Error updating role', error);
        }
    };

    const handleRemoveAdmin = async (userId) => {
        if (!window.confirm('Are you sure you want to remove admin access for this user?')) return;
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                'profile.isAdmin': false,
                'profile.role': null,
                'profile.updatedAt': serverTimestamp()
            });

            setAdmins(prev => prev.filter(admin => admin.id !== userId));
            logger.success('AdminManagement', 'Admin removed', { userId });
        } catch (error) {
            logger.error('AdminManagement', 'Error removing admin', error);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        // In a real app, this would send an email or create an invitation record.
        // For now, we'll search for an existing user and promote them if found.
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('profile.email', '==', inviteEmail));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                alert('User not found. Please ask them to sign up first.');
                return;
            }

            const userDoc = snapshot.docs[0];
            const userId = userDoc.id;

            await updateDoc(doc(db, 'users', userId), {
                'profile.isAdmin': true,
                'profile.role': 'teacher', // Default role
                'profile.adminStatus': 'approved'
            });

            setInviteEmail('');
            setShowInvite(false);
            fetchAdmins();
            alert('User promoted to Admin (Teacher role). You can change their role now.');

        } catch (error) {
            logger.error('AdminManagement', 'Error promoting user', error);
        }
    };

    if (profile?.role !== 'super_admin' && profile?.email !== 'admin@edutainverse.com') {
        return (
            <AdminLayout>
                <div className="p-8 text-center text-red-600">
                    <AlertCircle size={48} className="mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Access Denied</h2>
                    <p>Only Super Admins can access this page.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary">Admin Management</h1>
                    <p className="text-text-secondary">Manage admin access and roles</p>
                </div>
                <Button onClick={() => setShowInvite(true)}>
                    <UserPlus size={18} className="mr-2" /> Add New Admin
                </Button>
            </div>

            {showInvite && (
                <Card className="mb-6 p-6 border-l-4 border-l-primary">
                    <h3 className="font-bold text-lg mb-2">Add New Admin</h3>
                    <p className="text-sm text-text-secondary mb-4">Enter the email of an existing user to promote them to Admin.</p>
                    <form onSubmit={handleInvite} className="flex gap-2">
                        <input
                            type="email"
                            placeholder="user@example.com"
                            className="flex-1 p-2 border rounded-lg"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            required
                        />
                        <Button type="submit">Promote</Button>
                        <Button type="button" variant="ghost" onClick={() => setShowInvite(false)}>Cancel</Button>
                    </form>
                </Card>
            )}

            <Card className="overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search admins..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-text-secondary font-medium">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {admins
                                .filter(admin =>
                                    (admin.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                                    (admin.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
                                )
                                .map(admin => (
                                    <tr key={admin.id} className="hover:bg-gray-50/50">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900">{admin.name || 'Unknown'}</div>
                                            <div className="text-xs text-text-secondary">{admin.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <select
                                                className="p-2 border rounded-lg bg-white text-sm"
                                                value={admin.role || 'teacher'}
                                                onChange={(e) => handleUpdateRole(admin.id, e.target.value)}
                                                disabled={admin.email === 'admin@edutainverse.com'}
                                            >
                                                {Object.entries(ROLES).map(([key, config]) => (
                                                    <option key={key} value={key}>{config.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${admin.adminStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                {admin.adminStatus || 'Active'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {admin.email !== 'admin@edutainverse.com' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleRemoveAdmin(admin.id)}
                                                >
                                                    <X size={16} className="mr-1" /> Remove
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AdminLayout>
    );
}
