
import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Hide footer on specific portal pages if needed, but for now we keep it everywhere or conditionally render
    // Typically dashboards might not need the large footer
    const isDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/vendor') || location.pathname.startsWith('/delivery');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            <Header onMenuOpen={() => setMobileMenuOpen(true)} />

            <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

            <main className="flex-grow">
                {children}
            </main>

            {!isDashboard && <Footer />}
        </div>
    );
};

export default MainLayout;
