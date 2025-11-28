import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Shield, Lock } from 'lucide-react';

export default function PrivacyPolicy() {
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
                    <Shield className="text-primary" size={40} />
                    <h1 className="text-4xl font-heading font-bold">Privacy Policy</h1>
                </div>

                <p className="text-text-secondary mb-8">Last updated: November 28, 2025</p>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                    <p className="text-sm text-blue-900">
                        <strong>Your Privacy Matters:</strong> We are committed to protecting your personal information and your child's data.
                        This policy explains how we collect, use, and safeguard your information.
                    </p>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>

                        <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
                        <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                            <li>Name and email address</li>
                            <li>Student's class and board (CBSE/ICSE/State Board)</li>
                            <li>Learning goals and preferences</li>
                            <li>Parent contact information (for parent dashboard access)</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-4">Usage Information</h3>
                        <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                            <li>Learning activity and progress data</li>
                            <li>AI tutoring session interactions</li>
                            <li>Practice question responses and scores</li>
                            <li>Time spent on various topics and subjects</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-4">Payment Information</h3>
                        <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                            <li>Payment card information (processed securely by Razorpay)</li>
                            <li>Billing address</li>
                            <li>Transaction history</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                        <p className="text-text-secondary mb-3">We use the collected information to:</p>
                        <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                            <li>Provide personalized AI tutoring and learning experiences</li>
                            <li>Track and display student progress to parents</li>
                            <li>Process subscription payments and manage billing</li>
                            <li>Send important updates about the service</li>
                            <li>Improve our AI algorithms and educational content</li>
                            <li>Provide customer support</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <Lock className="text-green-600 flex-shrink-0 mt-1" size={24} />
                                <div>
                                    <p className="font-semibold text-green-900 mb-2">We take security seriously</p>
                                    <p className="text-sm text-green-800">
                                        All data is encrypted in transit and at rest. We use industry-standard security measures
                                        to protect your information from unauthorized access, disclosure, or destruction.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className="text-text-secondary">
                            Payment information is processed through Razorpay's secure payment gateway. We never store complete
                            payment card details on our servers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. Third-Party Services</h2>
                        <p className="text-text-secondary mb-3">We use the following third-party services:</p>
                        <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                            <li><strong>Google Gemini AI:</strong> Powers our AI tutoring features</li>
                            <li><strong>Firebase:</strong> Authentication and database services</li>
                            <li><strong>Razorpay:</strong> Payment processing</li>
                            <li><strong>Google Analytics:</strong> Usage analytics (anonymized)</li>
                        </ul>
                        <p className="text-text-secondary mt-3">
                            These services have their own privacy policies governing the use of your information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. Children's Privacy</h2>
                        <p className="text-text-secondary mb-3">
                            Our service is designed for students aged 9-14 (Classes 4-8). We comply with applicable children's
                            privacy laws and regulations.
                        </p>
                        <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                            <li>We require parental consent for students under 13</li>
                            <li>We collect only the minimum information necessary for educational purposes</li>
                            <li>Parents can review, update, or delete their child's information at any time</li>
                            <li>We do not sell or share children's personal information with third parties for marketing</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
                        <p className="text-text-secondary">
                            We retain your information for as long as your account is active or as needed to provide services.
                            If you cancel your subscription, we will retain your data for 90 days before permanent deletion,
                            allowing you to reactivate if desired. You can request immediate deletion by contacting support.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">7. Your Rights</h2>
                        <p className="text-text-secondary mb-3">You have the right to:</p>
                        <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                            <li>Access your personal information</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Export your data in a portable format</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Withdraw consent for data processing</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">8. Cookies and Tracking</h2>
                        <p className="text-text-secondary">
                            We use cookies and similar technologies to enhance user experience, analyze usage patterns, and
                            maintain session information. You can control cookie preferences through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">9. Changes to Privacy Policy</h2>
                        <p className="text-text-secondary">
                            We may update this Privacy Policy from time to time. We will notify you of significant changes via
                            email or through the Service. Your continued use after such changes constitutes acceptance of the
                            updated policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
                        <p className="text-text-secondary mb-3">
                            For privacy-related questions or to exercise your rights, contact us at:
                        </p>
                        <div className="bg-primary/5 rounded-lg p-4">
                            <p className="text-text-secondary">📧 Email: privacy@shikshak.com</p>
                            <p className="text-text-secondary">📞 Phone: +91 123 456 7890</p>
                            <p className="text-text-secondary">📍 Address: [Your Company Address]</p>
                        </div>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="mt-12 pt-8 border-t flex gap-4">
                    <Button variant="outline" onClick={() => navigate('/legal/terms-of-service')}>
                        Terms of Service
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/legal/refund-policy')}>
                        Refund Policy
                    </Button>
                </div>
            </div>
        </div>
    );
}
