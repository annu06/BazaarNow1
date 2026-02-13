
import React from 'react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-20 px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-10 shadow-sm border">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 font-sans">Privacy Policy</h1>

                <div className="space-y-6 text-gray-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-3">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support. This may include your name, email address, phone number, and delivery address.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-3">2. How We Use Information</h2>
                        <p>We use the information we collect to provide, maintain, and improve our services, including processing transactions and sending you related information such as confirmations and invoices.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-3">3. Sharing of Information</h2>
                        <p>We do not share your personal information with third parties except as necessary to provide our services (e.g., sharing your address with a delivery partner) or as required by law.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-3">4. Your Rights</h2>
                        <p>You have the right to access, correct, or delete your personal data. You can manage your information through your account settings or by contacting our support team.</p>
                    </section>

                    <section className="pt-8 border-t">
                        <p className="text-sm">Last updated: February 13, 2026</p>
                        <p className="text-sm mt-2 font-medium">Contact: anuragpolasa@gmail.com</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
