import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FooterData } from '../types';

interface FooterProps {
    footerData?: FooterData;
}

export const Footer: React.FC<FooterProps> = ({ footerData }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Default Fallback
    const data: FooterData = footerData || {
        brandDescription: 'রাজশাহী কলিজিয়েট স্কুলের এসএসসি ২০২৬ ব্যাচ। ইতিহাস, ঐতিহ্য এবং ভ্রাতৃত্বের এক অবিচ্ছেদ্য বন্ধন। আমরা কেবল একটি ব্যাচ নই, আমরা একটি পরিবার।',
        facebookUrl: '#',
        instagramUrl: '#',
        contactAddress: 'রাজশাহী কলিজিয়েট স্কুল, রাজশাহী, বাংলাদেশ',
        contactEmail: 'contact@ontohin26.com',
        establishedYear: '১৮২৮',
        quoteText: 'শিক্ষা জাতির মেরুদণ্ড, আর ঐক্য আমাদের শক্তি।',
        copyrightText: '© ২০২৬ অন্তহীন ২৬। সর্বস্বত্ব সংরক্ষিত।'
    };

    const handleNavClick = (sectionId: string) => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.getElementById(sectionId);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    };

  return (
    <footer className="bg-surface-light dark:bg-black pt-16 pb-8 transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Column 1: Brand */}
            <div>
                <h2 className="text-3xl font-header font-bold text-primary mb-4">অন্তহীন ২৬</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 font-medium">
                    {data.brandDescription}
                </p>
                <div className="flex space-x-3">
                    {/* Social Icons */}
                    <a href={data.facebookUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                        <span className="material-icons text-xl">facebook</span>
                    </a>
                    <a href={data.instagramUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                    </a>
                     <a href={`mailto:${data.contactEmail}`} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                        <span className="material-icons text-xl">email</span>
                    </a>
                </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
                <h3 className="text-gray-900 dark:text-white font-bold uppercase tracking-wider text-sm mb-6 border-b-2 border-primary inline-block pb-1">দ্রুত লিংক</h3>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    <li><button onClick={() => handleNavClick('about')} className="hover:text-primary transition-colors flex items-center"><span className="material-icons text-xs mr-2 text-primary">chevron_right</span>আমাদের সম্পর্কে</button></li>
                    <li><button onClick={() => navigate('/history')} className="hover:text-primary transition-colors flex items-center"><span className="material-icons text-xs mr-2 text-primary">chevron_right</span>ইতিহাস</button></li>
                    <li><button onClick={() => handleNavClick('events')} className="hover:text-primary transition-colors flex items-center"><span className="material-icons text-xs mr-2 text-primary">chevron_right</span>ইভেন্ট</button></li>
                    <li><button onClick={() => navigate('/gallery')} className="hover:text-primary transition-colors flex items-center"><span className="material-icons text-xs mr-2 text-primary">chevron_right</span>গ্যালারি</button></li>
                </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div>
                <h3 className="text-gray-900 dark:text-white font-bold uppercase tracking-wider text-sm mb-6 border-b-2 border-primary inline-block pb-1">যোগাযোগ</h3>
                <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    <li className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3 text-primary">
                            <span className="material-icons text-sm">location_on</span>
                        </div>
                        <span className="mt-1 whitespace-pre-line">{data.contactAddress}</span>
                    </li>
                    <li className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-full mr-3 text-primary">
                             <span className="material-icons text-sm">email</span>
                        </div>
                        <span>{data.contactEmail}</span>
                    </li>
                     <li className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-full mr-3 text-primary">
                             <span className="material-icons text-sm">school</span>
                        </div>
                        <span>স্থাপিত: {data.establishedYear}</span>
                    </li>
                </ul>
            </div>

            {/* Column 4: Inspiration */}
            <div>
                <h3 className="text-gray-900 dark:text-white font-bold uppercase tracking-wider text-sm mb-6 border-b-2 border-primary inline-block pb-1">উদ্ধৃতি</h3>
                <blockquote className="text-gray-600 dark:text-gray-400 text-sm italic border-l-4 border-primary pl-4 py-2 bg-gray-50 dark:bg-surface-dark rounded-r">
                    "{data.quoteText}"
                </blockquote>
                <div className="mt-6">
                    <button onClick={() => navigate('/gallery')} className="w-full bg-gray-900 dark:bg-surface-dark border border-gray-700 hover:border-primary text-white font-bold text-xs uppercase py-3 rounded hover:bg-primary transition-all flex items-center justify-center">
                        স্মৃতিগুলো দেখুন <span className="material-icons text-sm ml-2">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
             <p className="text-gray-500 dark:text-gray-500 text-xs text-center md:text-left font-medium">
                {data.copyrightText}
             </p>
             <div className="flex space-x-6 text-xs text-gray-500 dark:text-gray-500 font-medium">
                <a href="#" className="hover:text-primary transition-colors">প্রাইভেসি পলিসি</a>
                <a href="#" className="hover:text-primary transition-colors">টার্মস অফ সার্ভিস</a>
                <span className="text-gray-700 dark:text-gray-300">|</span>
                <span className="text-gray-400">ডিজাইন: সিনেমার আদলে</span>
             </div>
        </div>
      </div>
    </footer>
  );
};