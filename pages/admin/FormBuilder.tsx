import React, { useState } from 'react';
import { CustomForm, FormField, FormFieldType } from '../../types';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface FormBuilderProps {
    forms: CustomForm[];
}

const FIELD_TYPES: { type: FormFieldType; label: string; icon: string }[] = [
    { type: 'short_text', label: 'Short Answer', icon: 'short_text' },
    { type: 'long_text', label: 'Long Answer', icon: 'notes' },
    { type: 'number', label: 'Number', icon: '123' },
    { type: 'email', label: 'Email', icon: 'email' },
    { type: 'multiple_choice', label: 'Multiple Choice', icon: 'list' },
    { type: 'transaction_id', label: 'Transaction ID', icon: 'receipt' },
    { type: 'payment_method', label: 'Payment Method', icon: 'payments' },
    { type: 'file_upload', label: 'File Attach', icon: 'attach_file' },
    { type: 'description', label: 'Description/Header', icon: 'info' },
];

export const FormBuilder: React.FC<FormBuilderProps> = ({ forms, setForms }) => {
    const [view, setView] = useState<'list' | 'edit'>('list');
    const [currentForm, setCurrentForm] = useState<CustomForm | null>(null);

    const generateToken = () => {
        return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    };

    const handleCreateNew = () => {
        const newForm: CustomForm = {
            id: Date.now().toString(),
            title: 'নতুন ফর্ম',
            description: '',
            fields: [],
            status: 'draft',
            createdAt: new Date().toISOString(),
            shareToken: generateToken()
        };
        setCurrentForm(newForm);
        setView('edit');
    };

    const handleEditForm = async (form: CustomForm) => {
        // Ensure legacy forms have a token
        if (!form.shareToken) {
            const token = generateToken();
            try {
                await updateDoc(doc(db, 'forms', form.id), { shareToken: token });
                setCurrentForm({ ...form, shareToken: token });
            } catch (error) {
                console.error("Error updating form token: ", error);
            }
        } else {
            setCurrentForm({ ...form });
        }
        setView('edit');
    };

    const handleDeleteForm = async (id: string, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (window.confirm('আপনি কি এই ফর্মটি মুছে ফেলতে চান? এটি পুনরুদ্ধার করা যাবে না।')) {
            try {
                await deleteDoc(doc(db, 'forms', id));
            } catch (error) {
                console.error("Error deleting form: ", error);
            }
        }
    };

    const handleSaveForm = async () => {
        if (currentForm) {
            try {
                if (currentForm.id && forms.find(f => f.id === currentForm.id)) {
                    const { id, ...data } = currentForm;
                    await updateDoc(doc(db, 'forms', id), data);
                } else {
                    await addDoc(collection(db, 'forms'), currentForm);
                }
                setView('list');
                setCurrentForm(null);
            } catch (error) {
                console.error("Error saving form: ", error);
            }
        }
    };

    const copyShareLink = async (form: CustomForm, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        let token = form.shareToken;

        // If token missing, generate one and update state
        if (!token) {
            token = generateToken();
            try {
                await updateDoc(doc(db, 'forms', form.id), { shareToken: token });
            } catch (error) {
                console.error("Error updating token: ", error);
            }
        }

        const url = `${window.location.origin}${window.location.pathname}# / form / ${token} `;

        // Copy logic with fallback
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(url).then(() => {
                alert(`লিংক কপি করা হয়েছে: ${url} `);
            }).catch(() => {
                prompt("লিংকটি কপি করুন:", url);
            });
        } else {
            prompt("লিংকটি কপি করুন:", url);
        }
    };

    if (view === 'edit' && currentForm) {
        return (
            <FormEditor
                form={currentForm}
                setForm={setCurrentForm}
                onSave={handleSaveForm}
                onCancel={() => { setView('list'); setCurrentForm(null); }}
                onCopyLink={() => copyShareLink(currentForm)}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-header font-bold text-gray-900 dark:text-white">কাস্টম ফর্ম বিল্ডার</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">কাস্টম রেজিস্ট্রেশন বা তথ্য সংগ্রহের ফর্ম তৈরি করুন</p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded shadow-lg flex items-center transition-all"
                >
                    <span className="material-icons text-sm mr-2">add</span>
                    নতুন ফর্ম তৈরি করুন
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forms.map(form => (
                    <div key={form.id} className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark flex flex-col justify-between hover:shadow-md transition-shadow relative">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate" title={form.title}>{form.title}</h3>
                                <span className={`px - 2 py - 0.5 text - xs rounded - full ${form.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'} `}>
                                    {form.status === 'published' ? 'Published' : 'Draft'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-10">{form.description || 'কোন বিবরণ নেই'}</p>
                            <p className="text-xs text-gray-400 mb-4">Fields: {form.fields.length} • Created: {new Date(form.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-800 z-10 relative">
                            <button
                                type="button"
                                onClick={(e) => copyShareLink(form, e)}
                                className="border border-cyan-500 text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 p-2 rounded transition-colors"
                                title="Share Link"
                            >
                                <span className="material-icons text-xl pointer-events-none">share</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleEditForm(form)}
                                className="border border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded transition-colors"
                                title="Edit"
                            >
                                <span className="material-icons text-xl pointer-events-none">edit</span>
                            </button>
                            <button
                                type="button"
                                onClick={(e) => handleDeleteForm(form.id, e)}
                                className="border border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded transition-colors"
                                title="Delete"
                            >
                                <span className="material-icons text-xl pointer-events-none">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
                {forms.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-black/10 rounded border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <span className="material-icons text-gray-400 text-5xl mb-4">dynamic_form</span>
                        <p className="text-gray-500 dark:text-gray-400">এখনও কোনো ফর্ম তৈরি করা হয়নি।</p>
                    </div>
                )}
            </div>
        </div>
    );
};

interface FormEditorProps {
    form: CustomForm;
    setForm: React.Dispatch<React.SetStateAction<CustomForm | null>>;
    onSave: () => void;
    onCancel: () => void;
    onCopyLink: () => void;
}

const FormEditor: React.FC<FormEditorProps> = ({ form, setForm, onSave, onCancel, onCopyLink }) => {
    const [activeTab, setActiveTab] = useState<'fields' | 'settings' | 'integration'>('fields');
    const handleAddField = (type: FormFieldType) => {
        const newField: FormField = {
            id: Date.now().toString(),
            type,
            label: `নতুন ${type.replace('_', ' ')} `,
            required: false,
            options: type === 'multiple_choice' || type === 'payment_method' ? ['Option 1', 'Option 2'] : undefined
        };
        setForm(prev => prev ? { ...prev, fields: [...prev.fields, newField] } : null);
    };

    const handleUpdateField = (id: string, updates: Partial<FormField>) => {
        setForm(prev => prev ? { ...prev, fields: prev.fields.map(f => f.id === id ? { ...f, ...updates } : f) } : null);
    };

    const handleDeleteField = (id: string) => {
        setForm(prev => prev ? { ...prev, fields: prev.fields.filter(f => f.id !== id) } : null);
    };

    const handleFormMetaChange = (field: keyof CustomForm, value: string) => {
        setForm(prev => prev ? { ...prev, [field]: value } : null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between bg-surface-light dark:bg-surface-dark p-4 rounded-lg border border-border-light dark:border-border-dark sticky top-0 z-10 shadow-md">
                <div className="flex items-center">
                    <button onClick={onCancel} className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                        <span className="material-icons">arrow_back</span>
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">ফর্ম এডিটর</h2>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={form.status}
                        onChange={(e) => handleFormMetaChange('status', e.target.value)}
                        className="bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                    <button onClick={onSave} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded font-medium shadow transition-colors">
                        সেভ করুন
                    </button>
                </div>
            </div>

            <div className="flex border-b border-gray-200 dark:border-gray-800">
                <button
                    onClick={() => setActiveTab('fields')}
                    className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'fields' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    ফিল্ডস
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'settings' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    সেটিংস
                </button>
                <button
                    onClick={() => setActiveTab('integration')}
                    className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'integration' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    ইন্টিগ্রেশন
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Editor Area */}
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'fields' && (
                        <div className="space-y-4">
                            {form.fields.map((field, index) => (
                                <FieldCard
                                    key={field.id}
                                    field={field}
                                    index={index}
                                    onUpdate={handleUpdateField}
                                    onDelete={handleDeleteField}
                                />
                            ))}
                            {form.fields.length === 0 && (
                                <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                                    <p className="text-gray-500">কোনো ফিল্ড যোগ করা হয়নি। ডান পাশের টুলবক্স থেকে ফিল্ড যোগ করুন।</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">শেয়ারিং এবং অ্যাক্সেস</h3>
                            {/* Share Link Display */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">শেয়ার লিংক</label>
                                <div className="flex gap-2">
                                    <input
                                        readOnly
                                        type="text"
                                        value={`${window.location.origin}${window.location.pathname}#/form/${form.shareToken}`}
                                        className="w-full bg-gray-100 dark:bg-black/40 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm text-gray-600 dark:text-gray-400 font-mono"
                                    />
                                    <button
                                        onClick={onCopyLink}
                                        className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-3 py-2 rounded-md hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-colors"
                                        title="Copy Link"
                                    >
                                        <span className="material-icons text-sm">content_copy</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'integration' && (
                        <div className="space-y-6">
                            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                                            <span className="material-icons text-green-600 dark:text-green-400">description</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Google Drive & Sheets</h3>
                                            <p className="text-xs text-gray-500">ডাটা এবং ফাইল সরাসরি গুগল ড্রাইভে সেভ করুন</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.googleIntegration?.enabled || false}
                                            onChange={(e) => setForm(prev => prev ? { ...prev, googleIntegration: { ...prev.googleIntegration, scriptUrl: prev.googleIntegration?.scriptUrl || '', enabled: e.target.checked } } : null)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                                    </label>
                                </div>

                                <div className={`space-y-4 transition-opacity ${form.googleIntegration?.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Google Apps Script Web App URL</label>
                                        <input
                                            type="text"
                                            value={form.googleIntegration?.scriptUrl || ''}
                                            onChange={(e) => setForm(prev => prev ? { ...prev, googleIntegration: { ...prev.googleIntegration, enabled: prev.googleIntegration?.enabled || false, scriptUrl: e.target.value } } : null)}
                                            placeholder="https://script.google.com/macros/s/.../exec"
                                            className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                                        />
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
                                        <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                                            <span className="material-icons text-sm mr-1">help_outline</span>
                                            এটি কীভাবে সেটআপ করবেন?
                                        </h4>
                                        <ol className="text-xs text-blue-700 dark:text-blue-400 space-y-2 list-decimal ml-4">
                                            <li><span className="font-bold">Google Apps Script</span> ওপেন করুন এবং আমি যে কোডটি দিয়েছি তা পেস্ট করুন।</li>
                                            <li><span className="font-bold">Deploy {'>'} New Deployment</span> এ ব্লিক করুন।</li>
                                            <li>Select Type এ <span className="font-bold">Web App</span> সিলেক্ট করুন।</li>
                                            <li>Who has access এ <span className="font-bold">Anyone</span> সিলেক্ট করে Deploy করুন।</li>
                                            <li>প্রাপ্ত Web App URL টি উপরের বক্সে পেস্ট করুন।</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Toolbox Sidebar */}
                <div className="lg:col-span-1">
                    {activeTab === 'fields' ? (
                        <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg shadow-sm border border-border-light dark:border-border-dark sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">ফিল্ড টুলবক্স</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {FIELD_TYPES.map(type => (
                                    <button
                                        key={type.type}
                                        onClick={() => handleAddField(type.type)}
                                        className="flex items-center p-3 bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded transition-colors text-left"
                                    >
                                        <span className="material-icons text-gray-500 dark:text-gray-400 mr-3">{type.icon}</span>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg shadow-sm border border-border-light dark:border-border-dark sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">টিপস</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                ইন্টিগ্রেশন এনাবল করলে প্রতিটি সাবমিশন সাথে সাথে আপনার পছন্দের গুগল শীটে জমা হবে। ফাইলগুলো আপনার নামে গুগল ড্রাইভে একটি ফোল্ডার তৈরি করে সেখানে রাখা হবে।
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const FieldCard: React.FC<{
    field: FormField;
    index: number;
    onUpdate: (id: string, updates: Partial<FormField>) => void;
    onDelete: (id: string) => void;
}> = ({ field, index, onUpdate, onDelete }) => {
    return (
        <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg shadow-sm border border-border-light dark:border-border-dark relative group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xs font-mono px-2 py-1 rounded mr-3">
                        {index + 1}. {FIELD_TYPES.find(t => t.type === field.type)?.label || field.type}
                    </span>
                    {field.type !== 'description' && (
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => onUpdate(field.id, { required: e.target.checked })}
                                className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-black focus:ring-primary"
                            />
                            <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">আবশ্যক (Required)</span>
                        </label>
                    )}
                </div>
                <button onClick={() => onDelete(field.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <span className="material-icons text-lg">close</span>
                </button>
            </div>

            <div className="space-y-3">
                <input
                    type="text"
                    value={field.label}
                    onChange={(e) => onUpdate(field.id, { label: e.target.value })}
                    className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 px-1 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors text-lg font-medium placeholder-gray-400"
                    placeholder="লেবেল লিখুন (যেমন: আপনার নাম)"
                />

                {field.type !== 'description' && (
                    <input
                        type="text"
                        value={field.helpText || ''}
                        onChange={(e) => onUpdate(field.id, { helpText: e.target.value })}
                        className="w-full bg-transparent border-b border-gray-200 dark:border-gray-800 px-1 py-1 text-sm text-gray-500 dark:text-gray-400 focus:outline-none focus:border-primary transition-colors placeholder-gray-400"
                        placeholder="হেল্প টেক্সট বা প্লেসহোল্ডার (অপশনাল)"
                    />
                )}

                {(field.type === 'multiple_choice' || field.type === 'payment_method') && (
                    <div className="mt-3 bg-gray-50 dark:bg-black/20 p-3 rounded">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">অপশনসমূহ (কমা দিয়ে আলাদা করুন)</p>
                        <textarea
                            rows={2}
                            value={field.options?.join(', ') || ''}
                            onChange={(e) => onUpdate(field.id, { options: e.target.value.split(',').map(s => s.trim()) })}
                            className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm text-gray-900 dark:text-white"
                            placeholder="Option 1, Option 2, Option 3"
                        />
                    </div>
                )}

                {/* Preview Area (Visual indication of field type) */}
                <div className="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-800 opacity-50 pointer-events-none">
                    {field.type === 'short_text' && <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>}
                    {field.type === 'long_text' && <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>}
                    {field.type === 'file_upload' && <div className="h-10 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-xs">File Upload Preview</div>}
                    {(field.type === 'multiple_choice' || field.type === 'payment_method') && (
                        <div className="space-y-1">
                            {(field.options || ['Option 1']).map((opt, i) => (
                                <div key={i} className="flex items-center"><div className="w-3 h-3 rounded-full border border-gray-400 mr-2"></div><span className="text-xs">{opt}</span></div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};