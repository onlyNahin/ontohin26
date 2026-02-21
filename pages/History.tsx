import React, { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { HistoryPageData, FooterData } from '../types';

interface HistoryProps {
  darkMode: boolean;
  toggleTheme: () => void;
  historyData?: HistoryPageData;
  footerData?: FooterData;
}

export const History: React.FC<HistoryProps> = ({ darkMode, toggleTheme, historyData, footerData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Default data for initial render or fallback
  const data = historyData || {
      headerSubtitle: 'স্থাপিত ১৮২৮',
      headerTitle: 'কলিজিয়েটের উপাখ্যান',
      mainDescription: 'রাজশাহী কলিজিয়েট স্কুল কেবল একটি শিক্ষা প্রতিষ্ঠান নয়; এটি ইতিহাসের সাক্ষী। ব্রিটিশ রাজের সময় ১৮২৮ সালে "বাউলিয়া ইংলিশ স্কুল" হিসেবে প্রতিষ্ঠিত, এটি বাংলায় প্রথম আধুনিক শিক্ষা প্রতিষ্ঠান এবং ভারতীয় উপমহাদেশের অন্যতম প্রাচীন প্রতিষ্ঠান হিসেবে দাঁড়িয়ে আছে।',
      imageUrl: 'https://images.unsplash.com/photo-1577030838186-b41314787a71?q=80&w=1000&auto=format&fit=crop',
      contentBlocks: [],
      quote: '"শিক্ষা হলো মানুষের মধ্যে বিদ্যমান পূর্ণতার প্রকাশ।"'
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      
      {/* Header Section */}
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center animate-fade-in">
         <span className="text-primary font-bold tracking-widest uppercase text-sm">{data.headerSubtitle}</span>
         <h1 className="text-4xl md:text-6xl font-header font-bold text-gray-900 dark:text-white mt-4 mb-6 uppercase">
            {data.headerTitle}
         </h1>
         <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed font-light">
            {data.mainDescription}
        </p>
        
        <div className="relative mb-16 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-red-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img 
                src={data.imageUrl} 
                alt="Historical Building" 
                className="relative w-full rounded-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
            />
        </div>

        <div className="space-y-12 text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
            {data.contentBlocks.map(block => (
                <div key={block.id}>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-header uppercase tracking-wide">{block.title}</h3>
                    <p>{block.description}</p>
                </div>
            ))}

            <div className="mt-12 p-8 bg-surface-light dark:bg-surface-dark border-l-4 border-primary rounded-r-lg shadow-lg">
                <p className="italic text-gray-500 dark:text-gray-300 font-serif text-xl">
                    {data.quote}
                </p>
            </div>
        </div>
      </div>

      <Footer footerData={footerData} />
    </div>
  );
};