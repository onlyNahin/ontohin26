import React, { useState } from 'react';

export const Settings: React.FC = () => {
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [email, setEmail] = useState('contact@ontohin26.com');

    return (
         <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-header font-bold text-gray-900 dark:text-white">সিস্টেম সেটিংস</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">মূল সিস্টেম প্যারামিটার কনফিগার করুন</p>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">মেইনটেনেন্স মোড</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">সাময়িকভাবে পাবলিক অ্যাক্সেস বন্ধ রাখুন।</p>
                    </div>
                    <button 
                        onClick={() => setMaintenanceMode(!maintenanceMode)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${maintenanceMode ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>

                <div className="border-t border-border-light dark:border-border-dark pt-6">
                     <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">যোগাযোগের তথ্য</h3>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">অ্যাডমিন ইমেইল</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full md:w-1/2 bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm" />
                     </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded shadow-lg transition-colors font-medium" onClick={() => alert('সেটিংস সেভ হয়েছে')}>কনফিগারেশন সেভ করুন</button>
            </div>
        </div>
    );
};