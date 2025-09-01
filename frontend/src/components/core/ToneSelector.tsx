import React from 'react';
import { ToneType } from '../../types';
import { characters } from '../../data/characters';
import clsx from 'clsx';

interface ToneSelectorProps {
  value: ToneType;
  onChange: (tone: ToneType) => void;
}

const ToneSelector: React.FC<ToneSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <label className="block text-lg font-bold text-gray-800">
        Choose Your Style
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {characters.map((character) => (
          <button
            key={character.id}
            type="button"
            onClick={() => onChange(character.tone as ToneType)}
            className={clsx(
              'relative group rounded-xl overflow-hidden transition-all transform hover:scale-105',
              value === character.tone
                ? 'ring-4 ring-offset-2 shadow-xl'
                : 'hover:shadow-lg'
            )}
            style={{
              '--ring-color': character.color,
              'ringColor': character.color
            } as React.CSSProperties}
          >
            <div className={clsx(
              'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity',
              character.bgGradient
            )} />
            
            <div className="relative p-3 bg-white dark:bg-gray-800">
              <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="text-center">
                <div 
                  className="font-bold text-sm mb-1"
                  style={{ color: character.color }}
                >
                  {character.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {character.description}
                </div>
              </div>
              
              {value === character.tone && (
                <div 
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg"
                  style={{ backgroundColor: character.color }}
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToneSelector;