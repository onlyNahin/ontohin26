import React, { useState } from 'react';
import { Event, EventRegistration } from '../types';

interface EventRegistrationModalProps {
    event: Event;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EventRegistration) => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({ event, isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<EventRegistration>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        instagram: '',
        sscBatch: '২০২৬',
        section: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Backdrop */}
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
                    aria-hidden="true" 
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                {/* Modal Panel */}
                <div className="relative inline-block align-bottom bg-surface-light dark:bg-surface-dark rounded-lg text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-gray-200 dark:border-gray-700">
                    <div className="bg-primary px-4 py-4 sm:px-6">
                        <h3 className="text-lg leading-6 font-bold text-white uppercase tracking-wider" id="modal-title">
                            ইভেন্ট রেজিস্ট্রেশন
                        </h3>
                        <p className="text-white/80 text-sm mt-1">{event.title}</p>
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                        >
                            <span className="material-icons">close</span>
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="px-4 pt-5 pb-4 sm:p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">নামের প্রথম অংশ</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    id="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">নামের শেষ অংশ</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    id="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ইমেইল</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ফোন নম্বর</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="sscBatch" className="block text-sm font-medium text-gray-700 dark:text-gray-300">এসএসসি ব্যাচ</label>
                                <input
                                    type="text"
                                    name="sscBatch"
                                    id="sscBatch"
                                    required
                                    value={formData.sscBatch}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ইনস্টাগ্রাম ইউজারনেম</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">@</span>
                                    </div>
                                    <input
                                        type="text"
                                        name="instagram"
                                        id="instagram"
                                        required
                                        value={formData.instagram}
                                        onChange={handleChange}
                                        className="block w-full pl-7 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        placeholder="username"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="section" className="block text-sm font-medium text-gray-700 dark:text-gray-300">সেকশন <span className="text-gray-400 text-xs">(অপশনাল)</span></label>
                                <input
                                    type="text"
                                    name="section"
                                    id="section"
                                    value={formData.section}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="Ex: A"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-white dark:bg-surface-dark text-gray-700 dark:text-gray-300 px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                            >
                                বাতিল
                            </button>
                            <button
                                type="submit"
                                className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded shadow-lg transition-colors text-sm font-medium uppercase tracking-wider"
                            >
                                সাবমিট করুন
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};