import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Scale, Shield } from 'lucide-react';

export default function TermsOfService() {
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
                    <Scale className="text-primary" size={40} />
                    <h1 className="text-4xl font-heading font-bold">Terms of Service</h1>
                </div>

                <p className="text-text-secondary mb-8">Last updated: November 28, 2025</p>

                <div className="prose prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-text-secondary">
                            By accessing and using Shikshak ("the Service"), you accept and agree to be bound by the terms
                            and provision of this agreement. If you do not agree to these Terms of Service, please do not
                            use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                        <p className="text-text-secondary mb-3">
                            Shikshak provides an AI-powered educational platform for students in Classes 4-8, offering:
                        </p>
                        <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                            <li>AI tutoring sessions powered by Google Gemini</li>
                            <li>Interactive learning materials and practice questions</li>
                            <li>Progress tracking and analytics</li>
                            <li>Parent dashboard for monitoring student progress</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
                        <p className="text-text-secondary mb-3">
                            To access certain features of the Service, you must register for an account. You agree to:
                        </p>
                        <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                            <li>Provide accurate, current, and complete information during registration</li>
                            <li>Maintain the security of your password and account</li>
                            <li>Notify us immediately of any unauthorized use of your account</li>
                            <li>Be responsible for all activities that occur under your account</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. Subscription and Payment</h2>
                        <p className="text-text-secondary mb-3">
                            <strong>Free Trial:</strong> New users receive a 7-day free trial with full access to premium features.
                        </p>
                        <p className="text-text-secondary mb-3">
                            <strong>Paid Subscription:</strong> After the trial period, continued access requires a paid subscription.
                            Subscription fees are charged monthly and are non-refundable except as required by law or as stated in our Refund Policy.
                        </p>
                        <p className="text-text-secondary mb-3">
                            <strong>Auto-Renewal:</strong> Subscriptions automatically renew unless cancelled before the renewal date.
                        </p>
                        <p className="text-text-secondary">
                            <strong>Payment Processing:</strong> Payments are processed securely through Razorpay. We do not store your
                            complete payment card information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. Cancellation and Refunds</h2>
                        <p className="text-text-secondary mb-3">
                            You may cancel your subscription at any time from your account dashboard. Cancellations take effect at the
                            end of the current billing period.
                        </p>
                        <p className="text-text-secondary">
                            Refunds are provided within 7 days of initial payment as per our money-back guarantee. See our Refund Policy
                            for complete details.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">6. Acceptable Use</h2>
                        <p className="text-text-secondary mb-3">You agree NOT to:</p>
                        <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                            <li>Use the Service for any illegal purpose or in violation of any laws</li>
                            <li>Share your account credentials with others</li>
                            <li>Attempt to gain unauthorized access to the Service or its systems</li>
                            <li>Interfere with or disrupt the Service or servers</li>
                            <li>Use automated systems to access the Service without permission</li>
                            <li>Copy, modify, or distribute content from the Service without authorization</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">7. Intellectual Property</h2>
                        <p className="text-text-secondary">
                            All content, features, and functionality of the Service, including but not limited to text, graphics, logos,
                            and software, are owned by Shikshak or its licensors and are protected by copyright, trademark, and other
                            intellectual property laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">8. Privacy</h2>
                        <p className="text-text-secondary">
                            Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand
                            our practices regarding the collection and use of your information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">9. Disclaimer of Warranties</h2>
                        <p className="text-text-secondary">
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                            WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
                        <p className="text-text-secondary">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, SHIKSHAK SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                            CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
                        <p className="text-text-secondary">
                            We reserve the right to modify these Terms of Service at any time. We will notify users of material changes
                            via email or through the Service. Your continued use of the Service after such modifications constitutes your
                            acceptance of the updated terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">12. Contact Information</h2>
                        <p className="text-text-secondary">
                            If you have any questions about these Terms of Service, please contact us at:
                        </p>
                        <div className="bg-primary/5 rounded-lg p-4 mt-3">
                            <p className="text-text-secondary">📧 Email: legal@shikshak.com</p>
                            <p className="text-text-secondary">📞 Phone: +91 123 456 7890</p>
                        </div>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="mt-12 pt-8 border-t flex gap-4">
                    <Button variant="outline" onClick={() => navigate('/legal/privacy-policy')}>
                        <Shield size={18} />
                        Privacy Policy
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/legal/refund-policy')}>
                        Refund Policy
                    </Button>
                </div>
            </div>
        </div>
    );
}
