import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sword, Shield, Zap, Target, Users } from 'lucide-react';
import ToneSelector from '../components/core/ToneSelector';
import StyleUpload from '../components/core/StyleUpload';
import { ToneType } from '../types';
import { createConversation } from '../services/api';
import { mainCharacter, characters } from '../data/characters';
import toast from 'react-hot-toast';

export default function SetupPage() {
  const navigate = useNavigate();
  const [opponentPosition, setOpponentPosition] = useState('');
  const [userPosition, setUserPosition] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [tone, setTone] = useState<ToneType>('calm-collected');
  const [customToneDescription, setCustomToneDescription] = useState('');
  const [styleExamples, setStyleExamples] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCharacters, setShowCharacters] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const selectedCharacter = characters.find(c => c.tone === tone);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartConversation = async () => {
    if (!opponentPosition.trim() || !userPosition.trim()) {
      toast.error('⚔️ Fill in all battle positions, warrior!');
      return;
    }

    if (tone === 'custom' && !customToneDescription.trim()) {
      toast.error('⚔️ Describe your custom style, warrior!');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Creating conversation with:', {
        opponentPosition,
        userPosition,
        additionalContext,
        tone,
        customToneDescription: tone === 'custom' ? customToneDescription : undefined,
        styleExamples,
        firstOpponentMessage: ''
      });
      
      const conversation = await createConversation({
        opponentPosition,
        userPosition,
        additionalContext,
        tone,
        customToneDescription: tone === 'custom' ? customToneDescription : undefined,
        styleExamples,
        firstOpponentMessage: '', // Empty, will be added on chat page
      });
      
      console.log('Conversation created:', conversation);
      navigate(`/chat/${conversation.id}`);
      toast.success('⚔️ TO BATTLE!');
    } catch (error) {
      toast.error('💥 Battle preparations failed! Try again, warrior!');
      console.error('Error creating conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Parallax Background */}
      <div 
        className="fixed bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/KBW-Background.png")',
          transform: `translateY(${-scrollY * 0.15}px)`,
          willChange: 'transform',
          top: '-20%',
          left: '0',
          right: '0',
          bottom: '-20%',
          width: '100%',
          height: '140%'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      {/* Foreground Content Container */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
        {/* Epic Header with Mascot */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <img 
                src={mainCharacter.image} 
                alt="Keyboard Warrior"
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-yellow-400 shadow-2xl transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-black mt-4 text-yellow-400">
              KEYBOARD WARRIOR
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mt-2 font-bold">
              ⚔️ Master of Digital Debates ⚔️
            </p>
            <p className="text-md text-gray-400 mt-1 italic">
              Where words are weapons and wit wins wars!
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Battle Setup Card with enhanced depth */}
          <div className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/30 p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-yellow-400 mr-3 animate-bounce" />
              <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text">
                PREPARE FOR BATTLE
              </h2>
            </div>
            
            <div className="space-y-6">
              {/* Opponent's Position */}
              <div className="group">
                <label className="flex items-center text-sm font-bold text-red-400 mb-2 uppercase tracking-wider">
                  <Target className="w-4 h-4 mr-2" />
                  Enemy's Fortress (Their Position)
                </label>
                <textarea
                  value={opponentPosition}
                  onChange={(e) => setOpponentPosition(e.target.value)}
                  placeholder="What blasphemy do they speak? What hill do they foolishly die on?"
                  className="w-full px-4 py-3 bg-gray-800/50 border-2 border-red-500/30 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none group-hover:border-red-400/50 transition-colors"
                  rows={3}
                />
              </div>

              {/* User's Position */}
              <div className="group">
                <label className="flex items-center text-sm font-bold text-blue-400 mb-2 uppercase tracking-wider">
                  <Sword className="w-4 h-4 mr-2" />
                  Your Battle Stance (Your Position)
                </label>
                <textarea
                  value={userPosition}
                  onChange={(e) => setUserPosition(e.target.value)}
                  placeholder="Your righteous cause! The truth you shall defend with honor!"
                  className="w-full px-4 py-3 bg-gray-800/50 border-2 border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none group-hover:border-blue-400/50 transition-colors"
                  rows={3}
                />
              </div>

              {/* Additional Context */}
              <div className="group">
                <label className="flex items-center text-sm font-bold text-purple-400 mb-2 uppercase tracking-wider">
                  <Users className="w-4 h-4 mr-2" />
                  Battlefield Intel <span className="text-gray-500 text-xs ml-2">(Optional)</span>
                </label>
                <textarea
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  placeholder="The lore behind this epic confrontation... (e.g., 'This sacred war began when they claimed pineapple belongs on pizza...')"
                  className="w-full px-4 py-3 bg-gray-800/50 border-2 border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none group-hover:border-purple-400/50 transition-colors"
                  rows={3}
                />
              </div>

              {/* Character Selection */}
              <div className="border-2 border-yellow-400/30 rounded-xl p-6 bg-gradient-to-br from-yellow-900/10 to-amber-900/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-yellow-400 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    CHOOSE YOUR STYLE
                  </h3>
                  {selectedCharacter && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Selected:</span>
                      <span className="font-bold" style={{ color: selectedCharacter.color }}>
                        {selectedCharacter.name}
                      </span>
                    </div>
                  )}
                </div>
                <ToneSelector
                  value={tone}
                  onChange={(t) => setTone(t as ToneType)}
                />
                {tone === 'custom' && (
                  <div className="mt-4">
                    <label className="block text-sm font-bold text-yellow-300 mb-2">
                      Describe Your Custom Style
                    </label>
                    <textarea
                      value={customToneDescription}
                      onChange={(e) => setCustomToneDescription(e.target.value)}
                      placeholder="Describe your unique style... (e.g., 'Be philosophical and thought-provoking with a touch of humor')"
                      className="w-full px-4 py-3 bg-gray-800/50 border-2 border-yellow-500/30 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Style Examples */}
              <div className="border-2 border-indigo-500/30 rounded-xl p-6 bg-gradient-to-br from-indigo-900/10 to-purple-900/10">
                <h3 className="text-xl font-bold text-indigo-400 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  TRAINING DATA (Optional)
                </h3>
                <StyleUpload
                  examples={styleExamples}
                  onChange={setStyleExamples}
                />
              </div>

              {/* Battle Button */}
              <button
                onClick={handleStartConversation}
                disabled={isLoading || !opponentPosition.trim() || !userPosition.trim()}
                className="w-full relative group overflow-hidden rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 opacity-100 group-hover:opacity-90 transition-opacity animate-gradient-x"></div>
                <div className="relative px-8 py-4 bg-gradient-to-r from-red-600/90 via-yellow-500/90 to-red-600/90 rounded-xl border-2 border-yellow-400/50 group-hover:border-yellow-300 transition-colors">
                  <span className="flex items-center justify-center text-2xl font-black text-white group-hover:scale-110 transition-transform">
                    {isLoading ? (
                      <>
                        <Sword className="w-6 h-6 mr-2 animate-spin" />
                        SUMMONING POWER...
                      </>
                    ) : (
                      <>
                        <Sword className="w-6 h-6 mr-2" />
                        ENTER THE ARENA
                        <Shield className="w-6 h-6 ml-2" />
                      </>
                    )}
                  </span>
                </div>
              </button>

              {/* Epic Footer Text */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-500 italic">
                  "In the arena of ideas, only the strongest arguments survive!"
                </p>
              </div>
            </div>
          </div>

          {/* Character Showcase */}
          <button
            onClick={() => setShowCharacters(!showCharacters)}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl text-purple-300 font-bold hover:from-purple-600/30 hover:to-pink-600/30 transition-colors"
          >
            {showCharacters ? 'Hide' : 'View'} All Warriors
          </button>

          {showCharacters && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
              {characters.map((character) => (
                <div
                  key={character.id}
                  className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-colors"
                >
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-bold text-sm" style={{ color: character.color }}>
                    {character.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {character.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}