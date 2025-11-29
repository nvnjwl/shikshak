import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import {
    onAuthStateChanged,
    signOut as firebaseSignOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import logger from '../utils/logger';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        logger.info('AuthContext', 'Initializing auth state');

        // Check localStorage for persisted session
        const persistedUser = localStorage.getItem('shikshak_user');
        if (persistedUser) {
            try {
                const userData = JSON.parse(persistedUser);
                setCurrentUser(userData);
                logger.success('AuthContext', 'Restored session from localStorage', { email: userData.email });
            } catch (error) {
                logger.error('AuthContext', 'Failed to parse persisted user', error);
                localStorage.removeItem('shikshak_user');
            }
        }

        // Listen to Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userData = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                };
                setCurrentUser(userData);
                // Persist to localStorage
                localStorage.setItem('shikshak_user', JSON.stringify(userData));
                logger.success('AuthContext', 'User logged in', { email: user.email });
            } else {
                setCurrentUser(null);
                localStorage.removeItem('shikshak_user');
                logger.info('AuthContext', 'User logged out');
            }
            setLoading(false);
        });

        // If no Firebase user but have localStorage, still set loading to false
        if (!currentUser) {
            setTimeout(() => setLoading(false), 500);
        }

        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        try {
            logger.info('AuthContext', 'Attempting login', { email });
            const result = await signInWithEmailAndPassword(auth, email, password);
            logger.success('AuthContext', 'Login successful', { email });
            return result;
        } catch (error) {
            logger.error('AuthContext', 'Login failed', error);
            throw error;
        }
    };

    const signup = async (email, password) => {
        try {
            logger.info('AuthContext', 'Attempting signup', { email });
            const result = await createUserWithEmailAndPassword(auth, email, password);
            logger.success('AuthContext', 'Signup successful', { email });
            return result;
        } catch (error) {
            logger.error('AuthContext', 'Signup failed', error);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        try {
            logger.info('AuthContext', 'Attempting Google login');
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            const result = await signInWithPopup(auth, provider);
            logger.success('AuthContext', 'Google login successful', { email: result.user.email });
            return result;
        } catch (error) {
            logger.error('AuthContext', 'Google login failed', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setCurrentUser(null);
            localStorage.removeItem('shikshak_user');
            localStorage.removeItem('shikshak_user_profile');
            logger.success('AuthContext', 'User signed out successfully');
        } catch (error) {
            logger.error('AuthContext', 'Sign out error', error);
            throw error;
        }
    };

    const value = {
        currentUser,
        login,
        signup,
        loginWithGoogle,
        signOut,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
