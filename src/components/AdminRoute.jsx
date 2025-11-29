import { Navigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/Button';

export default function AdminRoute({ children, requiredRole }) {
    const { currentUser } = useAuth();
    const { isAdmin, loading, profile } = useProfile();

    if (loading || (currentUser && !profile)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!currentUser || !isAdmin()) {
        return <Navigate to="/admin/login" replace />;
    }

    // Role-based access check
    if (requiredRole) {
        const userRole = profile?.role;
        // Super admin has access to everything
        if (userRole === 'super_admin') return children;

        // Check if user has the required role
        if (userRole !== requiredRole) {
            // Redirect to their allowed dashboard or show access denied
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
                        <p className="text-gray-600 mb-4">You do not have permission to view this page.</p>
                        <Button onClick={() => window.history.back()}>Go Back</Button>
                    </div>
                </div>
            );
        }
    }

    return children;
}
