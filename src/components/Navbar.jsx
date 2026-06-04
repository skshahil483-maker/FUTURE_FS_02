import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Plus, Clock } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  // Get Page Title from Pathname
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/leads') return 'Lead Management';
    if (path === '/add-lead') return 'Add New Lead';
    if (path.startsWith('/leads/')) return 'Lead Details';
    return 'Mini CRM';
  };

  const getTodayDate = () => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between shadow-xs sticky top-0 z-30">
      {/* Page Title & Breadcrumb (Adjust margin on mobile to not overlap hamburger button) */}
      <div className="pl-12 lg:pl-0">
        <h1 className="text-xl font-bold text-slate-800 m-0 leading-none">
          {getPageTitle()}
        </h1>
        <p className="text-xs text-slate-400 mt-1 hidden md:block">
          Manage, track, and convert your pipeline
        </p>
      </div>

      {/* Right section: Date & Action */}
      <div className="flex items-center gap-4">
        {/* Date Display */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-xs font-medium">
          <Clock size={14} className="text-slate-400" />
          <span>{getTodayDate()}</span>
        </div>

        {/* Quick Add Lead Link (Hidden on Add Lead page) */}
        {location.pathname !== '/add-lead' && (
          <Link
            to="/add-lead"
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <Plus size={14} />
            <span className="hidden md:inline">New Lead</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
