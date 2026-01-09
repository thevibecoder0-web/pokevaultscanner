
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CameraScanner from './components/CameraScanner';
import CardItem from './components/CardItem';
import { PokemonCard, AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.SCAN);
  const [collection, setCollection] = useState<PokemonCard[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [lastAddedName, setLastAddedName] = useState('');

  // Load collection from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pokemon_collection');
    if (saved) {
      try {
        setCollection(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse collection", e);
      }
    }
  }, []);

  // Save collection to localStorage
  useEffect(() => {
    localStorage.setItem('pokemon_collection', JSON.stringify(collection));
  }, [collection]);

  const handleCardScanned = (card: PokemonCard) => {
    setCollection(prev => [card, ...prev]);
    setLastAddedName(card.name);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setActiveTab(AppTab.COLLECTION);
  };

  const handleDeleteCard = (id: string) => {
    setCollection(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        count={collection.length}
      />

      <main className="flex-1 overflow-y-auto">
        {activeTab === AppTab.SCAN ? (
          <div className="py-8">
            <CameraScanner onCardScanned={handleCardScanned} />
            <div className="max-w-md mx-auto px-6 mt-8">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-700 leading-relaxed">
                  For best results, place your card on a flat surface with good lighting. The scanner works best with official Pokemon TCG cards.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto p-4 sm:p-8">
            {collection.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-exo font-bold text-gray-900 mb-2">Your collection is empty</h3>
                <p className="text-gray-500 max-w-xs mb-8">Scan your first Pokemon card to start building your professional digital binder.</p>
                <button 
                  onClick={() => setActiveTab(AppTab.SCAN)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  Start Scanning
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {collection.map(card => (
                  <CardItem key={card.id} card={card} onDelete={handleDeleteCard} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Success Toast */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border-2 border-green-400">
          <div className="bg-white/20 p-1 rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-bold text-sm tracking-wide">Added <span className="uppercase">{lastAddedName}</span> to your collection!</p>
        </div>
      </div>

      <footer className="bg-gray-50 border-t border-gray-100 py-6 text-center">
        <p className="text-xs text-gray-400 font-medium">Powered by Gemini AI • 2024 Pokemon Card Scanner</p>
      </footer>
    </div>
  );
};

export default App;
