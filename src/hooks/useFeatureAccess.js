import { useSubscription } from '../contexts/SubscriptionContext';

/**
 * Custom hook to check feature access and usage limits
 * @returns {Object} Feature access utilities
 */
export default function useFeatureAccess() {
    const {
        hasActiveSubscription,
        canUseFeature,
        incrementUsage,
        getRemainingUsage,
        isOnFreeTrial,
        getTrialDaysRemaining,
    } = useSubscription();

    /**
     * Check if user can access a specific feature
     * @param {string} featureName - Name of the feature to check
     * @returns {boolean} Whether user can access the feature
     */
    const canAccess = (featureName) => {
        // Premium features that require subscription
        const premiumFeatures = [
            'unlimited_ai',
            'all_subjects',
            'unlimited_practice',
            'progress_analytics',
            'parent_dashboard',
            'study_recordings',
            'weekly_reports',
        ];

        if (premiumFeatures.includes(featureName)) {
            return hasActiveSubscription();
        }

        // Free features available to all
        return true;
    };

    /**
     * Check if user can use a feature right now (considering usage limits)
     * @param {string} featureName - Feature to check
     * @returns {boolean} Whether user can use the feature now
     */
    const canUseNow = (featureName) => {
        if (hasActiveSubscription()) return true;
        return canUseFeature(featureName);
    };

    /**
     * Record usage of a feature
     * @param {string} featureName - Feature being used
     */
    const recordUsage = async (featureName) => {
        if (hasActiveSubscription()) return; // No limits for paid users
        await incrementUsage(featureName);
    };

    /**
     * Get remaining usage for a feature
     * @param {string} featureName - Feature to check
     * @returns {number} Remaining usage count (Infinity for paid users)
     */
    const getRemaining = (featureName) => {
        return getRemainingUsage(featureName);
    };

    /**
     * Get user's subscription tier
     * @returns {string} 'free', 'trial', or 'premium'
     */
    const getTier = () => {
        if (hasActiveSubscription()) {
            return isOnFreeTrial() ? 'trial' : 'premium';
        }
        return 'free';
    };

    /**
     * Check if user should see upgrade prompts
     * @returns {boolean} Whether to show upgrade prompts
     */
    const shouldShowUpgrade = () => {
        return !hasActiveSubscription();
    };

    /**
     * Get trial information
     * @returns {Object} Trial status and days remaining
     */
    const getTrialInfo = () => {
        return {
            isOnTrial: isOnFreeTrial(),
            daysRemaining: getTrialDaysRemaining(),
        };
    };

    return {
        canAccess,
        canUseNow,
        recordUsage,
        getRemaining,
        getTier,
        shouldShowUpgrade,
        getTrialInfo,
        hasActiveSubscription: hasActiveSubscription(),
    };
}
