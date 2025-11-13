
import React from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { CreditsIcon } from './icons/IconComponents';
import { APP_NAME } from '../constants';

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { state } = useGlobalState();
  const { currentUser } = state;

  return (
    <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-gray-400 focus:outline-none md:hidden mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
        <h1 className="text-xl font-bold text-white md:hidden">{APP_NAME}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {currentUser && (
          <>
            <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1.5 rounded-full text-sm">
                <CreditsIcon />
                <span className="font-semibold text-white">
                    {currentUser.role === 'admin' ? 'Unlimited' : `${currentUser.credits} Credits`}
                </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center font-bold text-white">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="font-semibold text-white text-sm">{currentUser.name}</p>
                <p className="text-gray-400 text-xs">{currentUser.email}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
