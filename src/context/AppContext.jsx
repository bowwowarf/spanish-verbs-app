import { createContext, useContext, useReducer, useEffect } from 'react';
import verbs from '../data/verbs.json';

const AppContext = createContext(null);

const initialState = {
  darkMode: false,
  section1: {
    known: [],
    review: [],
    currentIndex: 0,
    deck: verbs.map(v => v.id)
  },
  section2: {
    known: {},
    review: {},
    currentIndex: 0,
    selectedTense: 'presente_indicativo'
  },
  section3: {
    attempts: 0,
    correct: 0,
    currentIndex: 0,
    answered: [],
    review: []
  },
  section4: {
    known: [],
    review: [],
    currentIndex: 0
  },
  customCards: []
};

function loadStateFromStorage() {
  try {
    const saved = localStorage.getItem('spanishVerbsApp');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialState,
        ...parsed,
        section1: { ...initialState.section1, ...parsed.section1 },
        section2: { ...initialState.section2, ...parsed.section2 },
        section3: { ...initialState.section3, ...parsed.section3 },
        section4: { ...initialState.section4, ...parsed.section4 }
      };
    }
  } catch (error) {
    console.warn('Error loading state from localStorage:', error);
  }
  return initialState;
}

function saveStateToStorage(state) {
  try {
    localStorage.setItem('spanishVerbsApp', JSON.stringify(state));
  } catch (error) {
    console.warn('Error saving state to localStorage:', error);
  }
}

