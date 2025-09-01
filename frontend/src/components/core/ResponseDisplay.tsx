import React, { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { ToneType } from '../../types';
import toast from 'react-hot-toast';

interface ResponseDisplayProps {
  responses: string[];
  tone: ToneType;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ responses, tone }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success('Response copied to clipboard!');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast.error('Failed to copy response');
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Generated Responses</h3>
        <span className="text-sm text-gray-500 capitalize">
          Tone: {tone.replace('-', ' ')}
        </span>
      </div>
      
      <div className="space-y-4">
        {responses.map((response, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-gray-800 flex-1 whitespace-pre-wrap">
                {response}
              </p>
              <button
                onClick={() => handleCopy(response, index)}
                className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                title="Copy to clipboard"
              >
                {copiedIndex === index ? (
                  <Check size={20} className="text-green-500" />
                ) : (
                  <Copy size={20} />
                )}
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Option {index + 1}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Choose the response that best fits your situation
        </p>
      </div>
    </div>
  );
};

export default ResponseDisplay;