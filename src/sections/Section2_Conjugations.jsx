import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import verbs from '../data/verbs.json';
import { TENSES, TENSE_ORDER, PRONOUNS } from '../data/tenseConfig';

export default function Section2_Conjugations() {
  const { state, dispatch } = useApp();
  const { selectedTense, known, review, currentIndex } = state.section2;
  const [isFlipped, setIsFlipped] = useState(false);
  const [localIndex, setLocalIndex] = useState(0);

  // Get current verb
  const currentVerb = verbs[localIndex];
  const currentTense = TENSES[selectedTense];

  // Get conjugation data
  const conjugation = useMemo(() => {
    if (!currentVerb) return null;
    return currentVerb.conjugations[selectedTense];
  }, [currentVerb, selectedTense]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnow = () => {
    dispatch({
      type: 'SECTION2_MARK_KNOWN',
      payload: { verbId: currentVerb.id, tense: selectedTense }
    });
    goToNext();
  };

  const handleReview = () => {
    dispatch({
      type: 'SECTION2_MARK_REVIEW',
      payload: { verbId: currentVerb.id, tense: selectedTense }
    });
    goToNext();
  };

  const goToNext = () => {
    setIsFlipped(false);
    if (localIndex < verbs.length - 1) {
      setLocalIndex(localIndex + 1);
    }
  };

  const goToPrev = () => {
    setIsFlipped(false);
    if (localIndex > 0) {
      setLocalIndex(localIndex - 1);
    }
  };

  const handleTenseChange = (tense) => {
    dispatch({ type: 'SECTION2_SET_TENSE', payload: tense });
    setIsFlipped(false);
  };

  const handleReset = () => {
    dispatch({ type: 'SECTION2_RESET' });
    setLocalIndex(0);
    setIsFlipped(false);
  };

  // Count progress for current tense
  const knownCount = Object.keys(known).filter(k => k.endsWith(`_${selectedTense}`)).length;
  const reviewCount = Object.keys(review).filter(k => k.endsWith(`_${selectedTense}`)).length;

  // Check if current verb/tense is marked
  const currentKey = `${currentVerb?.id}_${selectedTense}`;
  const isKnown = known[currentKey];
  const isReview = review[currentKey];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
          Verb Conjugations
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Learn conjugations for each tense
        </p>
      </div>

      {/* Tense Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Select Tense
        </label>
        <div className="flex flex-wrap gap-2">
          {TENSE_ORDER.map((tenseId) => (
            <button
              key={tenseId}
              onClick={() => handleTenseChange(tenseId)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTense === tenseId
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
              }`}
            >
              {TENSES[tenseId].shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6 space-y-2">
        <ProgressBar
          current={localIndex + 1}
          total={verbs.length}
          label={currentTense.name}
        />
        <div className="flex gap-4 text-sm">
          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
            {knownCount} known
          </span>
          {reviewCount > 0 && (
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
              {reviewCount} to review
            </span>
          )}
        </div>
      </div>

      {/* Flashcard */}
      {currentVerb && (
        <div className="flex flex-col items-center gap-6">
          <div
            className={`flip-card w-full max-w-xl h-96 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
            onClick={handleFlip}
          >
            <div className="flip-card-inner">
              {/* Front */}
              <div className="flip-card-front bg-white dark:bg-neutral-800 shadow-xl flex flex-col items-center justify-center p-8 border border-neutral-200 dark:border-neutral-700">
                <p className="text-4xl font-bold text-neutral-800 dark:text-neutral-200 mb-3">
                  {currentVerb.infinitive}
                </p>
                <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-4">
                  {currentVerb.english}
                </p>
                <div className="px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <p className="text-red-700 dark:text-red-400 font-medium">
                    {currentTense.name}
                  </p>
                </div>
                {(isKnown || isReview) && (
                  <div className={`mt-4 px-3 py-1 rounded-full text-sm ${
                    isKnown
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  }`}>
                    {isKnown ? 'Marked as known' : 'Marked for review'}
                  </div>
                )}
                <p className="absolute bottom-4 text-sm text-neutral-400 dark:text-neutral-500">
                  Click to see conjugation
                </p>
              </div>

              {/* Back */}
              <div className="flip-card-back bg-gradient-to-br from-red-600 to-red-900 dark:from-red-700 dark:to-red-950 shadow-xl flex flex-col items-center justify-center p-8 text-white">
                {selectedTense === 'participio' ? (
                  <div className="text-center">
                    <p className="text-lg text-red-200 mb-2">Participio</p>
                    <p className="text-4xl font-bold">{conjugation}</p>
                  </div>
                ) : (
                  <table className="w-full max-w-xs">
                    <tbody>
                      {PRONOUNS.map((pronoun, index) => (
                        <tr key={pronoun} className="border-b border-red-500/30 last:border-0">
                          <td className="py-2 text-red-200 text-right pr-4">
                            {pronoun}
                          </td>
                          <td className="py-2 font-bold text-xl">
                            {Array.isArray(conjugation) ? conjugation[index] : conjugation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={(e) => { e.stopPropagation(); handleReview(); }}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-amber-500/25"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Review
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleKnow(); }}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/25"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Know It
            </button>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 items-center">
            <Button
              variant="secondary"
              onClick={goToPrev}
              disabled={localIndex === 0}
            >
              Previous
            </Button>
            <span className="text-neutral-500 dark:text-neutral-400">
              {localIndex + 1} of {verbs.length}
            </span>
            <Button
              variant="secondary"
              onClick={goToNext}
              disabled={localIndex === verbs.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Reset button */}
      <div className="mt-8 flex justify-center">
        <Button variant="ghost" onClick={handleReset}>
          Reset Progress for This Tense
        </Button>
      </div>
    </div>
  );
}
