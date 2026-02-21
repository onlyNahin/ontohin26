import React from 'react';
import { FooterData } from '../../types';
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface FooterManagerProps {
    footerData: FooterData;
}

export const FooterManager: React.FC<FooterManagerProps> = ({ footerData }) => {
    const handleChange = async (field: keyof FooterData, value: string) => {
        try {
            const footerRef = doc(db, 'metadata', 'footer');
            await updateDoc(footerRef, { [field]: value });
        } catch (error) {
            console.error("Error updating footer data: ", error);
        }
    };

    const handleSave = () => {
        alert('ফুটার সেটিংস সংরক্ষিত হয়েছে!');
    };

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-header font-bold text-gray-900 dark:text-white">ফুটার ম্যানেজমেন্ট</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">সাইটের নিচের অংশের তথ্য এবং লিংক কাস্টমাইজ করুন</p>
            </div>

            {/* Brand Section */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="material-icons mr-2 text-primary">branding_watermark</span>
                    ব্র্যান্ড ইনফো
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ব্র্যান্ড বিবরণ (ছোট প্যারাগ্রাফ)</label>
                        <textarea
                            rows={3}
                            value={footerData.brandDescription}
                            onChange={(e) => handleChange('brandDescription', e.target.value)}
                            className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">কপিরাইট টেক্সট</label>
                        <input
                            type="text"
                            value={footerData.copyrightText}
                            onChange={(e) => handleChange('copyrightText', e.target.value)}
                            className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Social & Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
                        <span className="material-icons mr-2 text-blue-500">share</span>
                        সোশ্যাল লিংক
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Facebook URL</label>
                            <input
                                type="text"
                                value={footerData.facebookUrl}
                                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                                className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram URL</label>
                            <input
                                type="text"
                                value={footerData.instagramUrl}
                                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                                className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
                        <span className="material-icons mr-2 text-green-500">contact_mail</span>
                        যোগাযোগ তথ্য
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ঠিকানা</label>
                            <input
                                type="text"
                                value={footerData.contactAddress}
                                onChange={(e) => handleChange('contactAddress', e.target.value)}
                                className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">যোগাযোগ ইমেইল</label>
                            <input
                                type="text"
                                value={footerData.contactEmail}
                                onChange={(e) => handleChange('contactEmail', e.target.value)}
                                className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">স্থাপিত সাল</label>
                            <input
                                type="text"
                                value={footerData.establishedYear}
                                onChange={(e) => handleChange('establishedYear', e.target.value)}
                                className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Quote */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="material-icons mr-2 text-purple-500">format_quote</span>
                    ফুটার কোট
                </h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">কোট টেক্সট</label>
                    <input
                        type="text"
                        value={footerData.quoteText}
                        onChange={(e) => handleChange('quoteText', e.target.value)}
                        className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button onClick={handleSave} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded shadow-lg transition-colors font-medium flex items-center">
                    <span className="material-icons mr-2 text-sm">save</span>
                    পরিবর্তন সেভ করুন
                </button>
            </div>
        </div>
    );
};