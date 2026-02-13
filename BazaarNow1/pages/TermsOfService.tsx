
import React from 'react';

const TermsOfService: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-20 px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-10 shadow-sm border">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 font-sans">Terms of Service</h1>

                <div className="space-y-6 text-gray-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-3">1. Acceptance of Terms</h2>
                        <p>By accessing and using BazaarNow, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-3">2. Description of Service</h2>
                        <p>BazaarNow is a marketplace connecting local grocery stores with customers. We facilitate the ordering and delivery of goods but are not the sellers of the products listed by third-party vendor stores.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-3">3. User Accounts</h2>
                        <p>You may be required to create an account to use certain features. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-3">4. Pricing and Payments</h2>
                        <p>Prices are set by the individual stores. We reserve the right to change our delivery fees at any time. Payments are processed securely through our integrated payment gateways.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-3">5. Limitation of Liability</h2>
                        <p>BazaarNow shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.</p>
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

export default TermsOfService;
