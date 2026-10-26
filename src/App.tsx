import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Header from './components/Header';
import Navigation from './components/Navigation';
import BiochemicalIndicatorFeedPage from './pages/BiochemicalIndicatorFeedPage';
import BiochemicalIndicatorGridPage from './pages/BiochemicalIndicatorGridPage';
import BiochemicalIndicatorDraftPage from './pages/BiochemicalIndicatorDraftPage';
import UserLoginPage from './pages/UserLoginPage';

import { mockIndicators } from './data';

const App: React.FC = () => {
  return (
    <Router>
      <div className="mobile-container">
        <Header />

        <main className="app-content">
          <Routes>
            <Route path="/" element={<BiochemicalIndicatorFeedPage initialIndicators={mockIndicators} />} />
            <Route path="/biochemical-indicator/feed" element={<BiochemicalIndicatorFeedPage initialIndicators={mockIndicators} />} />
            <Route path="/biochemical-indicator/grid" element={<BiochemicalIndicatorGridPage initialIndicators={mockIndicators} />} />
            <Route path="/biochemical-indicator/draft" element={<BiochemicalIndicatorDraftPage />} />
            <Route path="/user/login" element={<UserLoginPage />} />
          </Routes>
        </main>

        <Navigation />
      </div>
    </Router>
  );
};

export default App;