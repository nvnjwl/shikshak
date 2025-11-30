import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import logger from './logger';

/**
 * User Activity Service
 * Tracks user learning activities including last viewed topics, streaks, and progress
 */

/**
 * Get user's last viewed topic
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Last viewed topic data or null
 */
export async function getLastViewedTopic(userId) {
    try {
        const activityRef = doc(db, 'users', userId, 'activity', 'recent');
        const activitySnap = await getDoc(activityRef);

        if (activitySnap.exists()) {
            const data = activitySnap.data();
            return data.lastViewedTopic || null;
        }

        return null;
    } catch (error) {
        logger.error('UserActivity', 'Error getting last viewed topic', error);
        return null;
    }
}

/**
 * Update last viewed topic
 * @param {string} userId - User ID
 * @param {Object} topicData - Topic data (subjectId, chapterId, topicId, topicName, subjectName)
 */
export async function updateLastViewedTopic(userId, topicData) {
    try {
        const activityRef = doc(db, 'users', userId, 'activity', 'recent');

        await setDoc(activityRef, {
            lastViewedTopic: {
                ...topicData,
                viewedAt: serverTimestamp()
            },
            updatedAt: serverTimestamp()
        }, { merge: true });

        logger.success('UserActivity', 'Updated last viewed topic', topicData);
    } catch (error) {
        logger.error('UserActivity', 'Error updating last viewed topic', error);
    }
}

/**
 * Get user's learning streak
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Streak data { currentStreak: number, lastActivityDate: string }
 */
export async function getUserStreak(userId) {
    try {
        const streakRef = doc(db, 'users', userId, 'activity', 'streak');
        const streakSnap = await getDoc(streakRef);

        if (streakSnap.exists()) {
            const data = streakSnap.data();
            return {
                currentStreak: data.currentStreak || 0,
                lastActivityDate: data.lastActivityDate || null,
                longestStreak: data.longestStreak || 0
            };
        }

        return { currentStreak: 0, lastActivityDate: null, longestStreak: 0 };
    } catch (error) {
        logger.error('UserActivity', 'Error getting user streak', error);
        return { currentStreak: 0, lastActivityDate: null, longestStreak: 0 };
    }
}

/**
 * Update user's learning streak
 * @param {string} userId - User ID
 */
export async function updateUserStreak(userId) {
    try {
        const streakRef = doc(db, 'users', userId, 'activity', 'streak');
        const streakSnap = await getDoc(streakRef);

        const today = new Date().toISOString().split('T')[0];

        if (streakSnap.exists()) {
            const data = streakSnap.data();
            const lastDate = data.lastActivityDate;

            // Check if already updated today
            if (lastDate === today) {
                return; // Already counted for today
            }

            // Check if streak continues (yesterday)
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            let newStreak = 1;
            if (lastDate === yesterdayStr) {
                // Streak continues
                newStreak = (data.currentStreak || 0) + 1;
            }

            const longestStreak = Math.max(newStreak, data.longestStreak || 0);

            await updateDoc(streakRef, {
                currentStreak: newStreak,
                longestStreak,
                lastActivityDate: today,
                updatedAt: serverTimestamp()
            });

            logger.success('UserActivity', 'Updated streak', { newStreak, longestStreak });
        } else {
            // First time tracking streak
            await setDoc(streakRef, {
                currentStreak: 1,
                longestStreak: 1,
                lastActivityDate: today,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            logger.success('UserActivity', 'Started streak tracking');
        }
    } catch (error) {
        logger.error('UserActivity', 'Error updating streak', error);
    }
}

/**
 * Record user activity (updates both last viewed topic and streak)
 * @param {string} userId - User ID
 * @param {Object} topicData - Topic data
 */
export async function recordActivity(userId, topicData) {
    await Promise.all([
        updateLastViewedTopic(userId, topicData),
        updateUserStreak(userId)
    ]);
}
