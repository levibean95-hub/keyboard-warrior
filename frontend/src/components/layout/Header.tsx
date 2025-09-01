import React from 'react';
import { Swords, Shield } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Swords className="h-8 w-8 text-primary-600" />
              <Shield className="h-6 w-6 text-primary-500 -ml-2" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Keyboard Warrior</h1>
              <p className="text-xs text-gray-500">AI-Powered Argument Assistant</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-4">
            <button className="text-sm text-gray-600 hover:text-gray-900">
              Privacy
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900">
              About
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;