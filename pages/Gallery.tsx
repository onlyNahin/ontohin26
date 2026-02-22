import React, { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { RedirectLink, GalleryItem, FooterData } from '../types';

interface GalleryProps {
    darkMode: boolean;
    toggleTheme: () => void;
    redirectLinks: RedirectLink[];
    galleryItems: GalleryItem[];
    footerData?: FooterData;
}

export const Gallery: React.FC<GalleryProps> = ({ darkMode, toggleTheme, redirectLinks, galleryItems, footerData }) => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
            <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

            {/* Header */}
            <div className="pt-32 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center animate-fade-in">
                <span className="text-primary font-bold tracking-widest uppercase text-sm">আমাদের স্মৃতি</span>
                <h1 className="text-4xl md:text-6xl font-header font-bold text-gray-900 dark:text-white mt-4 mb-6 uppercase">
                    অন্তহীন আর্কাইভ
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    প্রতিটি হাসি, প্রতিটি পারফরম্যান্স, প্রতিটি ঐক্যের মুহূর্ত। এটি এসএসসি ২০২৬ ব্যাচের ভিজ্যুয়াল উত্তরাধিকার।
                </p>
            </div>

            {/* Redirect Buttons (Admin Managed) */}
            {redirectLinks.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    <div className="flex flex-wrap justify-center gap-4">
                        {redirectLinks.map((link) => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary rounded-md text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-all bg-white dark:bg-surface-dark shadow-sm hover:shadow-md"
                            >
                                <span className="material-icons text-lg mr-2">link</span>
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters (Mock) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="flex flex-wrap justify-center gap-4">
                    {['সব', 'ইভেন্ট', 'ক্লাসরুম', 'পুনর্মিলনী', 'খেলাধুলা'].map((filter, idx) => (
                        <button
                            key={filter}
                            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all
                    ${idx === 0
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'bg-surface-light dark:bg-surface-dark text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Masonry-style Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="columns-1 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {(galleryItems || []).map((item, index) => (
                        <div key={`${item.id}-${index}`} className="break-inside-avoid group relative rounded-lg overflow-hidden cursor-pointer bg-gray-200 dark:bg-surface-dark mb-4">
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                                loading="lazy"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <span className="text-primary text-xs font-bold uppercase tracking-wider mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{item.category}</span>
                                <h3 className="text-white font-display font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                                <p className="text-gray-300 text-xs mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                                    {item.date ? new Date(item.date).toLocaleDateString('bn-BD') : ''}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                {(galleryItems || []).length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 dark:text-gray-400">এখনও কোনো ছবি নেই।</p>
                    </div>
                )}
            </div>

            <Footer footerData={footerData} />
        </div>
    );
};