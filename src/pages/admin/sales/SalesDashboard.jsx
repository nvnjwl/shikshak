import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layouts/AdminLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { IndianRupee, TrendingUp, Download, Calendar } from 'lucide-react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import logger from '../../../utils/logger';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

export default function SalesDashboard() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        todayRevenue: 0,
        thisMonthRevenue: 0,
        averageOrderValue: 0
    });
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetchSalesData();
    }, []);

    const fetchSalesData = async () => {
        try {
            setLoading(true);
            const paymentsColl = collection(db, 'payments');
            const q = query(paymentsColl, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
            }));

            setTransactions(data);
            calculateStats(data);
            prepareChartData(data);

        } catch (error) {
            logger.error('SalesDashboard', 'Error fetching sales data', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const totalRevenue = data.reduce((acc, curr) => acc + (curr.amount || 0), 0);

        const todayRevenue = data
            .filter(t => t.date >= startOfDay)
            .reduce((acc, curr) => acc + (curr.amount || 0), 0);

        const thisMonthRevenue = data
            .filter(t => t.date >= startOfMonth)
            .reduce((acc, curr) => acc + (curr.amount || 0), 0);

        const averageOrderValue = data.length > 0 ? totalRevenue / data.length : 0;

        setStats({
            totalRevenue,
            todayRevenue,
            thisMonthRevenue,
            averageOrderValue
        });
    };

    const prepareChartData = (data) => {
        // Group by date (last 7 days)
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const chartData = last7Days.map(dateStr => {
            const dayRevenue = data
                .filter(t => t.date.toISOString().split('T')[0] === dateStr)
                .reduce((acc, curr) => acc + (curr.amount || 0), 0);

            return {
                date: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: dayRevenue
            };
        });

        setChartData(chartData);
    };

    return (
        <AdminLayout>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary">Sales & Revenue</h1>
                    <p className="text-text-secondary">Track your earnings and transactions</p>
                </div>
                <Button variant="outline">
                    <Download size={18} className="mr-2" /> Export Report
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                    <p className="text-text-secondary text-sm font-medium mb-1">Total Revenue</p>
                    <h3 className="text-2xl font-bold font-heading">₹{stats.totalRevenue.toLocaleString()}</h3>
                </Card>
                <Card className="p-6">
                    <p className="text-text-secondary text-sm font-medium mb-1">Today's Revenue</p>
                    <h3 className="text-2xl font-bold font-heading text-green-600">₹{stats.todayRevenue.toLocaleString()}</h3>
                </Card>
                <Card className="p-6">
                    <p className="text-text-secondary text-sm font-medium mb-1">This Month</p>
                    <h3 className="text-2xl font-bold font-heading">₹{stats.thisMonthRevenue.toLocaleString()}</h3>
                </Card>
                <Card className="p-6">
                    <p className="text-text-secondary text-sm font-medium mb-1">Avg. Order Value</p>
                    <h3 className="text-2xl font-bold font-heading">₹{Math.round(stats.averageOrderValue).toLocaleString()}</h3>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-8">
                {/* Revenue Chart */}
                <Card className="p-6 lg:col-span-2">
                    <h3 className="text-lg font-bold mb-6">Revenue Overview (Last 7 Days)</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => [`₹${value}`, 'Revenue']}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="revenue" fill="#6366F1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Recent Transactions List (Compact) */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
                    <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
                        {transactions.slice(0, 5).map(t => (
                            <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="font-bold text-sm">{t.plan || 'Unknown Plan'}</p>
                                    <p className="text-xs text-text-secondary">{t.date.toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600">+₹{t.amount}</p>
                                    <p className="text-xs text-text-secondary capitalize">{t.status}</p>
                                </div>
                            </div>
                        ))}
                        {transactions.length === 0 && <p className="text-text-secondary text-sm">No transactions yet.</p>}
                    </div>
                </Card>
            </div>

            {/* All Transactions Table */}
            <Card className="overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold">Transaction History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-text-secondary">Date</th>
                                <th className="px-6 py-4 font-semibold text-text-secondary">Order ID</th>
                                <th className="px-6 py-4 font-semibold text-text-secondary">User ID</th>
                                <th className="px-6 py-4 font-semibold text-text-secondary">Plan</th>
                                <th className="px-6 py-4 font-semibold text-text-secondary">Amount</th>
                                <th className="px-6 py-4 font-semibold text-text-secondary">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map(t => (
                                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">{t.date.toLocaleDateString()} {t.date.toLocaleTimeString()}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{t.orderId || t.razorpayOrderId || '-'}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-text-secondary">{t.userId?.substring(0, 8)}...</td>
                                    <td className="px-6 py-4">{t.plan}</td>
                                    <td className="px-6 py-4 font-bold">₹{t.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize 
                                            ${t.status === 'success' ? 'bg-green-100 text-green-600' :
                                                t.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-red-100 text-red-600'}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-text-secondary">No transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AdminLayout>
    );
}
