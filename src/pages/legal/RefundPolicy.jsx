import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';

export default function RefundPolicy() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                        Back
                    </Button>
                    <h1 className="text-xl font-heading font-bold text-primary">Shikshak</h1>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex items-center gap-3 mb-6">
                    <RefreshCw className="text-primary" size={40} />
                    <h1 className="text-4xl font-heading font-bold">Refund Policy</h1>
                </div>

                <p className="text-text-secondary mb-8">Last updated: November 28, 2025</p>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
                        <div>
                            <p className="font-semibold text-green-900 mb-2">7-Day Money-Back Guarantee</p>
                            <p className="text-sm text-green-800">
                                We're confident you'll love Shikshak! If you're not satisfied, get a full refund within 7 days
                                of your initial payment—no questions asked.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. 7-Day Money-Back Guarantee</h2>
                        <p className="text-text-secondary mb-3">
                            We offer a 7-day money-back guarantee for all new subscriptions:
                        </p>
                        <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                            <li>Applies to your first payment only (not renewals)</li>
                            <li>Request a refund within 7 days of payment</li>
                            <li>Full refund, no questions asked</li>
                            <li>Refund processed within 5-7 business days</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. How to Request a Refund</h2>
                        <p className="text-text-secondary mb-3">
                            To request a refund within the 7-day guarantee period:
                        </p>
                        <ol className="list-decimal list-inside text-text-secondary space-y-3 ml-4">
                            <li>
                                <strong>Email us</strong> at refunds@shikshak.com with:
                                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                    <li>Your registered email address</li>
                                    <li>Payment transaction ID</li>
                                    <li>Reason for refund (optional but appreciated)</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Or contact support</strong> via phone at +91 123 456 7890
                            </li>
                            <li>
                                We'll process your refund within 24-48 hours
                            </li>
                            <li>
                                Refund will be credited to your original payment method within 5-7 business days
                            </li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. Subscription Renewals</h2>
                        <p className="text-text-secondary mb-3">
                            <strong>Important:</strong> The 7-day money-back guarantee applies only to initial subscriptions,
                            not to renewal payments.
                        </p>
                        <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                            <li>Renewals are charged automatically unless you cancel before the renewal date</li>
                            <li>Renewal payments are generally non-refundable</li>
                            <li>Cancel anytime before renewal to avoid charges</li>
                            <li>You can cancel from your account dashboard</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. Exceptional Circumstances</h2>
                        <p className="text-text-secondary mb-3">
                            We may consider refunds outside the 7-day window in exceptional circumstances:
                        </p>
                        <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                            <li>Technical issues preventing service access</li>
                            <li>Duplicate charges or billing errors</li>
                            <li>Service outages lasting more than 48 hours</li>
                        </ul>
                        <p className="text-text-secondary mt-3">
                            Contact our support team to discuss your specific situation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. Free Trial</h2>
                        <p className="text-text-secondary">
                            New users receive a 7-day free trial with full access to premium features. No payment is required
                            during the trial period. You can cancel anytime during the trial without being charged.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">6. Cancellation Policy</h2>
                        <p className="text-text-secondary mb-3">
                            You can cancel your subscription at any time:
                        </p>
                        <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                            <li>Go to Account Settings → Subscription Management</li>
                            <li>Click "Cancel Subscription"</li>
                            <li>Cancellation takes effect at the end of the current billing period</li>
                            <li>You'll retain access until the end of the paid period</li>
                            <li>No refund for the remaining days of the current billing cycle (except within 7-day guarantee)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">7. Refund Processing Time</h2>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p className="text-sm text-blue-900 mb-2">
                                <strong>Timeline:</strong>
                            </p>
                            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1 ml-4">
                                <li>Refund approval: Within 24-48 hours of request</li>
                                <li>Processing by payment gateway (Razorpay): 3-5 business days</li>
                                <li>Credit to your account: 5-7 business days total</li>
                            </ul>
                            <p className="text-sm text-blue-900 mt-3">
                                Note: The exact timing may vary depending on your bank or payment method.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">8. Non-Refundable Items</h2>
                        <p className="text-text-secondary mb-3">
                            The following are not eligible for refunds:
                        </p>
                        <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                            <li>Subscription renewals (after 7 days from renewal date)</li>
                            <li>Partial month subscriptions (pro-rated refunds not available)</li>
                            <li>Accounts suspended or terminated for Terms of Service violations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
                        <p className="text-text-secondary mb-3">
                            For refund requests or questions about this policy:
                        </p>
                        <div className="bg-primary/5 rounded-lg p-4">
                            <p className="text-text-secondary">📧 Email: refunds@shikshak.com</p>
                            <p className="text-text-secondary">📞 Phone: +91 123 456 7890</p>
                            <p className="text-text-secondary">⏰ Support Hours: Mon-Sat, 9 AM - 6 PM IST</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">10. Changes to Refund Policy</h2>
                        <p className="text-text-secondary">
                            We reserve the right to modify this Refund Policy at any time. Changes will be posted on this page
                            with an updated "Last updated" date. Continued use of the service after changes constitutes acceptance
                            of the updated policy.
                        </p>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="mt-12 pt-8 border-t flex gap-4">
                    <Button variant="outline" onClick={() => navigate('/legal/terms-of-service')}>
                        Terms of Service
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/legal/privacy-policy')}>
                        <Shield size={18} />
                        Privacy Policy
                    </Button>
                </div>
            </div>
        </div>
    );
}
