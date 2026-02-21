import React, { useState } from 'react';
import { RegistrationSubmission } from '../../types';
import { db } from '../../firebase';
import { doc, deleteDoc } from 'firebase/firestore';

interface EventInboxProps {
    registrations: RegistrationSubmission[];
}

export const EventInbox: React.FC<EventInboxProps> = ({ registrations }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRegistrations = registrations.filter(reg =>
        reg.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই রেজিস্ট্রেশন তথ্যটি মুছে ফেলতে চান?')) {
            try {
                await deleteDoc(doc(db, 'registrations', id));
                // The parent component will need to re-fetch or update its state
                // to reflect the deletion, as setRegistrations is no longer available here.
            } catch (error) {
                console.error("Error deleting registration: ", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-header font-bold text-gray-900 dark:text-white">ইভেন্ট ইনবক্স</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">অংশগ্রহণকারীদের রেজিস্ট্রেশন তালিকা এবং তথ্য</p>
                </div>
                <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-icons text-gray-400 text-sm">search</span>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder="নাম বা ইভেন্ট খুঁজুন..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark shadow-sm border border-border-light dark:border-border-dark rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                        <thead className="bg-gray-50 dark:bg-[#222]">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">অংশগ্রহণকারী</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ইভেন্ট</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">যোগাযোগ</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">একাডেমিক তথ্য</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">সময়</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {filteredRegistrations.map((reg) => (
                                <tr key={reg.id} className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs mr-3">
                                                {reg.firstName.charAt(0)}{reg.lastName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{reg.firstName} {reg.lastName}</div>
                                                <a href={`https://instagram.com/${reg.instagram}`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center">
                                                    @{reg.instagram}
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 dark:text-white font-medium">{reg.eventName}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">ID: {reg.eventId}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-gray-300">{reg.email}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{reg.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 mr-2">
                                            ব্যাচ {reg.sscBatch}
                                        </span>
                                        {reg.section && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                সেকশন: {reg.section}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(reg.submittedAt).toLocaleDateString()} <br />
                                        {new Date(reg.submittedAt).toLocaleTimeString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={(e) => handleDelete(reg.id, e)}
                                            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                            title="মুছে ফেলুন"
                                        >
                                            <span className="material-icons text-base">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredRegistrations.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                        <span className="material-icons text-4xl mb-2 opacity-30">inbox</span>
                                        <p>কোনো রেজিস্ট্রেশন তথ্য পাওয়া যায়নি।</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};