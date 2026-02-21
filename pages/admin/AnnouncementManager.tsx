import React, { useState } from 'react';
import { Announcement } from '../../types';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface AnnouncementManagerProps {
  announcements: Announcement[];
}

export const AnnouncementManager: React.FC<AnnouncementManagerProps> = ({ announcements }) => {
  const safeAnnouncements = announcements || [];
  const [filterPriority, setFilterPriority] = useState<string>('All Priorities');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Partial<Announcement>>({});
  const [isEditing, setIsEditing] = useState(false);

  const filteredAnnouncements = safeAnnouncements.filter(announcement => {
    const matchesPriority = filterPriority === 'All Priorities' || announcement.priority === filterPriority;
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই ঘোষণাটি মুছে ফেলতে চান?')) {
      try {
        await deleteDoc(doc(db, 'announcements', id));
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("ঘোষণা মুছতে সমস্যা হয়েছে।");
      }
    }
  };

  const handleEdit = (announcement: Announcement, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentAnnouncement(announcement);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentAnnouncement({
      priority: 'Normal',
      date: new Date().toISOString().split('T')[0],
      content: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentAnnouncement.id) {
        const announcementRef = doc(db, 'announcements', currentAnnouncement.id);
        const { id, ...data } = currentAnnouncement;
        await updateDoc(announcementRef, data);
      } else {
        await addDoc(collection(db, 'announcements'), currentAnnouncement);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("ঘোষণা সেভ করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-header font-bold text-gray-900 dark:text-white">ঘোষণা ম্যানেজমেন্ট</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">আপনার ঘোষণা এবং নোটিশগুলি পরিচালনা করুন</p>
        </div>
        <button
          onClick={handleAddNew}
          className="mt-4 md:mt-0 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded shadow-lg shadow-primary/30 flex items-center transition-all"
        >
          <span className="material-icons text-sm mr-2">add</span>
          নতুন ঘোষণা তৈরি করুন
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="মোট ঘোষণা" value={safeAnnouncements.length.toString()} icon="campaign" color="text-primary" bg="bg-primary/10" />
        <StatCard label="জরুরি" value={safeAnnouncements.filter(a => a.priority === 'High').length.toString()} icon="priority_high" color="text-red-500" bg="bg-red-500/10" />
        <StatCard label="সাধারণ" value={safeAnnouncements.filter(a => a.priority === 'Normal').length.toString()} icon="notifications" color="text-blue-500" bg="bg-blue-500/10" />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-icons text-gray-400 text-lg">search</span>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
            placeholder="ঘোষণার শিরোনাম দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-surface-dark text-gray-700 dark:text-gray-200"
          >
            <option value="All Priorities">সব অগ্রাধিকার</option>
            <option value="High">জরুরি</option>
            <option value="Normal">সাধারণ</option>
            <option value="Low">কম গুরুত্বপূর্ণ</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-light dark:bg-surface-dark shadow-sm border border-border-light dark:border-border-dark rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
            <thead className="bg-gray-50 dark:bg-[#222]">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">শিরোনাম</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">তারিখ</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">অগ্রাধিকার</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {filteredAnnouncements.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {announcement.imageUrl ? (
                          <img className="h-10 w-10 rounded object-cover" src={announcement.imageUrl} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                            <span className="material-icons text-sm">campaign</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{announcement.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{announcement.content}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">{announcement.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={announcement.priority} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button type="button" onClick={(e) => handleEdit(announcement, e)} className="text-primary hover:text-primary-hover mr-3 transition-colors" title="Edit">
                      <span className="material-icons text-base">edit</span>
                    </button>
                    <button type="button" onClick={(e) => handleDelete(announcement.id, e)} className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors" title="Delete">
                      <span className="material-icons text-base">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-surface-dark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div className="bg-white dark:bg-surface-dark px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                  {isEditing ? 'ঘোষণা সম্পাদনা' : 'নতুন ঘোষণা তৈরি'}
                </h3>
                <form id="announcementForm" onSubmit={handleSave} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">শিরোনাম</label>
                    <input required type="text" value={currentAnnouncement.title || ''} onChange={e => setCurrentAnnouncement({ ...currentAnnouncement, title: e.target.value })} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">তারিখ</label>
                    <input required type="date" value={currentAnnouncement.date || ''} onChange={e => setCurrentAnnouncement({ ...currentAnnouncement, date: e.target.value })} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-background-dark text-gray-900 dark:text-white sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">বিবরণ</label>
                    <textarea required rows={4} value={currentAnnouncement.content || ''} onChange={e => setCurrentAnnouncement({ ...currentAnnouncement, content: e.target.value })} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-background-dark text-gray-900 dark:text-white sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">অগ্রাধিকার</label>
                    <select value={currentAnnouncement.priority} onChange={e => setCurrentAnnouncement({ ...currentAnnouncement, priority: e.target.value as any })} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-background-dark text-gray-900 dark:text-white sm:text-sm">
                      <option value="High">জরুরি</option>
                      <option value="Normal">সাধারণ</option>
                      <option value="Low">কম গুরুত্বপূর্ণ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ছবির URL (ঐচ্ছিক)</label>
                    <input type="text" value={currentAnnouncement.imageUrl || ''} onChange={e => setCurrentAnnouncement({ ...currentAnnouncement, imageUrl: e.target.value })} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-background-dark text-gray-900 dark:text-white sm:text-sm" />
                  </div>
                </form>
              </div>
              <div className="bg-gray-50 dark:bg-background-dark px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="submit" form="announcementForm" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm">
                  সেভ করুন
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-surface-dark text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon, color, bg }: { label: string; value: string; icon: string; color: string; bg: string }) => (
  <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-3xl font-display font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${bg} ${color}`}>
      <span className="material-icons">{icon}</span>
    </div>
  </div>
);

const PriorityBadge = ({ priority }: { priority: string }) => {
  let classes = "";
  let label = priority;

  if (priority === 'High') {
    classes = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800";
    label = "জরুরি";
  }
  else if (priority === 'Normal') {
    classes = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    label = "সাধারণ";
  }
  else {
    classes = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
    label = "কম গুরুত্বপূর্ণ";
  }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${classes}`}>
      {label}
    </span>
  );
};
