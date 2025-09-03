import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Argument, ArgumentFormData } from '../types';
import toast from 'react-hot-toast';
import { useDebounce } from '../hooks/useDebounce';

interface ArgumentContextType {
  savedArguments: Argument[];
  currentArgument: Argument | null;
  saveArgument: (argument: ArgumentFormData) => void;
  loadArgument: (id: string) => void;
  deleteArgument: (id: string) => void;
  updateArgument: (id: string, updates: Partial<Argument>) => void;
  isLoading: boolean;
}

const ArgumentContext = createContext<ArgumentContextType | undefined>(undefined);

export const useArguments = () => {
  const context = useContext(ArgumentContext);
  if (!context) {
    throw new Error('useArguments must be used within ArgumentProvider');
  }
  return context;
};

interface ArgumentProviderProps {
  children: React.ReactNode;
}

export const ArgumentProvider: React.FC<ArgumentProviderProps> = ({ children }) => {
  const [savedArguments, setSavedArguments] = useState<Argument[]>([]);
  const [currentArgument, setCurrentArgument] = useState<Argument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved arguments from localStorage with error boundary
    const loadSavedArguments = async () => {
      try {
        setIsLoading(true);
        const stored = localStorage.getItem('keyboard-warrior-arguments');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Validate data structure
          if (Array.isArray(parsed)) {
            setSavedArguments(parsed);
          } else {
            console.warn('Invalid saved arguments format, resetting to empty array');
            setSavedArguments([]);
          }
        }
      } catch (error) {
        console.error('Error loading saved arguments:', error);
        toast.error('Failed to load saved arguments');
        setSavedArguments([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedArguments();
  }, []);

  // Debounced save to localStorage to prevent excessive writes
  const debouncedSaveToLocalStorage = useDebounce((args: Argument[]) => {
    try {
      localStorage.setItem('keyboard-warrior-arguments', JSON.stringify(args));
    } catch (error) {
      console.error('Error saving arguments to localStorage:', error);
      toast.error('Failed to save arguments locally');
    }
  }, 500);
  
  const saveToLocalStorage = useCallback((args: Argument[]) => {
    debouncedSaveToLocalStorage(args);
  }, [debouncedSaveToLocalStorage]);

  const saveArgument = useCallback((formData: ArgumentFormData) => {
    const newArgument: Argument = {
      id: Date.now().toString(),
      title: formData.title || `Argument ${savedArguments.length + 1}`,
      context: formData.context,
      opponentPosition: formData.opponentPosition || '',
      userPosition: formData.userPosition || '',
      tone: formData.tone,
      styleExamples: formData.styleExamples,
      responses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updated = [...savedArguments, newArgument];
    setSavedArguments(updated);
    saveToLocalStorage(updated);
    setCurrentArgument(newArgument);
    toast.success('Argument saved successfully!');
  }, [savedArguments, saveToLocalStorage]);

  const loadArgument = useCallback((id: string) => {
    const argument = savedArguments.find(arg => arg.id === id);
    if (argument) {
      setCurrentArgument(argument);
      toast.success('Argument loaded');
    } else {
      toast.error('Argument not found');
    }
  }, [savedArguments]);

  const deleteArgument = useCallback((id: string) => {
    const updated = savedArguments.filter(arg => arg.id !== id);
    setSavedArguments(updated);
    saveToLocalStorage(updated);
    if (currentArgument?.id === id) {
      setCurrentArgument(null);
    }
    toast.success('Argument deleted');
  }, [savedArguments, currentArgument, saveToLocalStorage]);

  const updateArgument = useCallback((id: string, updates: Partial<Argument>) => {
    const updated = savedArguments.map(arg =>
      arg.id === id
        ? { ...arg, ...updates, updatedAt: new Date() }
        : arg
    );
    setSavedArguments(updated);
    saveToLocalStorage(updated);
    if (currentArgument?.id === id) {
      setCurrentArgument({ ...currentArgument, ...updates, updatedAt: new Date() });
    }
  }, [savedArguments, currentArgument, saveToLocalStorage]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      savedArguments,
      currentArgument,
      saveArgument,
      loadArgument,
      deleteArgument,
      updateArgument,
      isLoading
    }),
    [
      savedArguments,
      currentArgument,
      saveArgument,
      loadArgument,
      deleteArgument,
      updateArgument,
      isLoading
    ]
  );

  return (
    <ArgumentContext.Provider value={contextValue}>
      {children}
    </ArgumentContext.Provider>
  );
};
