import React, { useState } from 'react';
import { auth } from '../../firebase';
import { updatePassword } from 'firebase/auth';

export const Settings: React.FC = () => {
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [email, setEmail] = useState(auth.currentUser?.email || 'contact@ontohin26.com');
    const [newPassword, setNewPassword] = useState('');
    const [updating, setUpdating] = useState(false);

    const handleUpdatePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            alert('পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।');
            return;
        }

        setUpdating(true);
        try {
            if (auth.currentUser) {
                await updatePassword(auth.currentUser, newPassword);
                alert('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
                setNewPassword('');
            }
        } catch (error: any) {
            console.error(error);
            if (error.code === 'auth/requires-recent-login') {
                alert('নিরাপত্তার স্বার্থে, পাসওয়ার্ড পরিবর্তনের জন্য আপনাকে পুনরায় লগইন করতে হবে। লগআউট করে আবার লগইন করুন।');
            } else {
                alert('পাসওয়ার্ড পরিবর্তনে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
            }
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-header font-bold text-gray-900 dark:text-white">সিস্টেম সেটিংস</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">মূল সিস্টেম প্যারামিটার কনফিগার করুন</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">অ্যাডমিন অ্যাকাউন্ট</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">অ্যাডমিন ইমেইল</label>
                                <input type="email" value={email} disabled className="w-full bg-gray-50 dark:bg-background-dark/50 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-500 dark:text-gray-500 cursor-not-allowed" />
                                <p className="text-[10px] text-gray-500 mt-1">* ইমেইল পরিবর্তন করতে ফায়ারবেস কনসোল ব্যবহার করুন।</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">নতুন পাসওয়ার্ড</label>
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder="কমপক্ষে ৬ অক্ষর"
                                        className="flex-1 bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                                    />
                                    <button
                                        onClick={handleUpdatePassword}
                                        disabled={updating}
                                        className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md shadow transition-colors font-medium text-sm whitespace-nowrap disabled:opacity-50"
                                    >
                                        {updating ? 'আপডেট হচ্ছে...' : 'পরিবর্তন করুন'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">পাবলিক কন্টাক্ট ইমেইল</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded shadow-lg transition-colors font-medium" onClick={() => alert('সেটিংস সেভ হয়েছে')}>কনফিগারেশন সেভ করুন</button>
            </div>
        </div>
    );
};