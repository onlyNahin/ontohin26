import React, { useState, useEffect } from 'react';
import { AboutSectionData, AboutCard } from '../../types';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AboutManagerProps {
    aboutData: AboutSectionData;
}

export const AboutManager: React.FC<AboutManagerProps> = ({ aboutData }) => {
    // Local state for all fields to ensure smooth editing and consolidated saving
    const [localData, setLocalData] = useState<AboutSectionData>({
        title: aboutData?.title || '',
        subtitle: aboutData?.subtitle || '',
        description: aboutData?.description || '',
        cards: aboutData?.cards || []
    });

    // Sync local state when incoming props change (e.g., after a save or remote update)
    useEffect(() => {
        if (aboutData) {
            setLocalData({
                title: aboutData.title || '',
                subtitle: aboutData.subtitle || '',
                description: aboutData.description || '',
                cards: aboutData.cards || []
            });
        }
    }, [aboutData]);

    const handleMainChange = (field: keyof AboutSectionData, value: string) => {
        setLocalData(prev => ({ ...prev, [field]: value }));
    };

    const handleCardChange = (id: string, field: keyof AboutCard, value: string) => {
        setLocalData(prev => ({
            ...prev,
            cards: prev.cards.map(card => card.id === id ? { ...card, [field]: value } : card)
        }));
    };

    const handleAddCard = () => {
        const newCard: AboutCard = {
            id: Date.now().toString(),
            icon: 'star',
            title: 'নতুন বৈশিষ্ট্য',
            description: 'বর্ণনা লিখুন...'
        };
        setLocalData(prev => ({
            ...prev,
            cards: [...prev.cards, newCard]
        }));
    };

    const handleDeleteCard = (id: string) => {
        if (window.confirm('আপনি কি এই কার্ডটি মুছে ফেলতে চান?')) {
            setLocalData(prev => ({
                ...prev,
                cards: prev.cards.filter(c => c.id !== id)
            }));
        }
    };

    const handleSaveAll = async () => {
        try {
            const aboutRef = doc(db, 'metadata', 'about');
            await setDoc(aboutRef, localData, { merge: true });
            alert('সফলভাবে সংরক্ষিত হয়েছে!');
        } catch (error) {
            console.error("Error saving about data: ", error);
            alert('সেভ করতে সমস্যা হয়েছে।');
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-header font-bold text-gray-900 dark:text-white">আমাদের সম্পর্কে</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">"আমরা কারা" সেকশনের তথ্য এবং বৈশিষ্ট্য কার্ড পরিবর্তন করুন</p>
            </div>

            {/* Main Info Section */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="material-icons mr-2 text-primary">info</span>
                    প্রধান তথ্য
                </h3>
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">সাবটাইটেল (ছোট টেক্সট)</label>
                        <input
                            type="text"
                            value={localData.subtitle}
                            onChange={(e) => handleMainChange('subtitle', e.target.value)}
                            className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">মেইন টাইটেল</label>
                        <input
                            type="text"
                            value={localData.title}
                            onChange={(e) => handleMainChange('title', e.target.value)}
                            className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">বিবরণ</label>
                        <textarea
                            rows={4}
                            value={localData.description}
                            onChange={(e) => handleMainChange('description', e.target.value)}
                            className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Feature Cards Section */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                        <span className="material-icons mr-2 text-blue-500">grid_view</span>
                        বৈশিষ্ট্য কার্ড
                    </h3>
                    <button
                        onClick={handleAddCard}
                        className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 rounded text-sm font-medium transition-colors flex items-center"
                    >
                        <span className="material-icons text-sm mr-1">add</span> নতুন কার্ড
                    </button>
                </div>

                <div className="space-y-4">
                    {localData.cards.map((card, index) => (
                        <div key={card.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-black/20">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="text-sm font-bold text-gray-500 uppercase">কার্ড #{index + 1}</h4>
                                <button onClick={() => handleDeleteCard(card.id)} className="text-red-500 hover:text-red-700">
                                    <span className="material-icons text-sm">delete</span>
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">আইকন (Material Icon)</label>
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            value={card.icon}
                                            onChange={(e) => handleCardChange(card.id, 'icon', e.target.value)}
                                            className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-l-md px-2 py-1.5 text-sm"
                                        />
                                        <div className="bg-gray-200 dark:bg-gray-700 px-2 py-1.5 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                                            <span className="material-icons text-lg">{card.icon}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-4">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">শিরোনাম</label>
                                    <input
                                        type="text"
                                        value={card.title}
                                        onChange={(e) => handleCardChange(card.id, 'title', e.target.value)}
                                        className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1.5 text-sm"
                                    />
                                </div>
                                <div className="md:col-span-6">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">বিবরণ</label>
                                    <input
                                        type="text"
                                        value={card.description}
                                        onChange={(e) => handleCardChange(card.id, 'description', e.target.value)}
                                        className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1.5 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                <button onClick={handleSaveAll} className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg shadow-xl transition-all font-bold flex items-center transform hover:-translate-y-1">
                    <span className="material-icons mr-2">save</span>
                    সব পরিবর্তন সেভ করুন
                </button>
            </div>
        </div>
    );
};