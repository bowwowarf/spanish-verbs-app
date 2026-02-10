import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';
import Home from './sections/Home';
import Section1_VerbMeaning from './sections/Section1_VerbMeaning';
import Section2_Conjugations from './sections/Section2_Conjugations';
import Section3_FillBlank from './sections/Section3_FillBlank';
import Section4_Translation from './sections/Section4_Translation';
import Section5_CustomCards from './sections/Section5_CustomCards';
import ReviewPage from './sections/ReviewPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors">
          <Navigation />

          {/* Main content area */}
          <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/section1" element={<Section1_VerbMeaning />} />
              <Route path="/section2" element={<Section2_Conjugations />} />
              <Route path="/section3" element={<Section3_FillBlank />} />
              <Route path="/section4" element={<Section4_Translation />} />
              <Route path="/section5" element={<Section5_CustomCards />} />
              <Route path="/review" element={<ReviewPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
