import { useState } from 'react';

export default function FlashCard({
  front,
  back,
  onKnow,
  onReview,
  showButtons = true,
  className = ''
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnow = (e) => {
    e.stopPropagation();
    setIsFlipped(false);
    if (onKnow) onKnow();
  };

  const handleReview = (e) => {
    e.stopPropagation();
    setIsFlipped(false);
    if (onReview) onReview();
  };

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      <div
        className={`flip-card w-full max-w-md h-72 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flip-card-inner">
          {/* Front of card */}
          <div className="flip-card-front bg-white dark:bg-neutral-800 shadow-xl flex flex-col items-center justify-center p-8 border border-neutral-200 dark:border-neutral-700">
            <div className="text-center">
              {front}
            </div>
            <p className="absolute bottom-4 text-sm text-neutral-400 dark:text-neutral-500">
              Click to flip
            </p>
          </div>

          {/* Back of card */}
          <div className="flip-card-back bg-gradient-to-br from-red-600 to-red-900 dark:from-red-700 dark:to-red-950 shadow-xl flex flex-col items-center justify-center p-8 text-white">
            <div className="text-center">
              {back}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {showButtons && (
        <div className="flex gap-4">
          <button
            onClick={handleReview}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-amber-500/25"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Review Again
          </button>
          <button
            onClick={handleKnow}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/25"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            I Know This
          </button>
        </div>
      )}
    </div>
  );
}
