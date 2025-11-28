import logger from '../utils/logger';

// Load Razorpay script
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
            logger.success('Razorpay', 'Script loaded successfully');
            resolve(true);
        };
        script.onerror = () => {
            logger.error('Razorpay', 'Failed to load script');
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

// Create Razorpay order
export const createOrder = async (amount, plan, userDetails) => {
    try {
        logger.info('Razorpay', 'Creating order', { amount, plan });

        // In production, this should call your backend API
        // For now, we'll create a mock order
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        return {
            success: true,
            orderId,
            amount,
            currency: 'INR',
        };
    } catch (error) {
        logger.error('Razorpay', 'Error creating order', error);
        return { success: false, error: error.message };
    }
};

// Display Razorpay payment modal
export const displayRazorpay = async (orderDetails, userDetails, onSuccess, onFailure) => {
    const res = await loadRazorpayScript();

    if (!res) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        return;
    }

    const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy_key', // Use test key for development
        amount: orderDetails.amount * 100, // Amount in paise
        currency: orderDetails.currency,
        name: 'Shikshak',
        description: `Subscription - ${orderDetails.plan}`,
        image: '/vite.svg', // Your logo
        order_id: orderDetails.orderId,
        handler: async function (response) {
            logger.success('Razorpay', 'Payment successful', response);

            // Verify payment signature (should be done on backend)
            const paymentData = {
                orderId: orderDetails.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                amount: orderDetails.amount,
                plan: orderDetails.plan,
            };

            // Call success callback
            if (onSuccess) {
                onSuccess(paymentData);
            }
        },
        prefill: {
            name: userDetails.name,
            email: userDetails.email,
            contact: userDetails.phone || '',
        },
        notes: {
            plan: orderDetails.plan,
            userId: userDetails.userId,
        },
        theme: {
            color: '#6366F1', // Primary color
        },
        modal: {
            ondismiss: function () {
                logger.info('Razorpay', 'Payment modal closed');
                if (onFailure) {
                    onFailure({ error: 'Payment cancelled by user' });
                }
            },
        },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
};

// Verify payment (should be done on backend)
export const verifyPayment = async (paymentData) => {
    try {
        logger.info('Razorpay', 'Verifying payment', paymentData);

        // In production, call your backend to verify signature
        // Backend should use Razorpay secret to verify:
        // const crypto = require('crypto');
        // const hmac = crypto.createHmac('sha256', razorpay_secret);
        // hmac.update(order_id + "|" + payment_id);
        // const generated_signature = hmac.digest('hex');
        // return generated_signature === razorpay_signature;

        // For now, mock verification
        return {
            success: true,
            verified: true,
            paymentData,
        };
    } catch (error) {
        logger.error('Razorpay', 'Error verifying payment', error);
        return { success: false, error: error.message };
    }
};

// Save payment to Firestore
export const savePaymentRecord = async (db, paymentData, userId) => {
    try {
        const { collection, addDoc } = await import('firebase/firestore');

        const paymentRecord = {
            userId,
            orderId: paymentData.orderId,
            paymentId: paymentData.paymentId,
            amount: paymentData.amount,
            currency: 'INR',
            plan: paymentData.plan,
            status: 'success',
            createdAt: new Date(),
            razorpaySignature: paymentData.signature,
        };

        const docRef = await addDoc(collection(db, 'payments'), paymentRecord);
        logger.success('Razorpay', 'Payment record saved', { id: docRef.id });

        return { success: true, id: docRef.id };
    } catch (error) {
        logger.error('Razorpay', 'Error saving payment record', error);
        return { success: false, error: error.message };
    }
};
