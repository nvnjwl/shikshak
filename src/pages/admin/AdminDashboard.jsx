import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import {
    Users, TrendingUp, DollarSign, BookOpen,
    Search, Filter, Download, BarChart3
} from 'lucide-react';
import logger from '../../utils/logger';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data
    const stats = {
        totalUsers: 12547,
        activeToday: 8234,
        revenue: 2547000,
        avgSessionTime: 45
    };

    const recentUsers = [
        { id: 1, name: 'Rohan Kumar', class: 6, joinedDays: 2, active: true },
        { id: 2, name: 'Priya Sharma', class: 7, joinedDays: 5, active: true },
        { id: 3, name: 'Arjun Patel', class: 5, joinedDays: 12, active: false }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-body">
            {/* Header */}
            <header className="bg-white shadow-sm p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-heading font-bold text-primary">Shikshak Admin</h1>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                            <Download size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-6">
                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="text-blue-500" size={32} />
                            <span className="text-sm text-green-600 font-bold">+12%</span>
                        </div>
                        <div className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                        <div className="text-sm text-text-secondary">Total Users</div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="text-green-500" size={32} />
                            <span className="text-sm text-green-600 font-bold">+8%</span>
                        </div>
                        <div className="text-3xl font-bold">{stats.activeToday.toLocaleString()}</div>
                        <div className="text-sm text-text-secondary">Active Today</div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <DollarSign className="text-yellow-500" size={32} />
                            <span className="text-sm text-green-600 font-bold">+25%</span>
                        </div>
                        <div className="text-3xl font-bold">₹{(stats.revenue / 100000).toFixed(1)}L</div>
                        <div className="text-sm text-text-secondary">Monthly Revenue</div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <BookOpen className="text-purple-500" size={32} />
                            <span className="text-sm text-blue-600 font-bold">Avg</span>
                        </div>
                        <div className="text-3xl font-bold">{stats.avgSessionTime} min</div>
                        <div className="text-sm text-text-secondary">Session Time</div>
                    </Card>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b">
                    {['overview', 'users', 'content', 'revenue'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-bold capitalize transition-colors ${activeTab === tab
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-text-secondary hover:text-primary'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content based on active tab */}
                {activeTab === 'users' && (
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-heading font-bold">User Management</h2>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        className="pl-10 pr-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                                    <Filter size={20} />
                                    Filter
                                </button>
                            </div>
                        </div>

                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3">Name</th>
                                    <th className="text-left py-3">Class</th>
                                    <th className="text-left py-3">Joined</th>
                                    <th className="text-left py-3">Status</th>
                                    <th className="text-left py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map((user) => (
                                    <tr key={user.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3">{user.name}</td>
                                        <td className="py-3">Class {user.class}</td>
                                        <td className="py-3">{user.joinedDays} days ago</td>
                                        <td className="py-3">
                                            <span className={`px-3 py-1 rounded-full text-sm ${user.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {user.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <button className="text-primary hover:underline">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                )}

                {activeTab === 'overview' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-xl font-bold mb-4">User Growth</h3>
                            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                <BarChart3 size={64} className="text-gray-300" />
                                <p className="text-gray-400 ml-4">Chart placeholder</p>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-xl font-bold mb-4">Revenue Trend</h3>
                            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                <TrendingUp size={64} className="text-gray-300" />
                                <p className="text-gray-400 ml-4">Chart placeholder</p>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
