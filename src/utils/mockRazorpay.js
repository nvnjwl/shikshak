import logger from './logger';

/**
 * Mock Razorpay Payment System
 * Simulates payment flow for development/testing without real Razorpay integration
 */

/**
 * Simulates a payment dialog and returns mock payment data
 * @param {number} amount - Amount in rupees
 * @param {Object} userInfo - User information
 * @param {string} userInfo.name - User name
 * @param {string} userInfo.email - User email
 * @param {string} userInfo.userId - User ID
 * @returns {Promise<Object>} Mock payment response
 */
export async function simulatePayment(amount, userInfo) {
    logger.info('MockRazorpay', 'Simulating payment', { amount, userInfo });

    // Return a promise that resolves after user confirms
    return new Promise((resolve, reject) => {
        // Create mock payment dialog
        const dialog = createPaymentDialog(amount, userInfo, resolve, reject);
        document.body.appendChild(dialog);
    });
}

/**
 * Creates a mock payment dialog UI
 */
function createPaymentDialog(amount, userInfo, onSuccess, onFailure) {
    const overlay = document.createElement('div');
    overlay.id = 'mock-razorpay-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(4px);
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 32px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease-out;
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    dialog.innerHTML = `
        <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 32px;">
                💳
            </div>
            <h2 style="margin: 0; font-size: 24px; font-weight: bold; color: #1a202c;">Mock Payment Gateway</h2>
            <p style="margin: 8px 0 0; color: #718096; font-size: 14px;">Development Mode - Simulated Payment</p>
        </div>

        <div style="background: #f7fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #718096;">Amount to Pay</span>
                <span style="font-size: 28px; font-weight: bold; color: #2d3748;">₹${amount}</span>
            </div>
            <div style="border-top: 1px dashed #e2e8f0; padding-top: 12px; margin-top: 12px;">
                <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
                    <span style="color: #718096;">Name</span>
                    <span style="color: #2d3748; font-weight: 500;">${userInfo.name}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 14px;">
                    <span style="color: #718096;">Email</span>
                    <span style="color: #2d3748; font-weight: 500;">${userInfo.email}</span>
                </div>
            </div>
        </div>

        <div style="background: #edf2f7; border-left: 4px solid #4299e1; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 14px; color: #2d3748;">
                <strong>ℹ️ Development Mode:</strong> This is a simulated payment. No actual transaction will occur.
            </p>
        </div>

        <div style="display: flex; gap: 12px;">
            <button id="mock-pay-success" style="flex: 1; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; padding: 14px; font-size: 16px; font-weight: bold; cursor: pointer; transition: transform 0.2s;">
                ✓ Simulate Success
            </button>
            <button id="mock-pay-failure" style="flex: 1; background: #f56565; color: white; border: none; border-radius: 8px; padding: 14px; font-size: 16px; font-weight: bold; cursor: pointer; transition: transform 0.2s;">
                ✗ Simulate Failure
            </button>
        </div>

        <p style="text-align: center; margin-top: 16px; font-size: 12px; color: #a0aec0;">
            Click "Simulate Success" to complete the payment
        </p>
    `;

    overlay.appendChild(dialog);

    // Add hover effects
    const successBtn = dialog.querySelector('#mock-pay-success');
    const failureBtn = dialog.querySelector('#mock-pay-failure');

    successBtn.addEventListener('mouseenter', () => {
        successBtn.style.transform = 'scale(1.02)';
    });
    successBtn.addEventListener('mouseleave', () => {
        successBtn.style.transform = 'scale(1)';
    });

    failureBtn.addEventListener('mouseenter', () => {
        failureBtn.style.transform = 'scale(1.02)';
    });
    failureBtn.addEventListener('mouseleave', () => {
        failureBtn.style.transform = 'scale(1)';
    });

    // Handle success
    successBtn.addEventListener('click', () => {
        const mockPaymentData = {
            paymentId: `pay_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            orderId: `order_mock_${Date.now()}`,
            signature: `sig_mock_${Math.random().toString(36).substr(2, 9)}`,
            amount: amount,
            status: 'success',
            method: 'mock',
            timestamp: new Date().toISOString()
        };

        logger.success('MockRazorpay', 'Payment simulated successfully', mockPaymentData);
        document.body.removeChild(overlay);
        onSuccess(mockPaymentData);
    });

    // Handle failure
    failureBtn.addEventListener('click', () => {
        logger.error('MockRazorpay', 'Payment simulation failed');
        document.body.removeChild(overlay);
        onFailure({ error: 'Payment cancelled by user (simulated)' });
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            logger.info('MockRazorpay', 'Payment dialog closed');
            document.body.removeChild(overlay);
            onFailure({ error: 'Payment cancelled' });
        }
    });

    return overlay;
}

/**
 * Save payment record to Firestore
 */
export async function savePaymentRecord(db, paymentData, userId) {
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');

    try {
        const paymentRecord = {
            userId: userId,
            paymentId: paymentData.paymentId,
            orderId: paymentData.orderId,
            amount: paymentData.amount,
            status: paymentData.status || 'success',
            method: paymentData.method || 'mock',
            createdAt: serverTimestamp(),
            metadata: {
                plan: paymentData.plan || null,
                isTrial: paymentData.isTrial || false,
                couponCode: paymentData.couponCode || null
            }
        };

        await addDoc(collection(db, 'payments'), paymentRecord);
        logger.success('MockRazorpay', 'Payment record saved', paymentRecord);
        return paymentRecord;
    } catch (error) {
        logger.error('MockRazorpay', 'Error saving payment record', error);
        throw error;
    }
}
