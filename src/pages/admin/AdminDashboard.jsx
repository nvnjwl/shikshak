import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Users, IndianRupee, Zap, Clock, TrendingUp, UserPlus } from 'lucide-react';
import { collection, getCountFromServer, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import logger from '../../utils/logger';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRevenue: 0,
        activeTrials: 0,
        activeSubscriptions: 0
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // 1. Get Total Users
            const usersColl = collection(db, 'users');
            const usersSnapshot = await getCountFromServer(usersColl);
            const totalUsers = usersSnapshot.data().count;

            // 2. Get Active Trials
            const trialsQuery = query(
                usersColl,
                where('subscription.status', '==', 'free_trial')
            );
            const trialsSnapshot = await getCountFromServer(trialsQuery);
            const activeTrials = trialsSnapshot.data().count;

            // 3. Get Active Subscriptions
            const subsQuery = query(
                usersColl,
                where('subscription.status', '==', 'active')
            );
            const subsSnapshot = await getCountFromServer(subsQuery);
            const activeSubscriptions = subsSnapshot.data().count;

            // 4. Get Recent Users
            const recentUsersQuery = query(
                usersColl,
                orderBy('profile.createdAt', 'desc'),
                limit(5)
            );
            const recentUsersSnapshot = await getDocs(recentUsersQuery);
            const recentUsersData = recentUsersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data().profile
            }));

            // 5. Calculate Revenue (Mock for now, or fetch from payments collection)
            // In a real app, you'd aggregate this from the payments collection
            const paymentsColl = collection(db, 'payments');
            const paymentsSnapshot = await getDocs(query(paymentsColl, where('status', '==', 'success')));
            const totalRevenue = paymentsSnapshot.docs.reduce((acc, doc) => acc + (doc.data().amount || 0), 0);

            setStats({
                totalUsers,
                totalRevenue,
                activeTrials,
                activeSubscriptions
            });
            setRecentUsers(recentUsersData);

        } catch (error) {
            logger.error('AdminDashboard', 'Error fetching dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
        <Card className="p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold font-heading">{value}</h3>
                    {subtext && <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><TrendingUp size={12} /> {subtext}</p>}
                </div>
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon size={24} />
                </div>
            </div>
        </Card>
    );

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-primary">Dashboard Overview</h1>
                <p className="text-text-secondary">Welcome back, Admin!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Students"
                    value={stats.totalUsers}
                    icon={Users}
                    color="bg-blue-100 text-blue-600"
                    subtext="+12% from last month"
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={IndianRupee}
                    color="bg-green-100 text-green-600"
                    subtext="+8% from last month"
                />
                <StatCard
                    title="Active Trials"
                    value={stats.activeTrials}
                    icon={Zap}
                    color="bg-yellow-100 text-yellow-600"
                    subtext="High conversion rate"
                />
                <StatCard
                    title="Active Subscriptions"
                    value={stats.activeSubscriptions}
                    icon={UserPlus}
                    color="bg-purple-100 text-purple-600"
                    subtext="Steady growth"
                />
            </div>

            {/* Recent Activity & Charts Section */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Users */}
                <div className="lg:col-span-2">
                    <Card className="p-6 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Recent Registrations</h2>
                            <button className="text-primary text-sm font-medium hover:underline">View All</button>
                        </div>

                        <div className="space-y-4">
                            {recentUsers.length > 0 ? (
                                recentUsers.map(user => (
                                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold">{user.name || 'Unknown User'}</h4>
                                                <p className="text-xs text-text-secondary">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                                {user.class || 'No Class'}
                                            </span>
                                            <p className="text-xs text-text-secondary mt-1">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-text-secondary py-8">No recent users found.</p>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Quick Actions or Secondary Stats */}
                <div>
                    <Card className="p-6 h-full">
                        <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                        <div className="space-y-3">
                            <button className="w-full p-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                                <UserPlus size={18} /> Add New Student
                            </button>
                            <button className="w-full p-3 bg-white border border-gray-200 text-text-primary rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                <Zap size={18} /> Create Coupon
                            </button>
                            <button className="w-full p-3 bg-white border border-gray-200 text-text-primary rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                <Clock size={18} /> View Audit Log
                            </button>
                        </div>

                        <div className="mt-8">
                            <h3 className="font-bold mb-4">System Status</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Database</span>
                                    <span className="text-green-600 font-medium">Operational</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Auth Service</span>
                                    <span className="text-green-600 font-medium">Operational</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Payments</span>
                                    <span className="text-green-600 font-medium">Operational</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
