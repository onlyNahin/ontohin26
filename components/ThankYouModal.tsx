import React from 'react';

interface ThankYouModalProps {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
    eventName: string;
}

export const ThankYouModal: React.FC<ThankYouModalProps> = ({ isOpen, onClose, userName, eventName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
             <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Backdrop */}
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
                    aria-hidden="true" 
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                {/* Modal Panel */}
                <div className="relative inline-block align-bottom bg-surface-light dark:bg-surface-dark rounded-lg text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm w-full border border-gray-200 dark:border-gray-700 p-6 animate-fade-in">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4 animate-bounce">
                            <span className="material-icons text-4xl text-green-600 dark:text-green-400">check_circle</span>
                        </div>
                        <h3 className="text-2xl leading-6 font-header font-bold text-gray-900 dark:text-white mb-2" id="modal-title">
                            ধন্যবাদ, {userName}!
                        </h3>
                        <div className="mt-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-bold text-primary">"{eventName}"</span> ইভেন্টে আপনার রেজিস্ট্রেশন সফল হয়েছে।
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                                আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব। ইভেন্ট ইনবক্সে আপনার তথ্য সংরক্ষিত হয়েছে।
                            </p>
                        </div>
                    </div>
                    <div className="mt-8">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-3 bg-primary text-base font-medium text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-sm uppercase tracking-wider transition-colors"
                            onClick={onClose}
                        >
                            ঠিক আছে
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};