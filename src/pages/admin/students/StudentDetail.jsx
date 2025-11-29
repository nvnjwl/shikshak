import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/layouts/AdminLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, User, Mail, Calendar, BookOpen, CreditCard, Clock, Edit2, Save, X, Trash2, AlertTriangle } from 'lucide-react';
import { doc, getDoc, collection, query, where, getDocs, orderBy, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import logger from '../../../utils/logger';

export default function StudentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit States
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: '', class: '' });

    const [isEditingSub, setIsEditingSub] = useState(false);
    const [subForm, setSubForm] = useState({ plan: '', status: '' });

    useEffect(() => {
        fetchStudentDetails();
    }, [id]);

    const fetchStudentDetails = async () => {
        try {
            setLoading(true);

            // 1. Fetch User Profile
            const userDoc = await getDoc(doc(db, 'users', id));
            if (!userDoc.exists()) {
                alert('Student not found');
                navigate('/admin/students');
                return;
            }
            const userData = userDoc.data();
            setStudent({ id: userDoc.id, ...userData });

            // Initialize forms
            setProfileForm({
                name: userData.profile?.name || '',
                class: userData.profile?.class || '6th'
            });
            setSubForm({
                plan: userData.subscription?.plan || 'free',
                status: userData.subscription?.status || 'free'
            });

            // 2. Fetch Payment History
            const paymentsColl = collection(db, 'payments');
            const q = query(
                paymentsColl,
                where('userId', '==', id),
                orderBy('createdAt', 'desc')
            );
            const paymentsSnapshot = await getDocs(q);
            const paymentsData = paymentsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPayments(paymentsData);

        } catch (error) {
            logger.error('StudentDetail', 'Error fetching student details', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const userRef = doc(db, 'users', id);
            await updateDoc(userRef, {
                'profile.name': profileForm.name,
                'profile.class': profileForm.class
            });

            setStudent(prev => ({
                ...prev,
                profile: { ...prev.profile, ...profileForm }
            }));
            setIsEditingProfile(false);
        } catch (error) {
            logger.error('StudentDetail', 'Error updating profile', error);
            alert('Failed to update profile');
        }
    };

    const handleUpdateSubscription = async () => {
        try {
            const userRef = doc(db, 'users', id);
            await updateDoc(userRef, {
                'subscription.plan': subForm.plan,
                'subscription.status': subForm.status
            });

            setStudent(prev => ({
                ...prev,
                subscription: { ...prev.subscription, ...subForm }
            }));
            setIsEditingSub(false);
        } catch (error) {
            logger.error('StudentDetail', 'Error updating subscription', error);
            alert('Failed to update subscription');
        }
    };

    const handleDeleteUser = async () => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            await deleteDoc(doc(db, 'users', id));
            navigate('/admin/students');
        } catch (error) {
            logger.error('StudentDetail', 'Error deleting user', error);
            alert('Failed to delete user');
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-full">
                    <p>Loading student details...</p>
                </div>
            </AdminLayout>
        );
    }

    if (!student) return null;

    const { profile, subscription, usage } = student;

    return (
        <AdminLayout>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <Button variant="ghost" onClick={() => navigate('/admin/students')} className="mb-4 pl-0 hover:pl-2 transition-all">
                        <ArrowLeft size={20} className="mr-2" /> Back to Students
                    </Button>
                    <h1 className="text-3xl font-heading font-bold text-primary">Student Details</h1>
                </div>
                <Button variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={handleDeleteUser}>
                    <Trash2 size={18} className="mr-2" /> Delete User
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="p-6 md:col-span-1 h-fit">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg">Profile</h3>
                        {!isEditingProfile ? (
                            <button onClick={() => setIsEditingProfile(true)} className="text-primary hover:bg-primary/10 p-1 rounded">
                                <Edit2 size={16} />
                            </button>
                        ) : (
                            <div className="flex gap-1">
                                <button onClick={handleUpdateProfile} className="text-green-600 hover:bg-green-50 p-1 rounded">
                                    <Save size={16} />
                                </button>
                                <button onClick={() => setIsEditingProfile(false)} className="text-gray-500 hover:bg-gray-100 p-1 rounded">
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold mb-4">
                            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                        </div>

                        {isEditingProfile ? (
                            <input
                                className="text-xl font-bold text-center border-b border-primary focus:outline-none mb-1 w-full"
                                value={profileForm.name}
                                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                            />
                        ) : (
                            <h2 className="text-xl font-bold">{profile.name}</h2>
                        )}
                        <p className="text-text-secondary">{profile.email}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                            <User size={18} className="text-gray-400" />
                            <span className="font-semibold">Class:</span>
                            {isEditingProfile ? (
                                <select
                                    className="border rounded p-1"
                                    value={profileForm.class}
                                    onChange={e => setProfileForm({ ...profileForm, class: e.target.value })}
                                >
                                    <option value="4th">Class 4</option>
                                    <option value="5th">Class 5</option>
                                    <option value="6th">Class 6</option>
                                    <option value="7th">Class 7</option>
                                    <option value="8th">Class 8</option>
                                </select>
                            ) : (
                                <span>{profile.class || 'Not Set'}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Calendar size={18} className="text-gray-400" />
                            <span className="font-semibold">Joined:</span>
                            <span>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <BookOpen size={18} className="text-gray-400" />
                            <span className="font-semibold">Subjects:</span>
                            <span>{profile.subjects?.length || 0} selected</span>
                        </div>
                    </div>
                </Card>

                {/* Subscription & Usage */}
                <div className="md:col-span-2 space-y-6">
                    {/* Subscription Status */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <CreditCard className="text-primary" /> Subscription Status
                            </h3>
                            {!isEditingSub ? (
                                <button onClick={() => setIsEditingSub(true)} className="text-primary hover:bg-primary/10 p-1 rounded">
                                    <Edit2 size={16} />
                                </button>
                            ) : (
                                <div className="flex gap-1">
                                    <button onClick={handleUpdateSubscription} className="text-green-600 hover:bg-green-50 p-1 rounded">
                                        <Save size={16} />
                                    </button>
                                    <button onClick={() => setIsEditingSub(false)} className="text-gray-500 hover:bg-gray-100 p-1 rounded">
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-text-secondary mb-1">Current Plan</p>
                                {isEditingSub ? (
                                    <select
                                        className="w-full p-1 border rounded bg-white"
                                        value={subForm.plan}
                                        onChange={e => setSubForm({ ...subForm, plan: e.target.value })}
                                    >
                                        <option value="free">Free</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                ) : (
                                    <p className="font-bold text-lg capitalize">{subscription?.plan || 'Free Tier'}</p>
                                )}
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-text-secondary mb-1">Status</p>
                                {isEditingSub ? (
                                    <select
                                        className="w-full p-1 border rounded bg-white"
                                        value={subForm.status}
                                        onChange={e => setSubForm({ ...subForm, status: e.target.value })}
                                    >
                                        <option value="free">Free</option>
                                        <option value="free_trial">Free Trial</option>
                                        <option value="active">Active</option>
                                        <option value="expired">Expired</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                ) : (
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize 
                                        ${subscription?.status === 'active' ? 'bg-green-100 text-green-600' :
                                            subscription?.status === 'free_trial' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-gray-200 text-gray-600'}`}>
                                        {subscription?.status?.replace('_', ' ') || 'Free'}
                                    </span>
                                )}
                            </div>
                            {subscription?.startDate && (
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-text-secondary mb-1">Start Date</p>
                                    <p className="font-medium">{new Date(subscription.startDate).toLocaleDateString()}</p>
                                </div>
                            )}
                            {subscription?.endDate && (
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-text-secondary mb-1">End Date</p>
                                    <p className="font-medium">{new Date(subscription.endDate).toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Usage Stats */}
                    <Card className="p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Clock className="text-primary" /> Usage Today
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-4 border border-gray-100 rounded-xl">
                                <p className="text-sm text-text-secondary">AI Questions</p>
                                <p className="text-2xl font-bold">{usage?.aiQuestionsToday || 0}</p>
                            </div>
                            <div className="p-4 border border-gray-100 rounded-xl">
                                <p className="text-sm text-text-secondary">Practice Questions</p>
                                <p className="text-2xl font-bold">{usage?.practiceQuestionsToday || 0}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Payment History */}
                    <Card className="p-6">
                        <h3 className="text-lg font-bold mb-4">Payment History</h3>
                        {payments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="p-3 rounded-l-lg">Date</th>
                                            <th className="p-3">Amount</th>
                                            <th className="p-3">Plan</th>
                                            <th className="p-3 rounded-r-lg">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map(payment => (
                                            <tr key={payment.id} className="border-b border-gray-50 last:border-0">
                                                <td className="p-3">{new Date(payment.createdAt.seconds * 1000).toLocaleDateString()}</td>
                                                <td className="p-3 font-medium">₹{payment.amount}</td>
                                                <td className="p-3">{payment.plan}</td>
                                                <td className="p-3">
                                                    <span className="text-green-600 font-medium capitalize">{payment.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-text-secondary text-sm">No payment history found.</p>
                        )}
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
