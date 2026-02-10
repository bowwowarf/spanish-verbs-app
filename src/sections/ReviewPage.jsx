import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import FlashCard from '../components/FlashCard';
import Button from '../components/Button';
import verbs from '../data/verbs.json';
import sentences from '../data/sentences.json';
import { TENSES, PRONOUNS } from '../data/tenseConfig';

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function ReviewPage() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [practiceMode, setPracticeMode] = useState(null);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [showQuizFeedback, setShowQuizFeedback] = useState(false);

  // Aggregate review data
  const section1Reviews = state.section1.review || [];
  const section2ReviewKeys = Object.keys(state.section2.review || {}).filter(k => state.section2.review[k]);
  const section3Reviews = state.section3.review || [];
  const section4Reviews = state.section4.review || [];

  // Resolve items
  const section1Items = useMemo(() =>
    section1Reviews.map(id => verbs.find(v => v.id === id)).filter(Boolean),
    [section1Reviews]
  );

  const section2Items = useMemo(() =>
    section2ReviewKeys.map(key => {
      const firstUnderscore = key.indexOf('_');
      const verbId = parseInt(key.substring(0, firstUnderscore));
      const tenseId = key.substring(firstUnderscore + 1);
      const verb = verbs.find(v => v.id === verbId);
      return verb ? { verb, tenseId, key, tenseName: TENSES[tenseId]?.shortName || tenseId } : null;
    }).filter(Boolean),
    [section2ReviewKeys]
  );

  const section3Items = useMemo(() =>
    section3Reviews.map(id => sentences.find(s => s.id === id)).filter(Boolean),
    [section3Reviews]
  );

  const section4Items = useMemo(() =>
    section4Reviews.map(id => sentences.find(s => s.id === id)).filter(Boolean),
    [section4Reviews]
  );

  const totalCount = section1Items.length + section2Items.length + section3Items.length + section4Items.length;

  // Quiz options for section 3 practice
  const quizOptions = useMemo(() => {
    if (practiceMode !== 'section3' || section3Items.length === 0) return [];
    const current = section3Items[practiceIndex];
    if (!current) return [];
    const allOptions = [current.correct_answer, ...current.distractors];
    return shuffleArray(allOptions);
  }, [practiceMode, practiceIndex, section3Items]);

  // Remove handlers
  const removeSection1 = (verbId) => {
    dispatch({ type: 'SECTION1_REMOVE_REVIEW', payload: verbId });
  };
  const removeSection2 = (key) => {
    dispatch({ type: 'SECTION2_REMOVE_REVIEW', payload: key });
  };
  const removeSection3 = (sentenceId) => {
    dispatch({ type: 'SECTION3_REMOVE_REVIEW', payload: sentenceId });
  };
  const removeSection4 = (sentenceId) => {
    dispatch({ type: 'SECTION4_REMOVE_REVIEW', payload: sentenceId });
  };

  const startPractice = (section) => {
    setPracticeMode(section);
    setPracticeIndex(0);
    setIsFlipped(false);
    setQuizAnswer(null);
    setShowQuizFeedback(false);
  };

  const exitPractice = () => {
    setPracticeMode(null);
    setPracticeIndex(0);
    setIsFlipped(false);
    setQuizAnswer(null);
    setShowQuizFeedback(false);
  };

  const nextPracticeItem = (items) => {
    setIsFlipped(false);
    setQuizAnswer(null);
    setShowQuizFeedback(false);
    if (practiceIndex < items.length - 1) {
      setPracticeIndex(practiceIndex + 1);
    } else {
      exitPractice();
    }
  };

  const tabs = [
    { id: 'all', label: 'All', count: totalCount },
    { id: 'section1', label: 'Verb Meanings', count: section1Items.length },
    { id: 'section2', label: 'Conjugations', count: section2Items.length },
    { id: 'section3', label: 'Fill in Blank', count: section3Items.length },
    { id: 'section4', label: 'Translations', count: section4Items.length },
  ];

  // Practice mode rendering
  if (practiceMode === 'section1' && section1Items.length > 0) {
    const item = section1Items[practiceIndex];
    if (!item) { exitPractice(); return null; }
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Review: Verb Meanings</h1>
          <Button variant="ghost" onClick={exitPractice}>Back to List</Button>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 text-center">
          {practiceIndex + 1} of {section1Items.length}
        </p>
        <FlashCard
          front={
            <div>
              <p className="text-4xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">{item.infinitive}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">(verb)</p>
            </div>
          }
          back={
            <div>
              <p className="text-3xl font-bold mb-2">{item.english}</p>
            </div>
          }
          showButtons={false}
        />
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => { removeSection1(item.id); nextPracticeItem(section1Items); }}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/25"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Mastered
          </button>
          <button
            onClick={() => nextPracticeItem(section1Items)}
            className="flex items-center gap-2 px-6 py-3 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-xl font-medium transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  if (practiceMode === 'section2' && section2Items.length > 0) {
    const item = section2Items[practiceIndex];
    if (!item) { exitPractice(); return null; }
    const conjugation = item.verb.conjugations[item.tenseId];
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Review: Conjugations</h1>
          <Button variant="ghost" onClick={exitPractice}>Back to List</Button>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 text-center">
          {practiceIndex + 1} of {section2Items.length}
        </p>
        <div className="flex flex-col items-center gap-6">
          <div
            className={`flip-card w-full max-w-xl h-96 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front bg-white dark:bg-neutral-800 shadow-xl flex flex-col items-center justify-center p-8 border border-neutral-200 dark:border-neutral-700">
                <p className="text-4xl font-bold text-neutral-800 dark:text-neutral-200 mb-3">{item.verb.infinitive}</p>
                <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-4">{item.verb.english}</p>
                <div className="px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <p className="text-red-700 dark:text-red-400 font-medium">{item.tenseName}</p>
                </div>
                <p className="absolute bottom-4 text-sm text-neutral-400 dark:text-neutral-500">Click to see conjugation</p>
              </div>
              <div className="flip-card-back bg-gradient-to-br from-red-600 to-red-900 dark:from-red-700 dark:to-red-950 shadow-xl flex flex-col items-center justify-center p-8 text-white">
                {item.tenseId === 'participio' ? (
                  <div className="text-center">
                    <p className="text-lg text-red-200 mb-2">Participio</p>
                    <p className="text-4xl font-bold">{conjugation}</p>
                  </div>
                ) : (
                  <table className="w-full max-w-xs">
                    <tbody>
                      {PRONOUNS.map((pronoun, index) => (
                        <tr key={pronoun} className="border-b border-red-500/30 last:border-0">
                          <td className="py-2 text-red-200 text-right pr-4">{pronoun}</td>
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
          <div className="flex gap-4">
            <button
              onClick={() => { removeSection2(item.key); nextPracticeItem(section2Items); }}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/25"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Mastered
            </button>
            <button
              onClick={() => nextPracticeItem(section2Items)}
              className="flex items-center gap-2 px-6 py-3 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-xl font-medium transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (practiceMode === 'section3' && section3Items.length > 0) {
    const item = section3Items[practiceIndex];
    if (!item) { exitPractice(); return null; }
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Review: Fill in the Blank</h1>
          <Button variant="ghost" onClick={exitPractice}>Back to List</Button>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 text-center">
          {practiceIndex + 1} of {section3Items.length}
        </p>
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 border border-neutral-200 dark:border-neutral-700 mb-6">
          <p className="text-neutral-500 dark:text-neutral-400 mb-4 text-lg">{item.english}</p>
          <p className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-8">
            {item.blank_sentence.split('_____').map((part, index, arr) => (
              <span key={index}>
                {part}
                {index < arr.length - 1 && (
                  <span className={`inline-block min-w-[120px] mx-1 px-4 py-1 rounded-lg border-2 border-dashed ${
                    showQuizFeedback
                      ? quizAnswer === item.correct_answer
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                        : 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400'
                      : 'border-neutral-300 dark:border-neutral-600'
                  }`}>
                    {showQuizFeedback ? item.correct_answer : '?'}
                  </span>
                )}
              </span>
            ))}
          </p>
          <div className="grid grid-cols-2 gap-4">
            {quizOptions.map((option, index) => {
              let buttonClass = 'bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600';
              if (showQuizFeedback) {
                if (option === item.correct_answer) {
                  buttonClass = 'bg-emerald-500 text-white';
                } else if (option === quizAnswer) {
                  buttonClass = 'bg-red-500 text-white';
                } else {
                  buttonClass = 'bg-neutral-100 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500';
                }
              }
              return (
                <button
                  key={index}
                  onClick={() => { if (!showQuizFeedback) { setQuizAnswer(option); setShowQuizFeedback(true); } }}
                  disabled={showQuizFeedback}
                  className={`p-4 rounded-xl font-medium text-lg transition-all ${buttonClass} ${showQuizFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {showQuizFeedback && (
            <div className={`mt-6 p-4 rounded-xl ${
              quizAnswer === item.correct_answer
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
            }`}>
              {quizAnswer === item.correct_answer ? (
                <p className="font-medium">Correct!</p>
              ) : (
                <p className="font-medium">The correct answer is: <strong>{item.correct_answer}</strong></p>
              )}
              <p className="mt-2 text-sm opacity-80">Full sentence: {item.spanish}</p>
            </div>
          )}
        </div>
        {showQuizFeedback && (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => { removeSection3(item.id); nextPracticeItem(section3Items); }}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/25"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Mastered
            </button>
            <button
              onClick={() => nextPracticeItem(section3Items)}
              className="flex items-center gap-2 px-6 py-3 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-xl font-medium transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }

  if (practiceMode === 'section4' && section4Items.length > 0) {
    const item = section4Items[practiceIndex];
    if (!item) { exitPractice(); return null; }
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Review: Translations</h1>
          <Button variant="ghost" onClick={exitPractice}>Back to List</Button>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 text-center">
          {practiceIndex + 1} of {section4Items.length}
        </p>
        <FlashCard
          front={
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-500 mb-4">Translate to Spanish</p>
              <p className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">{item.english}</p>
            </div>
          }
          back={
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-red-200 mb-4">Spanish Translation</p>
              <p className="text-2xl font-semibold">{item.spanish}</p>
            </div>
          }
          showButtons={false}
        />
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => { removeSection4(item.id); nextPracticeItem(section4Items); }}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/25"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Mastered
          </button>
          <button
            onClick={() => nextPracticeItem(section4Items)}
            className="flex items-center gap-2 px-6 py-3 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-xl font-medium transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  // Default: list view
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Review</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          {totalCount > 0
            ? `You have ${totalCount} item${totalCount !== 1 ? 's' : ''} to review across all sections.`
            : 'Nothing to review yet. Mark items for review as you study!'}
        </p>
      </div>

      {/* Tabs */}
      {totalCount > 0 && (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Section 1: Verb Meanings */}
          {(activeTab === 'all' || activeTab === 'section1') && section1Items.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                  Verb Meanings
                  <span className="ml-2 text-sm font-normal text-neutral-500">({section1Items.length})</span>
                </h2>
                <Button variant="outline" size="sm" onClick={() => startPractice('section1')}>
                  Practice All
                </Button>
              </div>
              <div className="space-y-2">
                {section1Items.map(verb => (
                  <div key={verb.id} className="flex items-center justify-between bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-medium">Verb</span>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">{verb.infinitive}</span>
                      <span className="text-neutral-500 dark:text-neutral-400">- {verb.english}</span>
                    </div>
                    <button
                      onClick={() => removeSection1(verb.id)}
                      className="p-2 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      title="Remove from review"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Conjugations */}
          {(activeTab === 'all' || activeTab === 'section2') && section2Items.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                  Conjugations
                  <span className="ml-2 text-sm font-normal text-neutral-500">({section2Items.length})</span>
                </h2>
                <Button variant="outline" size="sm" onClick={() => startPractice('section2')}>
                  Practice All
                </Button>
              </div>
              <div className="space-y-2">
                {section2Items.map(item => (
                  <div key={item.key} className="flex items-center justify-between bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs font-medium">Conj.</span>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">{item.verb.infinitive}</span>
                      <span className="text-neutral-500 dark:text-neutral-400">- {item.tenseName}</span>
                    </div>
                    <button
                      onClick={() => removeSection2(item.key)}
                      className="p-2 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      title="Remove from review"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Fill in the Blank */}
          {(activeTab === 'all' || activeTab === 'section3') && section3Items.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                  Fill in the Blank
                  <span className="ml-2 text-sm font-normal text-neutral-500">({section3Items.length})</span>
                </h2>
                <Button variant="outline" size="sm" onClick={() => startPractice('section3')}>
                  Practice All
                </Button>
              </div>
              <div className="space-y-2">
                {section3Items.map(sentence => (
                  <div key={sentence.id} className="flex items-center justify-between bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-xs font-medium shrink-0">Quiz</span>
                        <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate">{sentence.blank_sentence}</span>
                      </div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 ml-[52px]">Answer: {sentence.correct_answer}</p>
                    </div>
                    <button
                      onClick={() => removeSection3(sentence.id)}
                      className="p-2 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0"
                      title="Remove from review"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Translations */}
          {(activeTab === 'all' || activeTab === 'section4') && section4Items.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                  Translations
                  <span className="ml-2 text-sm font-normal text-neutral-500">({section4Items.length})</span>
                </h2>
                <Button variant="outline" size="sm" onClick={() => startPractice('section4')}>
                  Practice All
                </Button>
              </div>
              <div className="space-y-2">
                {section4Items.map(sentence => (
                  <div key={sentence.id} className="flex items-center justify-between bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs font-medium shrink-0">Trans.</span>
                        <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate">{sentence.english}</span>
                      </div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 ml-[52px] truncate">{sentence.spanish}</p>
                    </div>
                    <button
                      onClick={() => removeSection4(sentence.id)}
                      className="p-2 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0"
                      title="Remove from review"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {totalCount === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">All caught up!</h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-sm">
            You have nothing to review right now. As you study, mark items for review and they'll appear here.
          </p>
        </div>
      )}
    </div>
  );
}
