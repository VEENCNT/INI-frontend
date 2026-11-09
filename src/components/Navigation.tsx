import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearCredentials } from '../features/auth/authSlice';
import { fetchIndicators, resetFilter } from '../features/indicators/indicatorsSlice';
import { logoutRequest } from '../api/authApi';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    // Деавторизация: только axios, состояние в Redux передается вручную
    try {
      await logoutRequest();
    } catch {
      // Сессия на бэкенде могла уже истечь — все равно выходим локально
    }
    dispatch(clearCredentials());
    dispatch(resetFilter());
    dispatch(fetchIndicators({}));
    navigate('/biochemical-indicator/feed');
  };

  return (
    <div className="bottom-navbar">
      <Link
        to="/biochemical-indicator/feed"
        className={`nav-item ${location.pathname === '/biochemical-indicator/feed' || location.pathname === '/' ? 'active' : ''}`}
      >
        <div className="nav-icon-wrapper">
          <img src="/images/feed.svg" alt="Лента" className="nav-icon-img" />
        </div>
        <span className="nav-label">Лента</span>
      </Link>

      {isAuthenticated ? (
        <Link
          to="/biochemical-indicator/draft"
          className={`nav-item ${location.pathname === '/biochemical-indicator/draft' ? 'active' : ''}`}
        >
          <div className="nav-icon-wrapper">
            <img src="/images/add.svg" alt="Добавить" className="nav-icon-img" />
          </div>
          <span className="nav-label">Добавить</span>
        </Link>
      ) : (
        <div className="nav-item disabled">
          <div className="nav-icon-wrapper">
            <img src="/images/add.svg" alt="Добавить" className="nav-icon-img" />
          </div>
          <span className="nav-label">Добавить</span>
        </div>
      )}

      <Link to="/biochemical-indicator/grid" className={`nav-item ${location.pathname === '/biochemical-indicator/grid' ? 'active' : ''}`}>
        <div className="nav-icon-wrapper">
          <img src="/images/grid.svg" alt="Плитка" className="nav-icon-img" />
        </div>
        <span className="nav-label">Плитка</span>
      </Link>

      {isAuthenticated ? (
        <div className="nav-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <div className="nav-icon-wrapper">
            <img src="/images/logout.svg" alt="Выход" className="nav-icon-img" />
          </div>
          <span className="nav-label">Выход</span>
        </div>
      ) : (
        <Link to="/user/login" className={`nav-item ${location.pathname === '/user/login' ? 'active' : ''}`}>
          <div className="nav-icon-wrapper">
            <img src="/images/login.svg" alt="Вход" className="nav-icon-img" />
          </div>
          <span className="nav-label">Вход</span>
        </Link>
      )}
    </div>
  );
};

export default Navigation;
