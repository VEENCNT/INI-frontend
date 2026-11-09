import React from 'react';
import { Spinner } from 'react-bootstrap';

/** Анимация загрузки, блокирующая взаимодействие со страницей во время запросов */
const LoadingOverlay: React.FC = () => {
  return (
    <div className="loading-overlay">
      <Spinner animation="border" className="loading-spinner" />
    </div>
  );
};

export default LoadingOverlay;
