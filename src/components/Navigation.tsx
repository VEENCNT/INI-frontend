import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <div className="bottom-navbar">
      {/* Лента */}
      <Link 
        to="/biochemical-indicator/feed" 
        className={`nav-item ${location.pathname === '/biochemical-indicator/feed' || location.pathname === '/' ? 'active' : ''}`}
      >
        <div className="nav-icon-wrapper">
          <img src="/images/feed.svg" alt="Лента" className="nav-icon-img" />
        </div>
        <span className="nav-label">Лента</span>
      </Link>

      {/* Добавить (неактивно) */}
      <div className="nav-item disabled">
        <div className="nav-icon-wrapper">
          <img src="/images/add.svg" alt="Добавить" className="nav-icon-img" />
        </div>
        <span className="nav-label">Добавить</span>
      </div>

      {/* Плитка */}
      <Link to="/biochemical-indicator/grid" className={`nav-item ${location.pathname === '/biochemical-indicator/grid' ? 'active' : ''}`}>
        <div className="nav-icon-wrapper">
          <img src="/images/grid.svg" alt="Плитка" className="nav-icon-img" />
        </div>
        <span className="nav-label">Плитка</span>
      </Link>

      {/* Вход (неактивно) */}
      <div className="nav-item disabled">
        <div className="nav-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="nav-icon-img" viewBox="0 0 16 16">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
          </svg>
        </div>
        <span className="nav-label">Вход</span>
      </div>
    </div>
  );
};

export default Navigation;