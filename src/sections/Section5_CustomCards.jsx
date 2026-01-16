import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';

export default function Section5_CustomCards() {
  const { state, dispatch } = useApp();
  const { customCards } = state;

  const [mode, setMode] = useState('manage'); // 'manage' | 'study' | 'add' | 'edit'
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({ spanish: '', english: '' });
  const [studyIndex, setStudyIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Study deck
  const studyDeck = useMemo(() => {
    return [...customCards].sort(() => Math.random() - 0.5);
  }, [customCards, mode]);

  const handleAddCard = () => {
    if (formData.spanish.trim() && formData.english.trim()) {
      dispatch({
        type: 'ADD_CUSTOM_CARD',
        payload: {
          spanish: formData.spanish.trim(),
          english: formData.english.trim()
        }
      });
      setFormData({ spanish: '', english: '' });
      setMode('manage');
    }
  };

  const handleUpdateCard = () => {
    if (editingCard && formData.spanish.trim() && formData.english.trim()) {
      dispatch({
        type: 'UPDATE_CUSTOM_CARD',
        payload: {
          id: editingCard.id,
          spanish: formData.spanish.trim(),
          english: formData.english.trim()
        }
      });
      setEditingCard(null);
      setFormData({ spanish: '', english: '' });
      setMode('manage');
    }
  };

  const handleDeleteCard = (id) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      dispatch({ type: 'DELETE_CUSTOM_CARD', payload: id });
    }
  };

  const handleEditClick = (card) => {
    setEditingCard(card);
    setFormData({ spanish: card.spanish, english: card.english });
    setMode('edit');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(customCards, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'spanish-vocabulary.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result);
          if (Array.isArray(imported)) {
            const validCards = imported.filter(
              card => card.spanish && card.english
            ).map((card, index) => ({
              ...card,
              id: card.id || Date.now() + index
            }));
            dispatch({ type: 'IMPORT_CUSTOM_CARDS', payload: validCards });
            alert(`Successfully imported ${validCards.length} cards!`);
          }
        } catch (error) {
          alert('Error importing file. Please check the format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleStudyNext = () => {
    setIsFlipped(false);
    if (studyIndex < studyDeck.length - 1) {
      setStudyIndex(studyIndex + 1);
    } else {
      setStudyIndex(0);
    }
  };

  const handleStartStudy = () => {
    setStudyIndex(0);
    setIsFlipped(false);
    setMode('study');
  };

  // Render form for add/edit
  const renderForm = () => (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">
          {mode === 'add' ? 'Add New Card' : 'Edit Card'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Spanish Word/Phrase
            </label>
            <input
              type="text"
              value={formData.spanish}
              onChange={(e) => setFormData({ ...formData, spanish: e.target.value })}
              placeholder="e.g., además"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              English Translation
            </label>
            <input
              type="text"
              value={formData.english}
              onChange={(e) => setFormData({ ...formData, english: e.target.value })}
              placeholder="e.g., besides, furthermore"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            variant="secondary"
            onClick={() => {
              setMode('manage');
              setEditingCard(null);
              setFormData({ spanish: '', english: '' });
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={mode === 'add' ? handleAddCard : handleUpdateCard}
            disabled={!formData.spanish.trim() || !formData.english.trim()}
          >
            {mode === 'add' ? 'Add Card' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );

  // Render study mode
  const renderStudyMode = () => {
    if (studyDeck.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            No cards to study. Add some cards first!
          </p>
          <Button onClick={() => setMode('add')}>Add Your First Card</Button>
        </div>
      );
    }

    const currentCard = studyDeck[studyIndex];

    return (
      <div className="max-w-md mx-auto">
        <div className="mb-6 text-center">
          <span className="text-slate-500 dark:text-slate-400">
            Card {studyIndex + 1} of {studyDeck.length}
          </span>
        </div>

        <div
          className={`flip-card w-full h-64 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="flip-card-inner">
            {/* Front */}
            <div className="flip-card-front bg-white dark:bg-slate-800 shadow-xl flex flex-col items-center justify-center p-8 border border-slate-200 dark:border-slate-700">
              <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-4">
                Spanish
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                {currentCard.spanish}
              </p>
              <p className="absolute bottom-4 text-sm text-slate-400 dark:text-slate-500">
                Click to flip
              </p>
            </div>

            {/* Back */}
            <div className="flip-card-back bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 shadow-xl flex flex-col items-center justify-center p-8 text-white">
              <p className="text-xs uppercase tracking-wide text-blue-200 mb-4">
                English
              </p>
              <p className="text-3xl font-bold">
                {currentCard.english}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button variant="secondary" onClick={() => setMode('manage')}>
            Exit Study
          </Button>
          <Button onClick={handleStudyNext}>
            Next Card
          </Button>
        </div>
      </div>
    );
  };

  // Render manage mode
  const renderManageMode = () => (
    <>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button onClick={() => setMode('add')}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Card
        </Button>

        {customCards.length > 0 && (
          <Button variant="success" onClick={handleStartStudy}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Study Cards
          </Button>
        )}

        <Button variant="secondary" onClick={handleExport} disabled={customCards.length === 0}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Export
        </Button>

        <label className="cursor-pointer">
          <Button variant="secondary" as="span">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Import
          </Button>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>

      {/* Cards List */}
      {customCards.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
          <svg className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
            No custom cards yet
          </h3>
          <p className="text-slate-500 dark:text-slate-500 mb-6">
            Add vocabulary words you want to learn
          </p>
          <Button onClick={() => setMode('add')}>Add Your First Card</Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {customCards.length} card{customCards.length !== 1 ? 's' : ''} in your collection
          </p>
          {customCards.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="flex-1">
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {card.spanish}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {card.english}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(card)}
                  className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Custom Vocabulary
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Create and study your own flashcards
        </p>
      </div>

      {/* Content based on mode */}
      {mode === 'manage' && renderManageMode()}
      {(mode === 'add' || mode === 'edit') && renderForm()}
      {mode === 'study' && renderStudyMode()}
    </div>
  );
}
