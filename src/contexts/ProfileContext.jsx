import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import logger from '../utils/logger';

const ProfileContext = createContext();

export function useProfile() {
    return useContext(ProfileContext);
}

// Subject mapping based on class
const SUBJECTS_BY_CLASS = {
    '5th': ['Math', 'EVS', 'English', 'Hindi'],
    '6th': ['Math', 'Science', 'Social Science', 'English', 'Hindi'],
    '7th': ['Math', 'Science', 'Social Science', 'English', 'Hindi'],
    '8th': ['Math', 'Science', 'Social Science', 'English', 'Hindi']
};

export function ProfileProvider({ children }) {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadProfile = useCallback(async () => {
        try {
            logger.info('ProfileContext', 'Loading user profile', { uid: currentUser.uid });

            // Timeout wrapper
            const getDocPromise = getDoc(doc(db, 'users', currentUser.uid));
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Firestore timeout')), 15000)
            );

            const userDoc = await Promise.race([getDocPromise, timeoutPromise]);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                setProfile(userData.profile || null);
                logger.success('ProfileContext', 'Profile loaded', userData.profile);
            } else {
                // Create default profile for new users
                const defaultProfile = {
                    name: currentUser.displayName || '',
                    email: currentUser.email,
                    photoURL: currentUser.photoURL || null,
                    class: null,
                    subjects: [],
                    onboardingCompleted: false,
                    onboardingSkipped: false,
                    isAdmin: false,
                    createdAt: new Date().toISOString()
                };

                // Save to Firestore immediately to ensure document exists
                // We don't await this to avoid blocking if write is slow
                setDoc(doc(db, 'users', currentUser.uid), {
                    profile: defaultProfile
                }).catch(err => logger.error('ProfileContext', 'Error saving default profile', err));

                setProfile(defaultProfile);
                logger.info('ProfileContext', 'Created and saved default profile for new user');
            }
        } catch (error) {
            logger.error('ProfileContext', 'Error loading profile', error);
            const fallbackProfile = {
                name: currentUser.displayName || 'User',
                email: currentUser.email,
                onboardingCompleted: false
            };
            setProfile(fallbackProfile);
        } finally {
            setLoading(false);
        }
    }, [currentUser]); // Add currentUser as dependency

    // Load profile from Firestore
    useEffect(() => {
        if (!currentUser) {
            setProfile(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        loadProfile();
    }, [currentUser, loadProfile]);

    // Update profile
    const updateProfile = async (updates) => {
        try {
            logger.info('ProfileContext', 'Updating profile', updates);

            const updatedProfile = {
                ...profile,
                ...updates
            };

            await setDoc(doc(db, 'users', currentUser.uid), {
                profile: updatedProfile
            }, { merge: true });

            setProfile(updatedProfile);
            logger.success('ProfileContext', 'Profile updated successfully');

            return updatedProfile;
        } catch (error) {
            logger.error('ProfileContext', 'Error updating profile', error);
            throw error;
        }
    };

    // Complete onboarding
    const completeOnboarding = async () => {
        try {
            logger.info('ProfileContext', 'Completing onboarding');

            const updatedProfile = {
                ...profile,
                onboardingCompleted: true
            };

            await updateDoc(doc(db, 'users', currentUser.uid), {
                'profile.onboardingCompleted': true
            });

            setProfile(updatedProfile);
            logger.success('ProfileContext', 'Onboarding completed');

            return updatedProfile;
        } catch (error) {
            logger.error('ProfileContext', 'Error completing onboarding', error);
            throw error;
        }
    };

    // Skip onboarding
    const skipOnboarding = async () => {
        try {
            logger.info('ProfileContext', 'Skipping onboarding');

            const updatedProfile = {
                ...profile,
                onboardingSkipped: true,
                onboardingCompleted: true // Mark as completed even if skipped
            };

            await updateDoc(doc(db, 'users', currentUser.uid), {
                'profile.onboardingSkipped': true,
                'profile.onboardingCompleted': true
            });

            setProfile(updatedProfile);
            logger.success('ProfileContext', 'Onboarding skipped');

            return updatedProfile;
        } catch (error) {
            logger.error('ProfileContext', 'Error skipping onboarding', error);
            throw error;
        }
    };

    // Get available subjects for a class
    const getSubjectsForClass = (className) => {
        return SUBJECTS_BY_CLASS[className] || [];
    };

    // Check if onboarding is needed
    const needsOnboarding = () => {
        return profile && !profile.onboardingCompleted;
    };
    // Check if user is admin
    const isAdmin = () => {
        return profile && profile.isAdmin === true;
    };

    const promoteToAdmin = async () => {
        if (!currentUser) return;
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, { 'profile.isAdmin': true });
            setProfile(prev => ({ ...prev, isAdmin: true }));
            return true;
        } catch (error) {
            console.error('Error promoting to admin:', error);
            return false;
        }
    };

    const value = {
        profile,
        loading,
        updateProfile,
        completeOnboarding,
        skipOnboarding,
        getSubjectsForClass,
        needsOnboarding,
        isAdmin,
        promoteToAdmin,
        SUBJECTS_BY_CLASS
    };

    return (
        <ProfileContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-text-secondary">Loading profile...</p>
                    </div>
                </div>
            ) : children}
        </ProfileContext.Provider>
    );
}
