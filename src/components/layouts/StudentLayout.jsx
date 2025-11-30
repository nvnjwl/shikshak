import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { Settings, LogOut, GraduationCap, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import ClassSwitcher from '../dashboard/ClassSwitcher';

export default function StudentLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const { profile } = useProfile();
    const [showClassSwitcher, setShowClassSwitcher] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-body flex flex-col">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 shadow-sm">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/app')}>
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                            S
                        </div>
                        <span className="font-heading font-bold text-xl text-primary hidden md:block">Shikshak</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Home Button for non-dashboard pages */}
                        {location.pathname !== '/app' && (
                            <button
                                onClick={() => navigate('/app')}
                                className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                                title="Go to Dashboard"
                            >
                                <Home size={22} />
                            </button>
                        )}

                        <button
                            onClick={() => setShowClassSwitcher(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-full text-sm font-bold transition-all border-2 border-blue-100 hover:border-primary shadow-sm"
                        >
                            <GraduationCap size={18} className="text-primary" />
                            <span>Class {profile?.class || '...'}</span>
                        </button>

                        <div className="h-6 w-px bg-gray-200 mx-1"></div>

                        <button onClick={() => navigate('/settings')} className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                            <Settings size={22} />
                        </button>
                        <button onClick={handleLogout} className="p-2.5 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
                            <LogOut size={22} />
                        </button>
                    </div>
                </div>
            </nav>

            {showClassSwitcher && <ClassSwitcher onClose={() => setShowClassSwitcher(false)} />}

            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Shikshak. Made with ❤️ for students.
                    </p>
                </div>
            </footer>
        </div>
    );
}
