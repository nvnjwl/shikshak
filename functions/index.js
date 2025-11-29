const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const cors = require('cors')({ origin: true });

admin.initializeApp();
const db = admin.firestore();

// Initialize Razorpay
// Note: In production, use functions.config().razorpay.key_id etc.
// For now, we'll assume env vars are set or hardcoded for dev (but we won't hardcode secrets here)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_KEY_ID',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET'
});

/**
 * Validate Coupon Callable Function
 * Checks if a coupon is valid for a user.
 */
exports.validateCoupon = functions.https.onCall(async (data, context) => {
    // 1. Auth Check
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    }

    const { couponCode } = data;
    const uid = context.auth.uid;

    if (!couponCode) {
        throw new functions.https.HttpsError('invalid-argument', 'Coupon code is required.');
    }

    try {
        // 2. Fetch Coupon
        const couponRef = db.collection('coupons').doc(couponCode.toUpperCase());
        const couponDoc = await couponRef.get();

        if (!couponDoc.exists) {
            return { valid: false, message: 'Invalid coupon code.' };
        }

        const coupon = couponDoc.data();

        // 3. Check Active Status
        if (!coupon.active) {
            return { valid: false, message: 'This coupon is no longer active.' };
        }

        // 4. Check Expiry
        const now = admin.firestore.Timestamp.now();
        if (coupon.validUntil && coupon.validUntil < now) {
            return { valid: false, message: 'This coupon has expired.' };
        }

        // 5. Check Usage Limits (Global)
        if (coupon.maxUsageCount && coupon.currentUsageCount >= coupon.maxUsageCount) {
            return { valid: false, message: 'This coupon has reached its usage limit.' };
        }

        // 6. Check User Usage
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();
        const userData = userDoc.data();

        if (userData.coupons && userData.coupons.usedCoupons && userData.coupons.usedCoupons.includes(couponCode.toUpperCase())) {
            if (coupon.oneTimePerUser) {
                return { valid: false, message: 'You have already used this coupon.' };
            }
        }

        // 7. Return Success
        return {
            valid: true,
            discount: coupon.discount,
            type: coupon.type || 'flat', // 'flat' or 'percentage'
            code: coupon.code,
            message: 'Coupon applied successfully!'
        };

    } catch (error) {
        console.error('Error validating coupon:', error);
        throw new functions.https.HttpsError('internal', 'Unable to validate coupon.');
    }
});

/**
 * Razorpay Webhook Handler
 * Verifies payment signature and updates subscription status.
 */
exports.razorpayWebhook = functions.https.onRequest(async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'YOUR_WEBHOOK_SECRET';
    const signature = req.headers['x-razorpay-signature'];

    if (!Razorpay.validateWebhookSignature(JSON.stringify(req.body), signature, secret)) {
        console.error('Invalid webhook signature');
        return res.status(400).send('Invalid signature');
    }

    const event = req.body.event;
    const payload = req.body.payload;

    try {
        if (event === 'payment.captured') {
            const payment = payload.payment.entity;
            const notes = payment.notes; // We should pass userId in notes during checkout

            if (notes && notes.userId) {
                const userId = notes.userId;
                const amount = payment.amount / 100; // Convert paise to rupees

                // Determine plan type based on amount or notes
                // For simplicity, we assume logic based on amount or passed planId
                const isTrial = amount <= 10; // Simple check for trial

                const userRef = db.collection('users').doc(userId);

                const updates = {
                    'subscription.status': isTrial ? 'trial' : 'active',
                    'subscription.updatedAt': admin.firestore.Timestamp.now()
                };

                if (isTrial) {
                    updates['subscription.trialUsed'] = true;
                    // Set trial end date (7 days)
                    const endDate = new Date();
                    endDate.setDate(endDate.getDate() + 7);
                    updates['subscription.trialEndDate'] = admin.firestore.Timestamp.fromDate(endDate);
                } else {
                    // Set subscription end date (30 days)
                    const endDate = new Date();
                    endDate.setDate(endDate.getDate() + 30);
                    updates['subscription.subscriptionEndDate'] = admin.firestore.Timestamp.fromDate(endDate);
                }

                await userRef.update(updates);

                // Log payment
                await db.collection('payments').add({
                    userId: userId,
                    paymentId: payment.id,
                    amount: amount,
                    status: 'success',
                    method: payment.method,
                    createdAt: admin.firestore.Timestamp.now()
                });

                console.log(`Payment processed for user ${userId}`);
            }
        }

        res.json({ status: 'ok' });
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * Check Subscription Expiry (Scheduled Daily)
 * Downgrades expired subscriptions to free tier.
 */
exports.checkSubscriptionExpiry = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();

    try {
        // Find active subscriptions that have expired
        const expiredQuery = await db.collection('users')
            .where('subscription.status', 'in', ['active', 'trial'])
            .where('subscription.subscriptionEndDate', '<', now) // This might need separate check for trialEndDate
            .get();

        const batch = db.batch();
        let count = 0;

        expiredQuery.docs.forEach(doc => {
            const userData = doc.data();
            const sub = userData.subscription;

            // Check specific end dates
            let isExpired = false;
            if (sub.status === 'active' && sub.subscriptionEndDate && sub.subscriptionEndDate.toDate() < new Date()) {
                isExpired = true;
            } else if (sub.status === 'trial' && sub.trialEndDate && sub.trialEndDate.toDate() < new Date()) {
                isExpired = true;
            }

            if (isExpired) {
                const userRef = db.collection('users').doc(doc.id);
                batch.update(userRef, {
                    'subscription.status': 'expired', // or 'free'
                    'subscription.plan': 'free',
                    'subscription.updatedAt': now
                });
                count++;
            }
        });

        if (count > 0) {
            await batch.commit();
            console.log(`Downgraded ${count} expired subscriptions.`);
        }

        return null;
    } catch (error) {
        console.error('Error checking expiry:', error);
        return null;
    }
});
