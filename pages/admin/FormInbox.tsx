import React, { useState } from 'react';
import { CustomForm, FormSubmission } from '../../types';
import { db } from '../../firebase';
import { doc, deleteDoc } from 'firebase/firestore';

interface FormInboxProps {
    forms: CustomForm[];
    submissions: FormSubmission[];
}

export const FormInbox: React.FC<FormInboxProps> = ({ forms, submissions }) => {
    const [selectedFormId, setSelectedFormId] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);

    const filteredSubmissions = submissions.filter(sub => {
        const matchesForm = selectedFormId === 'all' || sub.formId === selectedFormId;
        // Search in all data values
        const matchesSearch = searchTerm === '' || Object.values(sub.data).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );
        return matchesForm && matchesSearch;
    });

    const getFormName = (formId: string) => {
        const form = forms.find(f => f.id === formId);
        return form ? form.title : 'Unknown Form';
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই সাবমিশনটি মুছে ফেলতে চান?')) {
            try {
                await deleteDoc(doc(db, 'submissions', id));
                if (selectedSubmission?.id === id) {
                    setSelectedSubmission(null);
                }
            } catch (error) {
                console.error("Error deleting submission: ", error);
            }
        }
    };

    const getFieldLabel = (formId: string, fieldId: string) => {
        const form = forms.find(f => f.id === formId);
        const field = form?.fields.find(f => f.id === fieldId);
        return field ? field.label : fieldId;
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-header font-bold text-gray-900 dark:text-white">ফর্ম রেসপন্স ইনবক্স</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">সকল কাস্টম ফর্মের সাবমিশন দেখুন</p>
                </div>

                <div className="flex gap-3">
                    <select
                        value={selectedFormId}
                        onChange={(e) => setSelectedFormId(e.target.value)}
                        className="block w-48 pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-surface-dark text-gray-700 dark:text-gray-200"
                    >
                        <option value="all">সব ফর্ম</option>
                        {forms.map(form => (
                            <option key={form.id} value={form.id}>{form.title}</option>
                        ))}
                    </select>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-icons text-gray-400 text-sm">search</span>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                            placeholder="খুঁজুন..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* List View */}
                <div className={`${selectedSubmission ? 'hidden md:block md:w-1/3' : 'w-full'} bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg overflow-hidden flex flex-col`}>
                    <div className="p-4 border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-black/20">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{filteredSubmissions.length} টি সাবমিশন</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredSubmissions.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                কোনো সাবমিশন পাওয়া যায়নি
                            </div>
                        ) : (
                            <ul className="divide-y divide-border-light dark:divide-border-dark">
                                {filteredSubmissions.map(submission => (
                                    <li
                                        key={submission.id}
                                        onClick={() => setSelectedSubmission(submission)}
                                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${selectedSubmission?.id === submission.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-bold text-primary uppercase truncate max-w-[150px]">
                                                {submission.formTitle || getFormName(submission.formId)}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(submission.submittedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {/* Show first non-empty field value as preview */}
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {Object.values(submission.data).find(v => v) || 'No Data'}
                                        </h4>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Detail View */}
                {selectedSubmission ? (
                    <div className="flex-1 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg overflow-hidden flex flex-col animate-fade-in">
                        <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-between items-start bg-gray-50 dark:bg-black/20">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                    {selectedSubmission.formTitle || getFormName(selectedSubmission.formId)}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Submitted on {new Date(selectedSubmission.submittedAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="md:hidden p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                >
                                    <span className="material-icons">close</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedSubmission.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                    title="Delete Submission"
                                >
                                    <span className="material-icons">delete</span>
                                </button>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="space-y-6">
                                {Object.entries(selectedSubmission.data).map(([fieldId, value]) => (
                                    <div key={fieldId} className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0">
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                            {getFieldLabel(selectedSubmission.formId, fieldId)}
                                        </label>
                                        <div className="text-gray-900 dark:text-white text-base whitespace-pre-wrap">
                                            {String(value)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="hidden md:flex flex-1 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg items-center justify-center text-gray-400 flex-col">
                        <span className="material-icons text-6xl mb-4 opacity-20">inbox</span>
                        <p>বাম পাশ থেকে একটি সাবমিশন সিলেক্ট করুন</p>
                    </div>
                )}
            </div>
        </div>
    );
};
