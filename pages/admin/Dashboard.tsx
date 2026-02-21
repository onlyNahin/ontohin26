import React from 'react';
import { Event, RedirectLink } from '../../types';
import { Link } from 'react-router-dom';

interface DashboardProps {
    events: Event[];
    redirectLinks: RedirectLink[];
}

export const Dashboard: React.FC<DashboardProps> = ({ events, redirectLinks }) => {
    // Logic to calculate stats
    const totalEvents = events.length;
    const publishedEvents = events.filter(e => e.status === 'Published').length;
    const linksCount = redirectLinks.length;
    
    // Mock upcoming events for display (simple sort by date string)
    const upcomingEvents = [...events]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-header font-bold text-gray-900 dark:text-white">ড্যাশবোর্ড</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">স্বাগতম, অ্যাডমিন। আজ যা ঘটছে।</p>
                </div>
                <div className="text-left sm:text-right">
                     <p className="text-sm font-medium text-gray-900 dark:text-white bg-surface-light dark:bg-surface-dark px-3 py-1 rounded-md inline-block border border-border-light dark:border-border-dark">
                        {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                     </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardStat title="মোট ইভেন্ট" value={totalEvents} icon="event" color="text-blue-500" bg="bg-blue-500/10" trend="+২ এই সপ্তাহে" />
                <DashboardStat title="প্রকাশিত" value={publishedEvents} icon="check_circle" color="text-green-500" bg="bg-green-500/10" trend="সক্রিয়" />
                <DashboardStat title="গ্যালারি লিংক" value={linksCount} icon="link" color="text-purple-500" bg="bg-purple-500/10" trend="রিডাইরেক্ট" />
                <DashboardStat title="মোট ভিউ" value="১২.৪হাজার" icon="visibility" color="text-primary" bg="bg-primary/10" trend="+১২% গত মাসের তুলনায়" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Events / Activity */}
                <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm border border-border-light dark:border-border-dark p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">আসন্ন ইভেন্টসমূহ</h3>
                        <Link to="/admin/events" className="text-primary text-sm font-medium hover:underline">সব দেখুন</Link>
                    </div>
                    <div className="space-y-4">
                        {upcomingEvents.map(event => (
                            <div key={event.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-black/20 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                                <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                                    {event.imageUrl ? (
                                        <img src={event.imageUrl} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                                            <span className="material-icons text-xl">event</span>
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4 flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{event.title}</h4>
                                    <div className="flex items-center text-xs text-gray-500 mt-1 truncate">
                                        <span className="material-icons text-[10px] mr-1">calendar_today</span>
                                        {event.date} • {event.time}
                                    </div>
                                </div>
                                <span className={`flex-shrink-0 px-2 py-1 text-xs rounded-full ${event.status === 'Published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                                    {event.status === 'Published' ? 'প্রকাশিত' : 'খসড়া'}
                                </span>
                            </div>
                        ))}
                        {upcomingEvents.length === 0 && (
                            <div className="text-center py-8">
                                <span className="material-icons text-gray-300 text-4xl mb-2">event_busy</span>
                                <p className="text-gray-500 text-sm">কোনো ইভেন্ট নেই।</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions & System Info */}
                <div className="space-y-6">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm border border-border-light dark:border-border-dark p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">দ্রুত অ্যাকশন</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/admin/events" className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-black/20 hover:bg-primary/10 hover:text-primary transition-colors group text-center border border-transparent hover:border-primary/20">
                                <span className="material-icons text-2xl text-gray-400 group-hover:text-primary mb-2 transition-colors">add_circle</span>
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">নতুন ইভেন্ট</span>
                            </Link>
                            <Link to="/admin/gallery" className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-black/20 hover:bg-primary/10 hover:text-primary transition-colors group text-center border border-transparent hover:border-primary/20">
                                <span className="material-icons text-2xl text-gray-400 group-hover:text-primary mb-2 transition-colors">add_link</span>
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">লিংক যোগ করুন</span>
                            </Link>
                            <Link to="/admin/identity" className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-black/20 hover:bg-primary/10 hover:text-primary transition-colors group text-center border border-transparent hover:border-primary/20">
                                <span className="material-icons text-2xl text-gray-400 group-hover:text-primary mb-2 transition-colors">palette</span>
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">কাস্টমাইজ</span>
                            </Link>
                             <Link to="/admin/settings" className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-black/20 hover:bg-primary/10 hover:text-primary transition-colors group text-center border border-transparent hover:border-primary/20">
                                <span className="material-icons text-2xl text-gray-400 group-hover:text-primary mb-2 transition-colors">settings</span>
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">সেটিংস</span>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary to-red-900 rounded-lg shadow-lg p-6 text-white relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-icons text-6xl">dns</span>
                        </div>
                        <h3 className="text-lg font-bold mb-4 relative z-10">সিস্টেম স্ট্যাটাস</h3>
                        <div className="space-y-4 text-sm relative z-10">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="opacity-90">সার্ভার লোড</span>
                                    <span className="font-mono font-bold">১২%</span>
                                </div>
                                <div className="w-full bg-black/30 rounded-full h-1.5">
                                    <div className="bg-white h-1.5 rounded-full" style={{ width: '12%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="opacity-90">স্টোরেজ</span>
                                    <span className="font-mono font-bold">৪৫%</span>
                                </div>
                                 <div className="w-full bg-black/30 rounded-full h-1.5">
                                    <div className="bg-white h-1.5 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                            </div>
                            <div className="pt-2 flex items-center text-xs font-medium bg-white/10 w-fit px-2 py-1 rounded">
                                <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                                সব সিস্টেম সচল
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardStat = ({ title, value, icon, color, bg, trend }: any) => (
    <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-lg shadow-sm border border-border-light dark:border-border-dark flex flex-col justify-between h-full hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
            </div>
            <div className={`p-2 rounded-lg ${bg} ${color}`}>
                <span className="material-icons text-xl">{icon}</span>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center text-xs">
            <span className="text-green-600 dark:text-green-400 font-bold mr-1">{trend}</span>
            <span className="text-gray-400"></span>
        </div>
    </div>
);