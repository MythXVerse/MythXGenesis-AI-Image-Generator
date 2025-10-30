
import React from 'react';
import { HistoryIcon } from './IconComponents';

interface ImageHistoryProps {
  history: string[];
  onSelect: (imageUrl: string) => void;
}

const ImageHistory: React.FC<ImageHistoryProps> = ({ history, onSelect }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
        <HistoryIcon />
        Generation History
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {history.map((imageUrl, index) => (
          <div
            key={index}
            className="aspect-square bg-dark-card border border-dark-border rounded-lg overflow-hidden cursor-pointer group relative transition-all duration-300 hover:border-brand-accent hover:scale-105 hover:shadow-2xl hover:shadow-brand-secondary/20"
            onClick={() => onSelect(imageUrl)}
          >
            <img
              src={imageUrl}
              alt={`Generated image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <p className="text-white font-semibold">View</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageHistory;