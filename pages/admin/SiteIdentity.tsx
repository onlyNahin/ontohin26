import React, { useState, useEffect } from 'react';
import { HeroData } from '../../types';
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface SiteIdentityProps {
    heroData: HeroData;
}

export const SiteIdentity: React.FC<SiteIdentityProps> = ({ heroData }) => {
    const [favicon, setFavicon] = useState<string>("");

    useEffect(() => {
        // Try to get current favicon
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link && link.href) {
            setFavicon(link.href);
        }
    }, []);

    const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFavicon(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            // Update Hero Data in Firestore
            const heroRef = doc(db, 'metadata', 'hero');
            await updateDoc(heroRef, heroData);

            // Update Favicon in DOM
            if (favicon) {
                let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
                if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.head.appendChild(link);
                }
                link.href = favicon;
            }

            alert("সাইট পরিচিতি সেটিংস সফলভাবে সংরক্ষিত হয়েছে!");
        } catch (error) {
            console.error("Error saving site identity: ", error);
            alert("সেভ করতে সমস্যা হয়েছে।");
        }
    };

    const handleHeroChange = async (field: keyof HeroData, value: string) => {
        try {
            const heroRef = doc(db, 'metadata', 'hero');
            await updateDoc(heroRef, { [field]: value });
        } catch (error) {
            console.error("Error updating hero field: ", error);
        }
    };

    const handleButtonChange = async (field: keyof HeroData['button'], value: string) => {
        try {
            const heroRef = doc(db, 'metadata', 'hero');
            await updateDoc(heroRef, {
                button: { ...heroData.button, [field]: value }
            });
        } catch (error) {
            console.error("Error updating hero button: ", error);
        }
    };

    return (
        <div className="space-y-6 pb-10">
            <div>
                <h1 className="text-2xl font-header font-bold text-gray-900 dark:text-white">সাইট পরিচিতি</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">গ্লোবাল ব্র্যান্ডিং, ফেভিকন এবং হিরো সেকশন ম্যানেজ করুন</p>
            </div>

            {/* Branding & Favicon Section */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">ব্র্যান্ডিং</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">সাইট ফেভিকন</label>
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded bg-gray-100 dark:bg-black border border-gray-300 dark:border-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {favicon ? (
                                    <img src={favicon} alt="Favicon" className="h-8 w-8 object-contain" />
                                ) : (
                                    <span className="material-icons text-gray-400">image</span>
                                )}
                            </div>
                            <div className="flex-1 w-full">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={favicon}
                                        onChange={(e) => setFavicon(e.target.value)}
                                        placeholder="আইকন URL লিখুন অথবা আপলোড করুন..."
                                        className="flex-1 bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm min-w-0"
                                    />
                                    <div className="relative flex-shrink-0">
                                        <input type="file" id="favicon_upload" accept="image/x-icon,image/png,image/jpeg,image/svg+xml" className="hidden" onChange={handleFaviconUpload} />
                                        <label htmlFor="favicon_upload" className="cursor-pointer h-[38px] px-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md flex items-center justify-center text-gray-700 dark:text-gray-200 transition-colors" title="Upload Favicon">
                                            <span className="material-icons text-lg">upload_file</span>
                                        </label>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">প্রস্তাবিত সাইজ: 32x32px বা 64x64px। ফরম্যাট: .ico, .png, .svg</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">হিরো সেকশন</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">হিরো টাইটেল</label>
                            <input type="text" value={heroData.title} onChange={e => handleHeroChange('title', e.target.value)} className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">হিরো সাবটাইটেল</label>
                            <input type="text" value={heroData.subtitle} onChange={e => handleHeroChange('subtitle', e.target.value)} className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ব্যাকগ্রাউন্ড ইমেজের URL</label>
                        <input type="text" value={heroData.imageUrl} onChange={e => handleHeroChange('imageUrl', e.target.value)} className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm" />
                        <div className="mt-2 h-40 w-full rounded overflow-hidden bg-gray-100 dark:bg-black border border-gray-300 dark:border-gray-700">
                            <img src={heroData.imageUrl} alt="Preview" className="w-full h-full object-cover opacity-75" />
                        </div>
                    </div>
                </div>

                {/* Hero Button Configuration */}
                <div className="mt-6 pt-6 border-t border-border-light dark:border-border-dark">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">অ্যাকশন বাটন কনফিগারেশন</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">বাটনের লেখা</label>
                            <input
                                type="text"
                                value={heroData.button.text}
                                onChange={e => handleButtonChange('text', e.target.value)}
                                className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                                placeholder="যেমন: ইভেন্ট দেখুন"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">অ্যাকশন টাইপ</label>
                            <select
                                value={heroData.button.type}
                                onChange={e => handleButtonChange('type', e.target.value)}
                                className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                            >
                                <option value="scroll">সেকশনে স্ক্রল (Scroll)</option>
                                <option value="route">পেইজ নেভিগেশন (Route)</option>
                                <option value="external">এক্সটার্নাল লিংক (External)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">টার্গেট / URL</label>
                            <input
                                type="text"
                                value={heroData.button.url}
                                onChange={e => handleButtonChange('url', e.target.value)}
                                className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                                placeholder={heroData.button.type === 'scroll' ? 'section_id (e.g., events)' : heroData.button.type === 'route' ? '/path' : 'https://...'}
                            />
                            <p className="text-[10px] text-gray-500 mt-1">
                                {heroData.button.type === 'scroll' && 'শুধুমাত্র সেকশন আইডি লিখুন (যেমন: events)'}
                                {heroData.button.type === 'route' && 'ইন্টারনাল পাথ লিখুন (যেমন: /gallery)'}
                                {heroData.button.type === 'external' && 'পুরো URL লিখুন (https://...)'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <button onClick={handleSave} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded shadow-lg transition-colors font-medium">পরিবর্তন সেভ করুন</button>
            </div>
        </div>
    );
};