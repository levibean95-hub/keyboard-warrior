import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ArgumentInputProps {
  opponentPosition: string;
  userPosition: string;
  onOpponentChange: (value: string) => void;
  onUserChange: (value: string) => void;
  maxLength?: number;
}

const ArgumentInput: React.FC<ArgumentInputProps> = ({ 
  opponentPosition,
  userPosition,
  onOpponentChange,
  onUserChange,
  maxLength = 1000 
}) => {
  const opponentRemaining = maxLength - opponentPosition.length;
  const userRemaining = maxLength - userPosition.length;
  const opponentNearLimit = opponentRemaining < 100;
  const userNearLimit = userRemaining < 100;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="opponent" className="block text-sm font-medium text-gray-700">
          Their Position
        </label>
        <div className="relative">
          <textarea
            id="opponent"
            value={opponentPosition}
            onChange={(e) => onOpponentChange(e.target.value)}
            placeholder="What's their argument? What are they saying or claiming?"
            className="input-field min-h-[120px] resize-y"
            maxLength={maxLength}
          />
          {opponentPosition.length > 0 && (
            <div className={`absolute bottom-2 right-2 text-xs ${
              opponentNearLimit ? 'text-orange-500' : 'text-gray-400'
            }`}>
              {opponentRemaining} chars left
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="user" className="block text-sm font-medium text-gray-700">
          Your Position
        </label>
        <div className="relative">
          <textarea
            id="user"
            value={userPosition}
            onChange={(e) => onUserChange(e.target.value)}
            placeholder="What's your stance? What point do you want to make?"
            className="input-field min-h-[120px] resize-y"
            maxLength={maxLength}
          />
          {userPosition.length > 0 && (
            <div className={`absolute bottom-2 right-2 text-xs ${
              userNearLimit ? 'text-orange-500' : 'text-gray-400'
            }`}>
              {userRemaining} chars left
            </div>
          )}
        </div>
      </div>

      {(opponentPosition.length === 0 || userPosition.length === 0) && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <AlertCircle size={16} />
          <span>Fill in both positions to generate effective responses</span>
        </div>
      )}
    </div>
  );
};

export default ArgumentInput;