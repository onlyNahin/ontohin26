import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CustomForm, FormField, FormSubmission } from '../types';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface PublicFormViewProps {
    forms: CustomForm[];
    darkMode: boolean;
}

export const PublicFormView: React.FC<PublicFormViewProps> = ({ forms, darkMode }) => {
    const { token } = useParams<{ token: string }>();
    const [form, setForm] = useState<CustomForm | undefined>(undefined);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            const found = forms.find(f => f.shareToken === token);
            setForm(found);
            if (found) {
                // Initialize defaults
                const initial: Record<string, any> = {};
                found.fields.forEach(f => {
                    if (f.type === 'multiple_choice' || f.type === 'payment_method') {
                        initial[f.id] = f.options && f.options.length > 0 ? f.options[0] : '';
                    } else {
                        initial[f.id] = '';
                    }
                });
                setFormData(initial);
            }
        }
    }, [token, forms]);

    const handleInputChange = (fieldId: string, value: any) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validation check for required fields
        if (form) {
            const missing = form.fields.filter(f => f.required && !formData[f.id]);
            if (missing.length > 0) {
                setError(`অনুগ্রহ করে পূরণ করুন: ${missing.map(f => f.label).join(', ')}`);
                return;
            }

            const newSubmission = {
                formId: form.id,
                formTitle: form.title,
                submittedAt: new Date().toISOString(),
                data: formData
            };

            try {
                // 1. Save to Firebase First
                await addDoc(collection(db, 'submissions'), newSubmission);

                // 2. Google Integration (Async)
                if (form.googleIntegration?.enabled && form.googleIntegration.scriptUrl) {
                    const attachments: Record<string, any> = {};
                    const formDataWithLabels: Record<string, any> = {};

                    // Prepare data with labels for the sheet
                    for (const field of form.fields) {
                        if (field.type === 'description') continue;

                        const value = formData[field.id];
                        formDataWithLabels[field.label] = value;

                        if (field.type === 'file_upload' && value instanceof File) {
                            try {
                                const base64 = await fileToBase64(value);
                                attachments[field.label] = {
                                    name: value.name,
                                    type: value.type,
                                    base64: base64
                                };
                            } catch (err) {
                                console.error("File conversion error:", err);
                            }
                        }
                    }

                    // Post to GAS (fire and forget for better UX, or wait if you want to ensure sync)
                    fetch(form.googleIntegration.scriptUrl, {
                        method: 'POST',
                        mode: 'no-cors', // GAS needs no-cors for simple redirects
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            formTitle: form.title,
                            submittedAt: newSubmission.submittedAt,
                            formData: formDataWithLabels,
                            attachments: attachments
                        })
                    }).catch(err => console.error("Google Sync Error:", err));
                }

                setSubmitted(true);
                setError('');
            } catch (error) {
                console.error("Error submitting form: ", error);
                setError('ফর্মটি জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
            }
        }
    };

    if (!form) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
                <div className="text-center">
                    <span className="material-icons text-6xl text-gray-300 dark:text-gray-600 mb-4">link_off</span>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ফর্মটি পাওয়া যায়নি</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">লিংকটি ভুল বা ফর্মটি ডিলিট করা হয়েছে।</p>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
                <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-lg shadow-xl max-w-md w-full text-center border border-gray-200 dark:border-gray-800 animate-fade-in">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                        <span className="material-icons text-5xl text-green-600 dark:text-green-400">check_circle</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">ধন্যবাদ!</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        আপনার তথ্য সফলভাবে জমা দেওয়া হয়েছে।
                    </p>
                    <button onClick={() => window.location.href = '/'} className="mt-8 text-primary hover:underline">
                        হোম পেজে ফিরে যান
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-gray-50 dark:bg-[#121212] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
            <div className="max-w-3xl mx-auto">
                {/* Header Card */}
                <div className="bg-white dark:bg-surface-dark rounded-t-lg shadow-sm border-t-8 border-primary p-8 mb-6">
                    <h1 className="text-3xl font-header font-bold text-gray-900 dark:text-white mb-4">{form.title}</h1>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{form.description}</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <span className="material-icons text-red-500">error</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {form.fields.map((field) => (
                        <div key={field.id} className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 transition-colors">
                            {field.type === 'description' ? (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{field.label}</h3>
                                    {field.helpText && <p className="text-gray-600 dark:text-gray-400 text-sm">{field.helpText}</p>}
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-base font-medium text-gray-900 dark:text-white mb-2">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>

                                    {field.helpText && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{field.helpText}</p>
                                    )}

                                    {/* Input Rendering Logic */}
                                    {field.type === 'short_text' && (
                                        <input
                                            type="text"
                                            className="w-full border-b border-gray-300 dark:border-gray-600 bg-transparent py-2 focus:border-primary focus:outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-400"
                                            placeholder="আপনার উত্তর"
                                            value={formData[field.id]}
                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                        />
                                    )}

                                    {field.type === 'long_text' && (
                                        <textarea
                                            rows={3}
                                            className="w-full border-b border-gray-300 dark:border-gray-600 bg-transparent py-2 focus:border-primary focus:outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-400 resize-none"
                                            placeholder="আপনার উত্তর"
                                            value={formData[field.id]}
                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                        />
                                    )}

                                    {field.type === 'number' && (
                                        <input
                                            type="number"
                                            className="w-full border-b border-gray-300 dark:border-gray-600 bg-transparent py-2 focus:border-primary focus:outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-400"
                                            placeholder="সংখ্যা"
                                            value={formData[field.id]}
                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                        />
                                    )}

                                    {field.type === 'email' && (
                                        <input
                                            type="email"
                                            className="w-full border-b border-gray-300 dark:border-gray-600 bg-transparent py-2 focus:border-primary focus:outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-400"
                                            placeholder="example@email.com"
                                            value={formData[field.id]}
                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                        />
                                    )}

                                    {(field.type === 'multiple_choice' || field.type === 'payment_method') && (
                                        <div className="space-y-2">
                                            {(field.options || []).map((option, idx) => (
                                                <label key={idx} className="flex items-center space-x-3 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={field.id}
                                                        value={option}
                                                        checked={formData[field.id] === option}
                                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                    <span className="text-gray-700 dark:text-gray-300">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {field.type === 'transaction_id' && (
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                                                <span className="material-icons text-lg">receipt</span>
                                            </span>
                                            <input
                                                type="text"
                                                className="w-full border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-black/20 py-2 pl-9 pr-3 focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-gray-900 dark:text-white placeholder-gray-400 font-mono uppercase"
                                                placeholder="TXN123456"
                                                value={formData[field.id]}
                                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                            />
                                        </div>
                                    )}

                                    {field.type === 'file_upload' && (
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md hover:border-primary dark:hover:border-primary transition-colors cursor-pointer group">
                                            <div className="space-y-1 text-center">
                                                <span className="material-icons text-4xl text-gray-400 group-hover:text-primary transition-colors">cloud_upload</span>
                                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                    <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary hover:text-primary-hover focus-within:outline-none">
                                                        <span>ফাইল আপলোড করুন</span>
                                                        <input
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={(e) => handleInputChange(field.id, e.target.files?.[0])}
                                                        />
                                                    </label>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                                    {formData[field.id] instanceof File ? `Selected: ${formData[field.id].name}` : 'PNG, JPG, PDF up to 10MB'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="flex justify-between items-center pt-4">
                        <div className="w-full">
                            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: '100%' }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Page 1 of 1</p>
                        </div>
                        <button
                            type="submit"
                            className="ml-6 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded shadow-lg transform transition hover:-translate-y-1"
                        >
                            জমা দিন
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-12 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-600">
                    পাওয়ার্ড বাই <span className="font-bold">অন্তহীন ২৬</span> • কোনো পাসওয়ার্ড শেয়ার করবেন না।
                </p>
            </div>
        </div>
    );
};