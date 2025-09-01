import React, { createContext, useContext, useState, useEffect } from 'react';
import { Argument, ArgumentFormData } from '../types';
import toast from 'react-hot-toast';

interface ArgumentContextType {
  savedArguments: Argument[];
  currentArgument: Argument | null;
  saveArgument: (argument: ArgumentFormData) => void;
  loadArgument: (id: string) => void;
  deleteArgument: (id: string) => void;
  updateArgument: (id: string, updates: Partial<Argument>) => void;
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

  useEffect(() => {
    // Load saved arguments from localStorage
    const stored = localStorage.getItem('keyboard-warrior-arguments');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSavedArguments(parsed);
      } catch (error) {
        console.error('Error loading saved arguments:', error);
      }
    }
  }, []);

  const saveToLocalStorage = (args: Argument[]) => {
    localStorage.setItem('keyboard-warrior-arguments', JSON.stringify(args));
  };

  const saveArgument = (formData: ArgumentFormData) => {
    const newArgument: Argument = {
      id: Date.now().toString(),
      title: formData.title || `Argument ${savedArguments.length + 1}`,
      context: formData.context,
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
  };

  const loadArgument = (id: string) => {
    const argument = savedArguments.find(arg => arg.id === id);
    if (argument) {
      setCurrentArgument(argument);
      toast.success('Argument loaded');
    }
  };

  const deleteArgument = (id: string) => {
    const updated = savedArguments.filter(arg => arg.id !== id);
    setSavedArguments(updated);
    saveToLocalStorage(updated);
    if (currentArgument?.id === id) {
      setCurrentArgument(null);
    }
    toast.success('Argument deleted');
  };

  const updateArgument = (id: string, updates: Partial<Argument>) => {
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
  };

  return (
    <ArgumentContext.Provider
      value={{
        savedArguments,
        currentArgument,
        saveArgument,
        loadArgument,
        deleteArgument,
        updateArgument,
      }}
    >
      {children}
    </ArgumentContext.Provider>
  );
};