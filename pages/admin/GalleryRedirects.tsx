import React, { useState } from 'react';
import { RedirectLink, GalleryItem } from '../../types';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface GalleryRedirectsProps {
    links: RedirectLink[];
    galleryItems: GalleryItem[];
}

export const GalleryRedirects: React.FC<GalleryRedirectsProps> = ({ links, galleryItems }) => {
    // === Redirect Links State ===
    const [newLabel, setNewLabel] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editLabel, setEditLabel] = useState('');
    const [editUrl, setEditUrl] = useState('');

    // === Gallery Images State ===
    const [imageTitle, setImageTitle] = useState('');
    const [imageCategory, setImageCategory] = useState<string>('Event');
    const [customCategory, setCustomCategory] = useState('');
    const [isCustomInput, setIsCustomInput] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const [isCompressing, setIsCompressing] = useState(false);

    // === Redirect Handlers ===
    const handleAddLink = async () => {
        if (newLabel && newUrl) {
            try {
                await addDoc(collection(db, 'links'), { label: newLabel, url: newUrl });
                setNewLabel('');
                setNewUrl('');
            } catch (error) {
                console.error("Error adding link: ", error);
            }
        }
    };

    const handleDeleteLink = async (id: string) => {
        if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই লিংকটি মুছে ফেলতে চান?')) {
            try {
                await deleteDoc(doc(db, 'links', id));
            } catch (error) {
                console.error("Error deleting link: ", error);
            }
        }
    };

    const handleEditLinkClick = (link: RedirectLink) => {
        setEditingId(link.id);
        setEditLabel(link.label);
        setEditUrl(link.url);
    };

    const handleSaveLinkEdit = async () => {
        if (editingId && editLabel && editUrl) {
            try {
                await updateDoc(doc(db, 'links', editingId), { label: editLabel, url: editUrl });
                setEditingId(null);
                setEditLabel('');
                setEditUrl('');
            } catch (error) {
                console.error("Error updating link: ", error);
            }
        }
    };

    const handleCancelLinkEdit = () => {
        setEditingId(null);
        setEditLabel('');
        setEditUrl('');
    };

    // === Gallery Handlers ===
    const compressImage = (base64Str: string): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1200;
                const MAX_HEIGHT = 1200;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                // Compress to JPEG with 0.6 quality
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                resolve(compressedBase64);
            };
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsCompressing(true);
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                const compressed = await compressImage(base64);
                setImageSrc(compressed);
                setIsCompressing(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddImage = async () => {
        const finalCategory = isCustomInput ? customCategory : imageCategory;

        if (imageTitle && imageSrc && finalCategory) {
            try {
                const newItem = {
                    title: imageTitle,
                    category: finalCategory,
                    imageUrl: imageSrc,
                    date: new Date().toISOString().split('T')[0]
                };
                await addDoc(collection(db, 'gallery'), newItem);
                // Reset
                setImageTitle('');
                setImageSrc('');
            } catch (error) {
                console.error("Error adding image: ", error);
            }
        }
    };

    const handleDeleteImage = async (id: string) => {
        if (window.confirm('এই ছবিটি মুছে ফেলবেন?')) {
            try {
                await deleteDoc(doc(db, 'gallery', id));
            } catch (error) {
                console.error("Error deleting image: ", error);
            }
        }
    };

    const handleToggleFeatured = async (item: GalleryItem) => {
        try {
            await updateDoc(doc(db, 'gallery', item.id), { featured: !item.featured });
        } catch (error) {
            console.error("Error updating image: ", error);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-header font-bold text-gray-900 dark:text-white">গ্যালারি ম্যানেজার</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">এক্সটার্নাল লিংক এবং গ্যালারির ছবি ম্যানেজ করুন</p>
            </div>

            {/* === Section 1: Gallery Images === */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                        <span className="material-icons mr-2 text-primary">collections</span>
                        গ্যালারি ছবি
                    </h3>
                    <span className="text-sm text-gray-500">{galleryItems.length} টি আইটেম</span>
                </div>

                {/* Upload Area */}
                <div className="bg-gray-50 dark:bg-black/20 rounded-lg p-5 mb-8 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">নতুন ছবি আপলোড করুন</h4>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-4">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">শিরোনাম</label>
                            <input
                                type="text"
                                placeholder="যেমন: সাংস্কৃতিক সন্ধ্যা"
                                value={imageTitle}
                                onChange={(e) => setImageTitle(e.target.value)}
                                className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">ক্যাটাগরি</label>
                            {isCustomInput ? (
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={customCategory}
                                        onChange={(e) => setCustomCategory(e.target.value)}
                                        placeholder="কাস্টম ক্যাটাগরি"
                                        className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-l-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                                    />
                                    <button
                                        onClick={() => setIsCustomInput(false)}
                                        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                                        title="Use Standard Categories"
                                    >
                                        <span className="material-icons text-sm">close</span>
                                    </button>
                                </div>
                            ) : (
                                <select
                                    value={imageCategory}
                                    onChange={(e) => {
                                        if (e.target.value === 'custom_cat_trigger') {
                                            setIsCustomInput(true);
                                            setCustomCategory('');
                                        } else {
                                            setImageCategory(e.target.value);
                                        }
                                    }}
                                    className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                                >
                                    <option value="Event">ইভেন্ট</option>
                                    <option value="Gallery">গ্যালারি</option>
                                    <option value="Community">কমিউনিটি</option>
                                    <option value="Upcoming">আসন্ন</option>
                                    <option value="custom_cat_trigger" className="font-bold text-primary">+ কাস্টম ক্যাটাগরি...</option>
                                </select>
                            )}
                        </div>
                        <div className="md:col-span-5">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">ছবির সোর্স</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="URL পেস্ট করুন..."
                                    value={imageSrc}
                                    onChange={(e) => setImageSrc(e.target.value)}
                                    className="flex-1 bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
                                />
                                <div className="relative">
                                    <input type="file" id="file_upload" accept="image/*" className="hidden" onChange={handleFileUpload} />
                                    <label htmlFor="file_upload" className={`cursor-pointer h-[38px] px-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md flex items-center justify-center text-gray-700 dark:text-gray-200 transition-colors ${isCompressing ? 'opacity-50 cursor-wait' : ''}`} title="Upload File">
                                        <span className="material-icons text-lg">{isCompressing ? 'sync' : 'upload_file'}</span>
                                        {isCompressing && <span className="ml-1 text-[10px] whitespace-nowrap">প্রসেসিং...</span>}
                                    </label>
                                </div>
                                <button
                                    onClick={handleAddImage}
                                    disabled={!imageTitle || !imageSrc || (isCustomInput && !customCategory)}
                                    className="h-[38px] px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-md shadow-sm transition-all"
                                >
                                    যোগ করুন
                                </button>
                            </div>
                        </div>
                    </div>
                    {imageSrc && (
                        <div className="mt-4 p-2 bg-white dark:bg-surface-dark rounded border border-gray-200 dark:border-gray-700 w-fit">
                            <p className="text-xs text-gray-500 mb-1">প্রিভিউ:</p>
                            <img src={imageSrc} alt="Preview" className="h-24 object-contain rounded" />
                        </div>
                    )}
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {galleryItems.map(item => (
                        <div key={item.id} className="group relative aspect-square bg-gray-100 dark:bg-black rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-primary transition-all">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                                <div className="flex justify-between items-start">
                                    <button
                                        onClick={() => handleToggleFeatured(item)}
                                        className={`p-1 rounded-full transition-colors shadow-lg ${item.featured ? 'bg-yellow-400 text-black' : 'bg-black/40 text-white hover:bg-yellow-400 hover:text-black'}`}
                                        title={item.featured ? "Unmark as Featured" : "Mark as Featured"}
                                    >
                                        <span className="material-icons text-sm">{item.featured ? 'star' : 'star_outline'}</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteImage(item.id)}
                                        className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                        title="Delete Image"
                                    >
                                        <span className="material-icons text-sm">close</span>
                                    </button>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase text-primary bg-black/50 px-1 rounded">{item.category}</span>
                                    <p className="text-xs font-medium text-white truncate mt-1" title={item.title}>{item.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* === Section 2: Redirect Links === */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <span className="material-icons mr-2 text-purple-500">link</span>
                    কুইক রিডাইরেক্ট লিংক
                </h3>

                {/* Add New Link Section */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 items-end border-b border-border-light dark:border-border-dark pb-6">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">নতুন লিংক লেবেল</label>
                        <input type="text" placeholder="যেমন: পরীক্ষার রুটিন" value={newLabel} onChange={e => setNewLabel(e.target.value)} className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm" />
                    </div>
                    <div className="flex-[2] w-full">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">গন্তব্য URL</label>
                        <input type="text" placeholder="https://..." value={newUrl} onChange={e => setNewUrl(e.target.value)} className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm" />
                    </div>
                    <button onClick={handleAddLink} className="bg-gray-800 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors w-full md:w-auto h-[38px] flex items-center justify-center">
                        <span className="material-icons text-sm mr-1">add</span> লিংক যোগ করুন
                    </button>
                </div>

                <div className="overflow-x-auto border border-border-light dark:border-border-dark rounded-md">
                    <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                        <thead className="bg-gray-50 dark:bg-[#222]">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-1/4">লেবেল</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-1/2">URL</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-1/4">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark bg-white dark:bg-surface-dark">
                            {links.map(link => (
                                <tr key={link.id}>
                                    {editingId === link.id ? (
                                        // Edit Mode Rows
                                        <>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    value={editLabel}
                                                    onChange={(e) => setEditLabel(e.target.value)}
                                                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    value={editUrl}
                                                    onChange={(e) => setEditUrl(e.target.value)}
                                                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                <button onClick={handleSaveLinkEdit} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 mr-3 inline-flex items-center" title="Save">
                                                    <span className="material-icons text-lg mr-1">check_circle</span> সেভ
                                                </button>
                                                <button onClick={handleCancelLinkEdit} className="text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 inline-flex items-center" title="Cancel">
                                                    <span className="material-icons text-lg mr-1">cancel</span> বাতিল
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        // View Mode Rows
                                        <>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">{link.label}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono truncate max-w-[150px] md:max-w-xs">{link.url}</td>
                                            <td className="px-4 py-3 text-right text-sm whitespace-nowrap">
                                                <button onClick={() => handleEditLinkClick(link)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium mr-3 inline-flex items-center">
                                                    <span className="material-icons text-base mr-1">edit</span> এডিট
                                                </button>
                                                <button onClick={() => handleDeleteLink(link.id)} className="text-red-500 hover:text-red-700 transition-colors font-medium inline-flex items-center">
                                                    <span className="material-icons text-base mr-1">delete</span> মুছুন
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            {links.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                        কোনো রিডাইরেক্ট নেই।
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