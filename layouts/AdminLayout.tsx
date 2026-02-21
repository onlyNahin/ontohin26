import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
  toggleTheme: () => void;
  darkMode: boolean;
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, toggleTheme, darkMode, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex flex-col hidden md:flex z-20">
        <div className="h-16 flex items-center px-6 border-b border-border-light dark:border-border-dark">
          <span className="text-xl font-header font-bold tracking-wider text-primary">অন্তহীন ২৬</span>
          <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary dark:text-primary dark:bg-primary/20">অ্যাডমিন</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <NavItem to="/admin/dashboard" icon="dashboard" label="ড্যাশবোর্ড" />
          <NavItem to="/admin/inbox" icon="inbox" label="ইভেন্ট ইনবক্স" />
          <NavItem to="/admin/form-inbox" icon="mark_email_read" label="ফর্ম রেসপন্স" />
          <NavItem to="/admin/forms" icon="dynamic_form" label="কাস্টম ফর্ম বিল্ডার" />
          <NavItem to="/admin/events" icon="event_note" label="ইভেন্ট ম্যানেজার" />
          <NavItem to="/admin/announcements" icon="campaign" label="ঘোষণা ম্যানেজার" />
          <NavItem to="/admin/gallery" icon="collections" label="গ্যালারি ও রিডাইরেক্ট" />
          <NavItem to="/admin/identity" icon="branding_watermark" label="সাইট পরিচিতি" />
          <NavItem to="/admin/about" icon="info" label="আমাদের সম্পর্কে" />
          <NavItem to="/admin/history" icon="history_edu" label="ইতিহাস" />
          <NavItem to="/admin/footer" icon="table_rows" label="ফুটার" />
          
          <div className="pt-6 mt-6 border-t border-border-light dark:border-border-dark">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">সিস্টেম</h3>
            <NavItem to="/admin/settings" icon="settings" label="সেটিংস" />
            
            <Link 
              to="/" 
              className="w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <span className="material-icons text-xl mr-3 text-gray-400 group-hover:text-primary dark:text-gray-500">public</span>
              সাইটে ফিরে যান
            </Link>

            <button 
              onClick={handleLogout}
              className="w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <span className="material-icons text-xl mr-3 text-gray-400 group-hover:text-gray-600 dark:text-gray-500">logout</span>
              লগআউট
            </button>
          </div>
        </nav>
        <div className="border-t border-border-light dark:border-border-dark p-4">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-gray-700 flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">অ্যাডমিন ইউজার</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">admin@ontohin26.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="md:hidden flex items-center justify-between h-16 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark px-4">
          <span className="text-lg font-header font-bold text-primary">অন্তহীন ২৬</span>
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
            <span className="material-icons">menu</span>
          </button>
        </header>

        <header className="hidden md:flex h-16 bg-background-light dark:bg-background-dark items-center justify-between px-8 border-b border-transparent">
          <div>
             {/* Header content varies by page */}
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 transition"
            >
              <span className="material-icons">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 transition relative">
              <span className="material-icons">notifications</span>
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-white dark:ring-background-dark"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: string; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all
      ${isActive 
        ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-white border-l-4 border-primary' 
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary'}
    `}
  >
    {({ isActive }) => (
        <>
            <span className={`material-icons text-xl mr-3 ${isActive ? 'text-primary dark:text-white' : 'text-gray-400 group-hover:text-primary dark:text-gray-500'}`}>{icon}</span>
            {label}
        </>
    )}
  </NavLink>
);