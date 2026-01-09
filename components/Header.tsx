
import React from 'react';
import { AppTab } from '../types';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  count: number;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, count }) => {
  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-100 px-4 pt-4 pb-0">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-200">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <circle cx="12" cy="12" r="5"/>
            </svg>
          </div>
          <div>
            <h1 className="font-exo font-bold text-2xl text-gray-900 tracking-tight">PokeScanner <span className="text-red-600">Pro</span></h1>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Gemini Powered Collection</p>
          </div>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab(AppTab.SCAN)}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === AppTab.SCAN 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Scanner
          </button>
          <button
            onClick={() => setActiveTab(AppTab.COLLECTION)}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === AppTab.COLLECTION 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Collection
            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-md text-[10px] font-extrabold">{count}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
