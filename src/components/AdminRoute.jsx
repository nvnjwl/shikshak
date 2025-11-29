import { Navigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminRoute({ children }) {
    const { currentUser } = useAuth();
    const { isAdmin, loading } = useProfile();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!currentUser || !isAdmin()) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}
