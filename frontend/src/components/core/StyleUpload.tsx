import React, { useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';

interface StyleUploadProps {
  examples: string[];
  onChange: (examples: string[]) => void;
}

const StyleUpload: React.FC<StyleUploadProps> = ({ examples, onChange }) => {
  const [currentExample, setCurrentExample] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAddExample = () => {
    if (currentExample.trim()) {
      onChange([...examples, currentExample.trim()]);
      setCurrentExample('');
      setShowInput(false);
    }
  };

  const handleRemoveExample = (index: number) => {
    onChange(examples.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());
        onChange([...examples, ...lines.slice(0, 5)]); // Limit to 5 examples from file
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Communication Style Examples (Optional)
      </label>
      <p className="text-xs text-gray-500">
        Provide examples of your messages to help the AI match your writing style
      </p>
      
      <div className="space-y-2">
        {examples.map((example, index) => (
          <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex-1 text-sm text-gray-700 break-words">
              {example.substring(0, 100)}
              {example.length > 100 && '...'}
            </div>
            <button
              onClick={() => handleRemoveExample(index)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {showInput ? (
        <div className="space-y-2">
          <textarea
            value={currentExample}
            onChange={(e) => setCurrentExample(e.target.value)}
            placeholder="Paste an example of your writing style..."
            className="input-field min-h-[80px]"
            maxLength={500}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddExample}
              className="btn btn-primary"
            >
              Add Example
            </button>
            <button
              onClick={() => {
                setShowInput(false);
                setCurrentExample('');
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => setShowInput(true)}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Plus size={16} />
            Add Example
          </button>
          <label className="btn btn-secondary flex items-center gap-2 cursor-pointer">
            <Upload size={16} />
            Upload File
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default StyleUpload;