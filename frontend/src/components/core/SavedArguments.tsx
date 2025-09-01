import React from 'react';
import { useArguments } from '../../context/ArgumentContext';
import { Trash2, Clock, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from '../../utils/dateUtils';

const SavedArguments: React.FC = () => {
  const { savedArguments, loadArgument, deleteArgument } = useArguments();

  if (savedArguments.length === 0) {
    return (
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Saved Arguments</h3>
        <div className="text-center py-8 text-gray-500">
          <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No saved arguments yet</p>
          <p className="text-sm mt-2">Your saved arguments will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Saved Arguments</h3>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {savedArguments.map((argument) => (
          <div
            key={argument.id}
            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => loadArgument(argument.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {argument.title || 'Untitled Argument'}
                </h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {argument.context}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Clock size={12} />
                  <span>{formatDistanceToNow(argument.createdAt)}</span>
                  <span>•</span>
                  <span className="capitalize">{argument.tone.replace('-', ' ')}</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteArgument(argument.id);
                }}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedArguments;