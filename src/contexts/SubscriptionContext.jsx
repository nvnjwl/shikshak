import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import logger from '../utils/logger';

const SubscriptionContext = createContext();

export function useSubscription() {
    return useContext(SubscriptionContext);
}

// Subscription plans with pricing
export const SUBSCRIPTION_PLANS = {
    'Class 5': { monthly: 1700, trial: 1, original: 2500, discount: 32 },
    'Class 6': { monthly: 1950, trial: 1, original: 3000, discount: 35 },
    'Class 7': { monthly: 2205, trial: 1, original: 3500, discount: 37 },
    'Class 8': { monthly: 2400, trial: 1, original: 4000, discount: 40 },
};

// Trial configuration
export const TRIAL_CONFIG = {
    price: 1, // ₹1
    durationDays: 7,
};

// Coupon configuration
export const COUPONS = {
    'FREE_100': {
        discount: 100, // 100% off
        validUntil: '2025-02-28', // 3 months from now
        applicableOn: ['trial', 'subscription'],
    }
};

// Feature limits for free tier
export const FREE_TIER_LIMITS = {
    aiQuestionsPerDay: 5,
    practiceQuestionsPerDay: 5,
    maxSubjects: 1,
};

export function SubscriptionProvider({ children }) {
    const { currentUser } = useAuth();
    const [subscription, setSubscription] = useState(null);
    const [coupons, setCoupons] = useState({ usedCoupons: [], FREE_100_used: false });
    const [usage, setUsage] = useState({
        aiQuestionsToday: 0,
        practiceQuestionsToday: 0,
        lastResetDate: new Date().toISOString().split('T')[0],
    });
    const [loading, setLoading] = useState(true);

    // Load subscription data
    useEffect(() => {
        if (!currentUser) {
            setSubscription(null);
            setLoading(false);
            return;
        }

        loadSubscriptionData();
    }, [currentUser]);

    const loadSubscriptionData = async () => {
        try {
            logger.info('SubscriptionContext', 'Loading subscription data', { uid: currentUser.uid });

            // Try to load from Firestore
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();
                setSubscription(userData.subscription || null);
                setCoupons(userData.coupons || { usedCoupons: [], FREE_100_used: false });
                setUsage(userData.usage || usage);
                logger.success('SubscriptionContext', 'Loaded from Firestore', userData.subscription);
            } else {
                // Check localStorage as fallback
                const localProfile = localStorage.getItem('shikshak_user_profile');
                if (localProfile) {
                    const profile = JSON.parse(localProfile);
                    if (profile.subscription) {
                        setSubscription(profile.subscription);
                        setUsage(profile.usage || usage);
                    }
                }
            }
        } catch (error) {
            logger.error('SubscriptionContext', 'Error loading subscription', error);
        } finally {
            setLoading(false);
        }
    };

    // Check if user is on trial
    const isOnTrial = () => {
        if (!subscription) return false;
        if (subscription.status !== 'trial') return false;

        const trialEnd = new Date(subscription.trialEndDate);
        const now = new Date();
        return now < trialEnd;
    };

    // Check if trial has expired
    const hasTrialExpired = () => {
        if (!subscription || !subscription.trialEndDate) return false;
        const trialEnd = new Date(subscription.trialEndDate);
        const now = new Date();
        return now >= trialEnd && subscription.status === 'trial';
    };

    // Check if user can start trial (hasn't used it before)
    const canStartTrial = () => {
        if (!subscription) return true;
        return !subscription.trialUsed;
    };

    // Check if user has active subscription
    const hasActiveSubscription = () => {
        if (!subscription) return false;
        return subscription.status === 'active' || isOnTrial();
    };

    // Check if in grace period
    const isInGracePeriod = () => {
        if (!subscription || !subscription.gracePeriodEndDate) return false;
        const graceEnd = new Date(subscription.gracePeriodEndDate);
        const now = new Date();
        return now < graceEnd && subscription.status === 'expired';
    };

    // Get days until downgrade (during grace period)
    const getDaysUntilDowngrade = () => {
        if (!isInGracePeriod()) return 0;
        const graceEnd = new Date(subscription.gracePeriodEndDate);
        const now = new Date();
        const diffTime = graceEnd - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    };

    // Get days remaining in trial
    const getTrialDaysRemaining = () => {
        if (!subscription || subscription.status !== 'free_trial') return 0;

        const trialEnd = new Date(subscription.trialEndDate);
        const now = new Date();
        const diffTime = trialEnd - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    };

    // Check if user can access a feature
    const canAccessFeature = (featureName) => {
        // If has active subscription, allow all features
        if (hasActiveSubscription()) return true;

        // Free tier restrictions
        const freeFeatures = ['basic_chat', 'limited_practice', 'one_subject'];
        return freeFeatures.includes(featureName);
    };

    // Check usage limits
    const canUseFeature = (featureName) => {
        if (hasActiveSubscription()) return true;

        // Reset usage if new day
        const today = new Date().toISOString().split('T')[0];
        if (usage.lastResetDate !== today) {
            resetDailyUsage();
            return true;
        }

        // Check limits
        if (featureName === 'ai_question') {
            return usage.aiQuestionsToday < FREE_TIER_LIMITS.aiQuestionsPerDay;
        }
        if (featureName === 'practice_question') {
            return usage.practiceQuestionsToday < FREE_TIER_LIMITS.practiceQuestionsPerDay;
        }

        return false;
    };

    // Increment usage counter
    const incrementUsage = async (featureName) => {
        const today = new Date().toISOString().split('T')[0];

        let newUsage = { ...usage };

        // Reset if new day
        if (usage.lastResetDate !== today) {
            newUsage = {
                aiQuestionsToday: 0,
                practiceQuestionsToday: 0,
                lastResetDate: today,
            };
        }

        // Increment counter
        if (featureName === 'ai_question') {
            newUsage.aiQuestionsToday += 1;
        } else if (featureName === 'practice_question') {
            newUsage.practiceQuestionsToday += 1;
        }

        setUsage(newUsage);

        // Save to Firestore
        if (currentUser) {
            try {
                await updateDoc(doc(db, 'users', currentUser.uid), { usage: newUsage });
            } catch (error) {
                logger.error('SubscriptionContext', 'Error updating usage', error);
            }
        }
    };

    // Reset daily usage
    const resetDailyUsage = () => {
        const today = new Date().toISOString().split('T')[0];
        const newUsage = {
            aiQuestionsToday: 0,
            practiceQuestionsToday: 0,
            lastResetDate: today,
        };
        setUsage(newUsage);
    };

    // Get remaining usage for a feature
    const getRemainingUsage = (featureName) => {
        if (hasActiveSubscription()) return Infinity;

        const today = new Date().toISOString().split('T')[0];
        if (usage.lastResetDate !== today) {
            return featureName === 'ai_question'
                ? FREE_TIER_LIMITS.aiQuestionsPerDay
                : FREE_TIER_LIMITS.practiceQuestionsPerDay;
        }

        if (featureName === 'ai_question') {
            return Math.max(0, FREE_TIER_LIMITS.aiQuestionsPerDay - usage.aiQuestionsToday);
        }
        if (featureName === 'practice_question') {
            return Math.max(0, FREE_TIER_LIMITS.practiceQuestionsPerDay - usage.practiceQuestionsToday);
        }

        return 0;
    };

    // Start free trial
    const startFreeTrial = async (plan) => {
        const now = new Date();
        const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

        const newSubscription = {
            status: 'free_trial',
            plan: plan,
            trialStartDate: now.toISOString(),
            trialEndDate: trialEnd.toISOString(),
            autoRenew: false,
        };

        setSubscription(newSubscription);

        // Save to Firestore
        if (currentUser) {
            try {
                await updateDoc(doc(db, 'users', currentUser.uid), {
                    subscription: newSubscription,
                });
                logger.success('SubscriptionContext', 'Started free trial', { plan });
            } catch (error) {
                logger.error('SubscriptionContext', 'Error starting trial', error);
            }
        }

        // Save to localStorage
        const localProfile = JSON.parse(localStorage.getItem('shikshak_user_profile') || '{}');
        localProfile.subscription = newSubscription;
        localStorage.setItem('shikshak_user_profile', JSON.stringify(localProfile));

        return newSubscription;
    };

    // Update subscription after payment
    const activateSubscription = async (plan, paymentDetails) => {
        const now = new Date();
        const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

        const newSubscription = {
            status: 'active',
            plan: plan,
            subscriptionStartDate: now.toISOString(),
            subscriptionEndDate: endDate.toISOString(),
            razorpaySubscriptionId: paymentDetails.subscriptionId,
            razorpayPaymentId: paymentDetails.paymentId,
            autoRenew: true,
        };

        setSubscription(newSubscription);

        // Save to Firestore
        if (currentUser) {
            try {
                await updateDoc(doc(db, 'users', currentUser.uid), {
                    subscription: newSubscription,
                });
                logger.success('SubscriptionContext', 'Activated subscription', { plan });
            } catch (error) {
                logger.error('SubscriptionContext', 'Error activating subscription', error);
            }
        }

        return newSubscription;
    };

    // Check if user has used a specific coupon
    const hasUsedCoupon = (couponCode) => {
        return coupons.usedCoupons.includes(couponCode) || coupons[`${couponCode}_used`];
    };

    // Mark coupon as used
    const markCouponUsed = async (couponCode) => {
        try {
            const newCoupons = {
                ...coupons,
                usedCoupons: [...coupons.usedCoupons, couponCode],
                [`${couponCode}_used`]: true,
                [`${couponCode}_usedAt`]: new Date().toISOString()
            };

            setCoupons(newCoupons);

            if (currentUser) {
                await updateDoc(doc(db, 'users', currentUser.uid), {
                    coupons: newCoupons
                });
                logger.success('SubscriptionContext', 'Coupon marked as used', { couponCode });
            }
        } catch (error) {
            logger.error('SubscriptionContext', 'Error marking coupon as used', error);
            throw error;
        }
    };

    // Start ₹1 trial
    const startTrial = async (plan, paymentDetails = null, couponCode = null) => {
        const now = new Date();
        const trialEnd = new Date(now.getTime() + TRIAL_CONFIG.durationDays * 24 * 60 * 60 * 1000);

        const newSubscription = {
            status: 'trial',
            plan: plan,
            trialUsed: true,
            trialStartDate: now.toISOString(),
            trialEndDate: trialEnd.toISOString(),
            razorpayPaymentId: paymentDetails?.paymentId || null,
            lastPaymentAmount: paymentDetails?.amount || 0,
            lastPaymentDate: now.toISOString(),
            autoRenew: false,
        };

        setSubscription(newSubscription);

        // Save to Firestore
        if (currentUser) {
            try {
                await updateDoc(doc(db, 'users', currentUser.uid), {
                    subscription: newSubscription,
                });
                logger.success('SubscriptionContext', 'Started trial', { plan });
            } catch (error) {
                logger.error('SubscriptionContext', 'Error starting trial', error);
            }
        }

        // Mark coupon as used if applicable
        if (couponCode) {
            await markCouponUsed(couponCode);
        }

        return newSubscription;
    };

    // Activate trial (for ₹0 with coupon)
    const activateTrial = async (plan, couponCode) => {
        return await startTrial(plan, null, couponCode);
    };

    const value = {
        subscription,
        coupons,
        usage,
        loading,
        // Trial functions
        isOnTrial,
        hasTrialExpired,
        canStartTrial,
        getTrialDaysRemaining,
        startTrial,
        activateTrial,
        // Subscription functions
        hasActiveSubscription,
        activateSubscription,
        // Grace period functions
        isInGracePeriod,
        getDaysUntilDowngrade,
        // Feature access
        canAccessFeature,
        canUseFeature,
        incrementUsage,
        getRemainingUsage,
        // Coupon functions
        hasUsedCoupon,
        markCouponUsed,
        // Legacy (keep for backward compatibility)
        isOnFreeTrial: isOnTrial,
        startFreeTrial: startTrial,
        // Constants
        SUBSCRIPTION_PLANS,
        TRIAL_CONFIG,
        COUPONS,
        FREE_TIER_LIMITS,
    };

    return (
        <SubscriptionContext.Provider value={value}>
            {!loading && children}
        </SubscriptionContext.Provider>
    );
}