function appReducer(state, action) {
  let newState;

  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      newState = { ...state, darkMode: !state.darkMode };
      break;

    case 'SET_DARK_MODE':
      newState = { ...state, darkMode: action.payload };
      break;

    // Section 1 actions
    case 'SECTION1_MARK_KNOWN':
      newState = {
        ...state,
        section1: {
          ...state.section1,
          known: [...state.section1.known, action.payload],
          deck: state.section1.deck.filter(id => id !== action.payload)
        }
      };
      break;

    case 'SECTION1_MARK_REVIEW':
      const deckWithoutCurrent = state.section1.deck.filter(id => id !== action.payload);
      const randomIndex = Math.floor(Math.random() * (deckWithoutCurrent.length + 1));
      const newDeck = [
        ...deckWithoutCurrent.slice(0, randomIndex),
        action.payload,
        ...deckWithoutCurrent.slice(randomIndex)
      ];
      newState = {
        ...state,
        section1: {
          ...state.section1,
          review: state.section1.review.includes(action.payload)
            ? state.section1.review
            : [...state.section1.review, action.payload],
          deck: newDeck
        }
      };
      break;

    case 'SECTION1_NEXT':
      newState = {
        ...state,
        section1: {
          ...state.section1,
          currentIndex: state.section1.currentIndex + 1
        }
      };
      break;

    case 'SECTION1_REMOVE_REVIEW':
      newState = {
        ...state,
        section1: {
          ...state.section1,
          review: state.section1.review.filter(id => id !== action.payload)
        }
      };
      break;

    case 'SECTION1_RESET':
      newState = {
        ...state,
        section1: {
          known: [],
          review: [],
          currentIndex: 0,
          deck: verbs.map(v => v.id)
        }
      };
      break;

    // Section 2 actions
    case 'SECTION2_SET_TENSE':
      newState = {
        ...state,
        section2: {
          ...state.section2,
          selectedTense: action.payload
        }
      };
      break;

    case 'SECTION2_MARK_KNOWN':
      const knownKey = `${action.payload.verbId}_${action.payload.tense}`;
      newState = {
        ...state,
        section2: {
          ...state.section2,
          known: { ...state.section2.known, [knownKey]: true }
        }
      };
      break;

    case 'SECTION2_MARK_REVIEW':
      const reviewKey = `${action.payload.verbId}_${action.payload.tense}`;
      newState = {
        ...state,
        section2: {
          ...state.section2,
          review: { ...state.section2.review, [reviewKey]: true }
        }
      };
      break;

    case 'SECTION2_REMOVE_REVIEW':
      const { [action.payload]: _removedReview, ...remainingSection2Reviews } = state.section2.review;
      newState = {
        ...state,
        section2: {
          ...state.section2,
          review: remainingSection2Reviews
        }
      };
      break;

    case 'SECTION2_NEXT':
      newState = {
        ...state,
        section2: {
          ...state.section2,
          currentIndex: state.section2.currentIndex + 1
        }
      };
      break;

    case 'SECTION2_RESET':
      newState = {
        ...state,
        section2: {
          known: {},
          review: {},
          currentIndex: 0,
          selectedTense: state.section2.selectedTense
        }
      };
      break;

    // Section 3 actions
    case 'SECTION3_ANSWER':
      newState = {
        ...state,
        section3: {
          ...state.section3,
          attempts: state.section3.attempts + 1,
          correct: action.payload.isCorrect
            ? state.section3.correct + 1
            : state.section3.correct,
          answered: [...state.section3.answered, action.payload.questionId]
        }
      };
      break;

    case 'SECTION3_NEXT':
      newState = {
        ...state,
        section3: {
          ...state.section3,
          currentIndex: state.section3.currentIndex + 1
        }
      };
      break;

    case 'SECTION3_MARK_REVIEW':
      newState = {
        ...state,
        section3: {
          ...state.section3,
          review: state.section3.review.includes(action.payload)
            ? state.section3.review
            : [...state.section3.review, action.payload]
        }
      };
      break;

    case 'SECTION3_REMOVE_REVIEW':
      newState = {
        ...state,
        section3: {
          ...state.section3,
          review: state.section3.review.filter(id => id !== action.payload)
        }
      };
      break;

    case 'SECTION3_RESET':
      newState = {
        ...state,
        section3: {
          attempts: 0,
          correct: 0,
          currentIndex: 0,
          answered: [],
          review: state.section3.review
        }
      };
      break;

    // Section 4 actions
    case 'SECTION4_MARK_KNOWN':
      newState = {
        ...state,
        section4: {
          ...state.section4,
          known: [...state.section4.known, action.payload]
        }
      };
      break;

    case 'SECTION4_MARK_REVIEW':
      newState = {
        ...state,
        section4: {
          ...state.section4,
          review: state.section4.review.includes(action.payload)
            ? state.section4.review
            : [...state.section4.review, action.payload]
        }
      };
      break;

    case 'SECTION4_REMOVE_REVIEW':
      newState = {
        ...state,
        section4: {
          ...state.section4,
          review: state.section4.review.filter(id => id !== action.payload)
        }
      };
      break;

    case 'SECTION4_NEXT':
      newState = {
        ...state,
        section4: {
          ...state.section4,
          currentIndex: state.section4.currentIndex + 1
        }
      };
      break;

    case 'SECTION4_RESET':
      newState = {
        ...state,
        section4: {
          known: [],
          review: [],
          currentIndex: 0
        }
      };
      break;

    // Custom cards actions
    case 'ADD_CUSTOM_CARD':
      newState = {
        ...state,
        customCards: [
          ...state.customCards,
          { ...action.payload, id: Date.now() }
        ]
      };
      break;

    case 'UPDATE_CUSTOM_CARD':
      newState = {
        ...state,
        customCards: state.customCards.map(card =>
          card.id === action.payload.id ? action.payload : card
        )
      };
      break;

    case 'DELETE_CUSTOM_CARD':
      newState = {
        ...state,
        customCards: state.customCards.filter(card => card.id !== action.payload)
      };
      break;

    case 'IMPORT_CUSTOM_CARDS':
      newState = {
        ...state,
        customCards: action.payload
      };
      break;

    default:
      return state;
  }

  saveStateToStorage(newState);
  return newState;
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, loadStateFromStorage);

  // Apply dark mode to document
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
