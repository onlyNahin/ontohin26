import React, { useState } from 'react';
import { HistoryPageData, HistoryContentBlock } from '../../types';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

interface HistoryManagerProps {
    historyData: HistoryPageData;
}

export const HistoryManager: React.FC<HistoryManagerProps> = ({ historyData }) => {
    const [tempBlocks, setTempBlocks] = useState<HistoryContentBlock[]>(historyData.contentBlocks);

    // Main fields handler
    const handleMainChange = async (field: keyof HistoryPageData, value: string) => {
        try {
            const historyRef = doc(db, 'metadata', 'history');
            await setDoc(historyRef, { [field]: value }, { merge: true });
        } catch (error) {
            console.error("Error updating history data: ", error);
        }
    };

    // Block fields handler
    const handleBlockChange = (id: string, field: keyof HistoryContentBlock, value: string) => {
        setTempBlocks(prev => prev.map(block => block.id === id ? { ...block, [field]: value } : block));
    };

    const handleAddBlock = () => {
        const newBlock: HistoryContentBlock = {
            id: Date.now().toString(),
            title: 'নতুন সেকশন',
            description: 'বিস্তারিত লিখুন...'
        };
        setTempBlocks([...tempBlocks, newBlock]);
    };

    const handleDeleteBlock = (id: string) => {
        if (window.confirm('আপনি কি এই সেকশনটি মুছে ফেলতে চান?')) {
            setTempBlocks(tempBlocks.filter(b => b.id !== id));
        }
    };

    const handleSaveBlocks = async () => {
        try {
            const historyRef = doc(db, 'metadata', 'history');
            await setDoc(historyRef, { contentBlocks: tempBlocks }, { merge: true });
            alert('ইতিহাস পেজের কন্টেন্ট আপডেট করা হয়েছে!');
        } catch (error) {
            console.error("Error saving blocks: ", error);
            alert('সেভ করতে সমস্যা হয়েছে।');
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-header font-bold text-gray-900 dark:text-white">ইতিহাস পেজ কাস্টমাইজেশন</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">ইতিহাস পাতার টেক্সট এবং কন্টেন্ট পরিবর্তন করুন</p>
            </div>

            {/* Header & Main Info */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="material-icons mr-2 text-primary">title</span>
                    হেডার এবং মূল তথ্য
                </h3>
                <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">হেডার সাবটাইটেল (ছোট)</label>
                            <input
                                type="text"
                                value={historyData.headerSubtitle}
                                onChange={(e) => handleMainChange('headerSubtitle', e.target.value)}
                                className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">হেডার টাইটেল (বড়)</label>
                            <input
                                type="text"
                                value={historyData.headerTitle}
                                onChange={(e) => handleMainChange('headerTitle', e.target.value)}
                                className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">মূল বিবরণ (প্রথম প্যারাগ্রাফ)</label>
                        <textarea
                            rows={3}
                            value={historyData.mainDescription}
                            onChange={(e) => handleMainChange('mainDescription', e.target.value)}
                            className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ছবির URL</label>
                        <input
                            type="text"
                            value={historyData.imageUrl}
                            onChange={(e) => handleMainChange('imageUrl', e.target.value)}
                            className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                        />
                        {historyData.imageUrl && (
                            <div className="mt-2 w-full h-40 bg-gray-100 dark:bg-black rounded overflow-hidden">
                                <img src={historyData.imageUrl} alt="Preview" className="w-full h-full object-cover opacity-80" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Blocks */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                        <span className="material-icons mr-2 text-blue-500">article</span>
                        বিস্তারিত সেকশন
                    </h3>
                    <button
                        onClick={handleAddBlock}
                        className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 rounded text-sm font-medium transition-colors flex items-center"
                    >
                        <span className="material-icons text-sm mr-1">add</span> নতুন সেকশন
                    </button>
                </div>

                <div className="space-y-6">
                    {tempBlocks.map((block, index) => (
                        <div key={block.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-black/20">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="text-sm font-bold text-gray-500 uppercase">সেকশন #{index + 1}</h4>
                                <button onClick={() => handleDeleteBlock(block.id)} className="text-red-500 hover:text-red-700">
                                    <span className="material-icons text-sm">delete</span>
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">শিরোনাম</label>
                                    <input
                                        type="text"
                                        value={block.title}
                                        onChange={(e) => handleBlockChange(block.id, 'title', e.target.value)}
                                        className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">বিস্তারিত বিবরণ</label>
                                    <textarea
                                        rows={4}
                                        value={block.description}
                                        onChange={(e) => handleBlockChange(block.id, 'description', e.target.value)}
                                        className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Quote */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="material-icons mr-2 text-purple-500">format_quote</span>
                    ফুটার কোট (উদ্ধৃতি)
                </h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">কোট টেক্সট</label>
                    <input
                        type="text"
                        value={historyData.quote}
                        onChange={(e) => handleMainChange('quote', e.target.value)}
                        className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button onClick={handleSaveBlocks} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded shadow-lg transition-colors font-medium flex items-center">
                    <span className="material-icons mr-2 text-sm">save</span>
                    পরিবর্তন সেভ করুন
                </button>
            </div>
        </div>
    );
};