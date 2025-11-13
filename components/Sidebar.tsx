import React from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { APP_NAME } from '../constants';
import { DashboardIcon, GenerateIcon, CreditsIcon, UsersIcon, PaymentsIcon, SettingsIcon, LogoutIcon } from './icons/IconComponents';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const NavLink: React.FC<{
  // Fix: Changed type from JSX.Element to React.ReactNode to resolve namespace issue.
  icon: React.ReactNode;
  label: string;
  page: string;
}> = ({ icon, label, page }) => {
    const { state, setActivePage } = useGlobalState();
    const isActive = state.activePage === page;
    return (
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); setActivePage(page); }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-brand-purple text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </a>
    );
};


const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { state, logout } = useGlobalState();
  const { currentUser } = state;
  const isAdmin = currentUser?.role === 'admin';

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleSidebar}></div>
      <aside className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 p-4 transform transition-transform z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:h-screen md:flex md:flex-col`}>
        <div className="flex items-center justify-between pb-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">{APP_NAME}</h1>
          <button onClick={toggleSidebar} className="text-gray-400 focus:outline-none md:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <nav className="flex-grow mt-6 space-y-2">
            {isAdmin ? (
                <>
                    <p className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wider">Admin Menu</p>
                    <NavLink icon={<DashboardIcon />} label="Dashboard" page="dashboard" />
                    <NavLink icon={<UsersIcon />} label="User Management" page="users" />
                    <NavLink icon={<PaymentsIcon />} label="Payment Requests" page="payments" />
                    <NavLink icon={<SettingsIcon />} label="Settings" page="settings" />
                </>
            ) : (
                <>
                    <p className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wider">User Menu</p>
                    <NavLink icon={<GenerateIcon />} label="Generate Image" page="generate" />
                    <NavLink icon={<CreditsIcon />} label="Buy Credits" page="credits" />
                </>
            )}
        </nav>

        <div className="mt-auto">
            <a
                href="#"
                onClick={(e) => { e.preventDefault(); logout(); }}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-200"
            >
                <LogoutIcon />
                <span className="font-medium">Logout</span>
            </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;