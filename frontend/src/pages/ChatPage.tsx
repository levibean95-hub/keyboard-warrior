import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Copy, Check, ArrowLeft, Sword, Shield, User, Edit2, Save, X, Zap, Target, MessageSquare, Palette } from 'lucide-react';
import { getConversation, sendMessage, updateConversation, changeConversationTone, Message, Conversation } from '../services/api';
import { characters, mainCharacter } from '../data/characters';
import { ToneType, TONE_DESCRIPTIONS } from '../types';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [opponentMessage, setOpponentMessage] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null);
  const [generatedResponses, setGeneratedResponses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [isChangingStyle, setIsChangingStyle] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  // Edit mode states
  const [isEditingContext, setIsEditingContext] = useState(false);
  const [editedOpponentPosition, setEditedOpponentPosition] = useState('');
  const [editedUserPosition, setEditedUserPosition] = useState('');
  const [editedAdditionalContext, setEditedAdditionalContext] = useState('');

  const selectedCharacter = conversation ? characters.find(c => c.tone === (conversation.currentTone || conversation.tone)) : null;

  useEffect(() => {
    if (conversationId) {
      loadConversation();
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadConversation = async () => {
    try {
      const data = await getConversation(conversationId!);
      setConversation(data);
      setMessages(data.messages || []);
      
      // Initialize edit fields
      setEditedOpponentPosition(data.opponentPosition || '');
      setEditedUserPosition(data.userPosition || '');
      setEditedAdditionalContext(data.additionalContext || '');
      
      // No longer pre-filling first message since we're not collecting it on setup page
      setIsFirstMessage(false);
    } catch (error) {
      toast.error('⚔️ Failed to load battle data!');
      navigate('/');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendOpponentMessage = async () => {
    if (!opponentMessage.trim() || !conversationId) return;

    setIsLoading(true);
    try {
      const response = await sendMessage(conversationId, {
        role: 'opponent',
        content: opponentMessage,
      });
      setMessages(response.messages);
      setGeneratedResponses(response.generatedResponses);
      setOpponentMessage('');
      setSelectedResponse(null);
      toast.success('⚔️ Counter-attacks ready!');
    } catch (error) {
      toast.error('💥 Failed to generate counter-attacks!');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectResponse = async (index: number) => {
    if (!conversationId || generatedResponses.length === 0) return;

    setSelectedResponse(index);
    const selectedContent = generatedResponses[index];

    try {
      const response = await sendMessage(conversationId, {
        role: 'user',
        content: selectedContent || '',
      });

      setMessages(response.messages);
      setGeneratedResponses([]);
      setSelectedResponse(null);
      toast.success('💥 Strike delivered!');
    } catch (error) {
      toast.error('Failed to deliver strike!');
      console.error('Error:', error);
    }
  };

  const handleCopyResponse = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('📋 Copied to arsenal!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSaveContext = async () => {
    if (!conversationId) return;
    
    try {
      const updated = await updateConversation(conversationId, {
        opponentPosition: editedOpponentPosition,
        userPosition: editedUserPosition,
        additionalContext: editedAdditionalContext,
      });
      
      setConversation(updated);
      setIsEditingContext(false);
      toast.success('🎯 Battle strategy updated!');
    } catch (error) {
      toast.error('Failed to update strategy!');
      console.error('Error:', error);
    }
  };

  const handleCancelEdit = () => {
    if (conversation) {
      setEditedOpponentPosition(conversation.opponentPosition || '');
      setEditedUserPosition(conversation.userPosition || '');
      setEditedAdditionalContext(conversation.additionalContext || '');
    }
    setIsEditingContext(false);
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
        {/* Dark overlay with blur for depth */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      {/* Foreground Content Container */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
        {/* Epic Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="mr-4 p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all transform hover:scale-110 border border-gray-700"
            >
              <ArrowLeft className="w-5 h-5 text-yellow-400" />
            </button>
            <div className="flex items-center">
              {selectedCharacter && (
                <img 
                  src={selectedCharacter.image} 
                  alt={selectedCharacter.name}
                  className="w-12 h-12 rounded-full mr-3 border-2"
                  style={{ borderColor: selectedCharacter.color }}
                />
              )}
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
                  BATTLE IN PROGRESS
                </h1>
                {selectedCharacter && (
                  <p className="text-sm text-gray-400">
                    Fighting as: <span className="font-bold" style={{ color: selectedCharacter.color }}>
                      {selectedCharacter.name}
                    </span>
                    {conversation?.tone !== conversation?.currentTone && (
                      <span className="ml-2 text-xs text-purple-400">
                        (Style changed from {characters.find(c => c.tone === conversation?.tone)?.name})
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <img 
              src={mainCharacter.image} 
              alt="Keyboard Warrior"
              className="w-10 h-10 rounded-full border-2 border-yellow-400 animate-float"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Messages */}
          <div className="lg:col-span-2">
            <div className="card-battle h-[700px] flex flex-col">
              {/* Context Display/Edit Section */}
              {conversation && (
                <div className="border-b border-purple-500/30 p-4">
                  {isEditingContext ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-red-400 mb-1 uppercase tracking-wider">
                          <Target className="w-3 h-3 inline mr-1" />
                          Enemy Position
                        </label>
                        <textarea
                          value={editedOpponentPosition}
                          onChange={(e) => setEditedOpponentPosition(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-red-500/30 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-blue-400 mb-1 uppercase tracking-wider">
                          <Sword className="w-3 h-3 inline mr-1" />
                          Your Position
                        </label>
                        <textarea
                          value={editedUserPosition}
                          onChange={(e) => setEditedUserPosition(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-purple-400 mb-1 uppercase tracking-wider">
                          <MessageSquare className="w-3 h-3 inline mr-1" />
                          Battlefield Intel
                        </label>
                        <textarea
                          value={editedAdditionalContext}
                          onChange={(e) => setEditedAdditionalContext(e.target.value)}
                          placeholder="Optional background information..."
                          className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 text-sm text-gray-400 hover:text-gray-200 transition-colors"
                        >
                          <X className="w-4 h-4 inline mr-1" />
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveContext}
                          className="px-3 py-1 text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded hover:from-green-700 hover:to-emerald-700 transition-all"
                        >
                          <Save className="w-4 h-4 inline mr-1" />
                          Save Strategy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <button
                        onClick={() => setIsEditingContext(true)}
                        className="absolute top-0 right-0 p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <div className="pr-8">
                        <div className="text-xs space-y-2">
                          <div>
                            <span className="font-bold text-red-400 uppercase tracking-wider">Enemy:</span>
                            <p className="text-gray-300 mt-1">{conversation.opponentPosition || 'Position unknown'}</p>
                          </div>
                          <div>
                            <span className="font-bold text-blue-400 uppercase tracking-wider">You:</span>
                            <p className="text-gray-300 mt-1">{conversation.userPosition || 'Position unset'}</p>
                          </div>
                          {conversation.additionalContext && (
                            <div>
                              <span className="font-bold text-purple-400 uppercase tracking-wider">Intel:</span>
                              <p className="text-gray-300 mt-1">{conversation.additionalContext}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Tip for stance adjustment */}
                      <div className="mt-2 p-2 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                        <p className="text-xs text-yellow-400">
                          <span className="font-bold">💡 Tip:</span> Adjust the stances as the combat evolves for the most optimal responses
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-gradient-to-r from-red-900/50 to-orange-900/50 text-gray-100 border border-red-500/30'
                      } rounded-lg px-4 py-3`}
                    >
                      <div className="flex items-center mb-1">
                        {message.role === 'user' ? (
                          <>
                            <Sword className="w-4 h-4 mr-1 text-yellow-300" />
                            <span className="text-xs font-bold uppercase tracking-wider text-yellow-300">
                              Your Strike
                            </span>
                          </>
                        ) : (
                          <>
                            <Shield className="w-4 h-4 mr-1 text-red-300" />
                            <span className="text-xs font-bold uppercase tracking-wider text-red-300">
                              Enemy Attack
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-purple-500/30 p-4">
                <div className="flex space-x-2">
                  <textarea
                    value={opponentMessage}
                    onChange={(e) => setOpponentMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendOpponentMessage();
                      }
                    }}
                    placeholder="Paste your enemy's pathetic attempt here..."
                    disabled={isLoading || generatedResponses.length > 0}
                    className="flex-1 px-4 py-3 bg-gray-800/50 border-2 border-orange-500/30 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none disabled:opacity-50"
                    rows={2}
                  />
                  <button
                    onClick={handleSendOpponentMessage}
                    disabled={isLoading || !opponentMessage.trim() || generatedResponses.length > 0}
                    className="px-6 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all shadow-lg"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Zap className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Response Options */}
          <div className="lg:col-span-1">
            <div className="card-battle h-[700px] overflow-y-auto">
              <h3 className="text-xl font-black mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent flex items-center">
                <Sword className="w-6 h-6 mr-2 text-yellow-400" />
                YOUR ARSENAL
              </h3>
              
              {generatedResponses.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400 mb-3 font-bold uppercase tracking-wider">
                    Choose your weapon:
                  </p>
                  {generatedResponses.map((response, index) => (
                    <div
                      key={index}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-[1.02] ${
                        selectedResponse === index
                          ? 'border-yellow-400 bg-gradient-to-br from-yellow-900/20 to-amber-900/20 shadow-lg shadow-yellow-500/20'
                          : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                          Strike #{index + 1}
                        </span>
                        <button
                          onClick={() => handleCopyResponse(response, index)}
                          className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors"
                        >
                          {copiedIndex === index ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-gray-200 mb-3">{response}</p>
                      <button
                        onClick={() => handleSelectResponse(index)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-yellow-600 text-white text-sm font-bold rounded-lg hover:from-red-700 hover:to-yellow-700 transform hover:scale-105 transition-all uppercase tracking-wider"
                      >
                        <Sword className="w-4 h-4 inline mr-2" />
                        Deploy Strike
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <div className="relative inline-block">
                    <Sword className="w-16 h-16 mx-auto mb-4 text-gray-600 animate-float" />
                    <Shield className="w-8 h-8 absolute -bottom-2 -right-2 text-gray-600" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-wider">
                    {messages.length === 0
                      ? "Awaiting enemy's first move..."
                      : "Feed me their words to forge your weapons!"}
                  </p>
                </div>
              )}
            </div>

            {/* Character Display with Style Change */}
            {selectedCharacter && (
              <div className="mt-6 card-battle p-4">
                <div className="text-center">
                  <img 
                    src={selectedCharacter.image} 
                    alt={selectedCharacter.name}
                    className="w-24 h-24 mx-auto rounded-full mb-3 border-3"
                    style={{ borderColor: selectedCharacter.color }}
                  />
                  <h4 className="font-bold text-sm" style={{ color: selectedCharacter.color }}>
                    {selectedCharacter.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {selectedCharacter.description}
                  </p>
                  
                  {/* Style Change Button */}
                  <button
                    onClick={() => setShowStyleSelector(!showStyleSelector)}
                    className="mt-3 px-3 py-1 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center mx-auto"
                  >
                    <Palette className="w-3 h-3 mr-1" />
                    Change Style
                  </button>
                  
                  {/* Style Selector Dropdown */}
                  {showStyleSelector && (
                    <div className="mt-2 p-2 bg-gray-800 rounded-lg border border-purple-500/30">
                      <p className="text-xs text-gray-400 mb-2">Select new fighting style:</p>
                      <div className="space-y-1">
                        {Object.entries(TONE_DESCRIPTIONS).map(([tone, description]) => {
                          const isCurrentTone = tone === (conversation?.currentTone || conversation?.tone);
                          const character = characters.find(c => c.tone === tone);
                          
                          return (
                            <button
                              key={tone}
                              onClick={async () => {
                                if (!isCurrentTone && conversationId) {
                                  setIsChangingStyle(true);
                                  try {
                                    const result = await changeConversationTone(conversationId, tone as ToneType);
                                    // Update the local conversation state
                                    setConversation(prev => prev ? {...prev, currentTone: result.currentTone} : null);
                                    setShowStyleSelector(false);
                                    toast.success(`⚔️ Style changed to ${character?.name || tone}!`);
                                  } catch (error) {
                                    toast.error('Failed to change style!');
                                  } finally {
                                    setIsChangingStyle(false);
                                  }
                                }
                              }}
                              disabled={isCurrentTone || isChangingStyle}
                              className={`w-full text-left px-2 py-1 text-xs rounded transition-all ${
                                isCurrentTone
                                  ? 'bg-purple-900/50 text-purple-300 cursor-not-allowed'
                                  : 'hover:bg-gray-700 text-gray-200'
                              }`}
                            >
                              <div className="flex items-center">
                                {character && (
                                  <img 
                                    src={character.image} 
                                    alt={character.name}
                                    className="w-6 h-6 rounded-full mr-2"
                                  />
                                )}
                                <div>
                                  <div className="font-semibold" style={{ color: character?.color }}>
                                    {character?.name || tone}
                                  </div>
                                  <div className="text-gray-400" style={{ fontSize: '10px' }}>
                                    {description}
                                  </div>
                                </div>
                                {isCurrentTone && (
                                  <span className="ml-auto text-yellow-400" style={{ fontSize: '10px' }}>Current</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}