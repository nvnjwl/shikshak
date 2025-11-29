import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutDashboard,
    Users,
    IndianRupee,
    Ticket,
    BookOpen,
    LogOut,
    Menu,
    X,
    MessageSquare,
    Settings
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useProfile } from '../../contexts/ProfileContext';

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { signOut } = useAuth();

    const { profile } = useProfile();
    const userRole = profile?.role;

    const allMenuItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', roles: ['super_admin', 'teacher', 'sales', 'growth'] },
        { path: '/admin/students', icon: Users, label: 'Students', roles: ['super_admin', 'teacher', 'sales', 'growth'] },
        { path: '/admin/sales', icon: IndianRupee, label: 'Sales & Revenue', roles: ['super_admin', 'sales', 'growth'] },
        { path: '/admin/coupons', icon: Ticket, label: 'Coupons', roles: ['super_admin', 'sales'] },
        { path: '/admin/syllabus', icon: BookOpen, label: 'Syllabus', roles: ['super_admin', 'teacher'] },
        { path: '/admin/support', icon: MessageSquare, label: 'Support', roles: ['super_admin', 'teacher'] },
        { path: '/admin/settings', icon: Settings, label: 'Settings', roles: ['super_admin'] },
    ];

    const menuItems = allMenuItems.filter(item =>
        !item.roles || item.roles.includes(userRole) || userRole === 'super_admin'
    );

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-body">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <Link to="/admin" className="text-2xl font-heading font-bold text-primary">
                            Shikshak <span className="text-xs bg-primary text-white px-2 py-1 rounded ml-1">ADMIN</span>
                        </Link>
                        <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                                        ${isActive
                                            ? 'bg-primary/10 text-primary font-bold'
                                            : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                                        }
                                    `}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={handleLogout}
                        >
                            <LogOut size={20} className="mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <button onClick={() => setSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-lg">Admin Panel</span>
                    <div className="w-6" /> {/* Spacer */}
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
