import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Announcement, FooterData } from '../types';

interface AnnouncementsProps {
  darkMode: boolean;
  toggleTheme: () => void;
  announcements: Announcement[];
  footerData?: FooterData;
}

export const Announcements: React.FC<AnnouncementsProps> = ({ darkMode, toggleTheme, announcements, footerData }) => {
  const safeAnnouncements = announcements || [];
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300 flex flex-col">
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
            <span className="text-primary font-bold tracking-widest uppercase text-sm">আপডেট ও নোটিশ</span>
            <h1 className="text-4xl md:text-5xl font-header font-bold text-gray-900 dark:text-white mt-4 mb-6">
            ঘোষণা ও সংবাদ
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            আমাদের ব্যাচের সর্বশেষ আপডেট, নোটিশ এবং সংবাদ এখানে পাওয়া যাবে। নিয়মিত চোখ রাখুন।
            </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {safeAnnouncements.map((announcement) => (
                <div key={announcement.id} className="bg-white dark:bg-surface-dark rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 flex flex-col">
                    {announcement.imageUrl && (
                        <div className="h-48 overflow-hidden">
                            <img 
                                src={announcement.imageUrl} 
                                alt={announcement.title} 
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                announcement.priority === 'High' 
                                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                                    : announcement.priority === 'Low'
                                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                                {announcement.priority === 'High' ? 'জরুরি' : announcement.priority === 'Low' ? 'সাধারণ' : 'গুরুত্বপূর্ণ'}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                                <span className="material-icons text-sm mr-1">calendar_today</span>
                                {new Date(announcement.date).toLocaleDateString('bn-BD')}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                            {announcement.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 flex-1">
                            {announcement.content}
                        </p>
                    </div>
                </div>
            ))}
        </div>

        {safeAnnouncements.length === 0 && (
            <div className="text-center py-20">
                <span className="material-icons text-6xl text-gray-300 dark:text-gray-600 mb-4">notifications_off</span>
                <p className="text-xl text-gray-500 dark:text-gray-400">বর্তমানে কোনো ঘোষণা নেই।</p>
            </div>
        )}
      </main>

      <Footer footerData={footerData} />
    </div>
  );
};
