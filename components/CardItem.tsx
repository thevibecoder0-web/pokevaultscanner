
import React from 'react';
import { PokemonCard } from '../types';

interface CardItemProps {
  card: PokemonCard;
  onDelete?: (id: string) => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onDelete }) => {
  const getTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('fire')) return 'bg-orange-500';
    if (t.includes('water')) return 'bg-blue-500';
    if (t.includes('grass')) return 'bg-green-500';
    if (t.includes('lightning') || t.includes('electric')) return 'bg-yellow-400';
    if (t.includes('psychic')) return 'bg-purple-500';
    if (t.includes('fighting')) return 'bg-red-800';
    if (t.includes('darkness') || t.includes('dark')) return 'bg-gray-800';
    if (t.includes('metal') || t.includes('steel')) return 'bg-gray-400';
    if (t.includes('fairy')) return 'bg-pink-400';
    if (t.includes('dragon')) return 'bg-amber-600';
    return 'bg-gray-500';
  };

  return (
    <div className="relative group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Card Header Info */}
      <div className={`h-2 ${getTypeColor(card.type)}`} />
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-exo font-bold text-xl text-gray-900 leading-tight uppercase">{card.name}</h3>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.stage} • {card.type}</p>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-[10px] font-bold text-red-600 uppercase">HP</span>
            <span className="text-xl font-exo font-extrabold text-red-600">{card.hp}</span>
          </div>
        </div>

        {card.imageUrl && (
          <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-gray-50 flex items-center justify-center border border-gray-100 shadow-inner">
             <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Attacks */}
        <div className="space-y-3 mt-2">
          {card.attacks?.map((attack, i) => (
            <div key={i} className="border-b border-gray-50 pb-2 last:border-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                   <div className="flex space-x-0.5">
                    {attack.cost?.map((c, idx) => (
                      <div key={idx} className={`w-3 h-3 rounded-full ${getTypeColor(c)}`} />
                    ))}
                   </div>
                   <span className="font-exo font-bold text-sm text-gray-800">{attack.name}</span>
                </div>
                <span className="font-exo font-bold text-sm text-gray-900">{attack.damage}</span>
              </div>
              {attack.description && (
                <p className="text-[10px] text-gray-500 mt-0.5 leading-tight italic">{attack.description}</p>
              )}
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100">
          <div className="text-center">
            <p className="text-[8px] font-bold text-gray-400 uppercase">Weakness</p>
            <p className="text-[10px] font-bold">{card.weakness || 'None'}</p>
          </div>
          <div className="text-center border-x border-gray-50">
            <p className="text-[8px] font-bold text-gray-400 uppercase">Resistance</p>
            <p className="text-[10px] font-bold">{card.resistance || 'None'}</p>
          </div>
          <div className="text-center">
            <p className="text-[8px] font-bold text-gray-400 uppercase">Retreat</p>
            <p className="text-[10px] font-bold">{card.retreatCost ? '★'.repeat(card.retreatCost) : '0'}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-between items-end border-t border-gray-50 pt-2">
          <div>
            <p className="text-[8px] text-gray-400 font-bold uppercase">{card.set}</p>
            <p className="text-[8px] text-gray-500 italic truncate max-w-[150px]">{card.description}</p>
          </div>
          <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">{card.rarity}</span>
        </div>
      </div>

      {onDelete && (
        <button 
          onClick={() => onDelete(card.id)}
          className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-red-500 hover:text-white rounded-full text-gray-400 transition-colors opacity-0 group-hover:opacity-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CardItem;
