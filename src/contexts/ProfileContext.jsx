import { createContext, useContext, useState, useEffect } from 'react';
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

    // Load profile from Firestore
    useEffect(() => {
        if (!currentUser) {
            setProfile(null);
            setLoading(false);
            return;
        }

        loadProfile();
    }, [currentUser]);

    const loadProfile = async () => {
        try {
            logger.info('ProfileContext', 'Loading user profile', { uid: currentUser.uid });

            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

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
                    createdAt: new Date().toISOString()
                };
                setProfile(defaultProfile);
                logger.info('ProfileContext', 'Created default profile for new user');
            }
        } catch (error) {
            logger.error('ProfileContext', 'Error loading profile', error);
        } finally {
            setLoading(false);
        }
    };

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

    const value = {
        profile,
        loading,
        updateProfile,
        completeOnboarding,
        skipOnboarding,
        getSubjectsForClass,
        needsOnboarding,
        SUBJECTS_BY_CLASS
    };

    return (
        <ProfileContext.Provider value={value}>
            {!loading && children}
        </ProfileContext.Provider>
    );
}
