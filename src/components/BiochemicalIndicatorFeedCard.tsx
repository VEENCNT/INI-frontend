import React from 'react';
import type { BiochemicalIndicator } from '../types';
import { currentUserId } from '../data';

interface BiochemicalIndicatorFeedCardProps {
  indicator: BiochemicalIndicator;
  isExpanded: boolean;
  onLike: (id: number) => void;
  onToggleExpand: (id: number) => void;
  onNext: () => void;
}

const BiochemicalIndicatorFeedCard: React.FC<BiochemicalIndicatorFeedCardProps> = ({ indicator, isExpanded, onLike, onToggleExpand, onNext }) => {
  const isLiked = indicator.likes.includes(currentUserId);
  const likesCount = indicator.likes.length;

  return (
    <div className="feed-slide">
      {indicator.videoUrl ? (
        <video className="feed-bg" src={indicator.videoUrl} autoPlay loop muted playsInline />
      ) : indicator.imageUrl ? (
        <img className="feed-bg" src={indicator.imageUrl} alt={indicator.title} />
      ) : (
        <video className="feed-bg" src="/videos/placeholder.mp4" autoPlay loop muted playsInline />
      )}
      
      <div className="overlay-gradient"></div>

      <div className="feed-info">
        <h2 className="feed-title">{indicator.title}</h2>
        <p className={`feed-desc ${isExpanded ? 'expanded' : ''}`}>
          {indicator.description}
        </p>
        <button className="expand-btn" onClick={() => onToggleExpand(indicator.indicatorId)}>
          {isExpanded ? 'Свернуть' : 'Еще'}
        </button>
      </div>

      <div className="actions-column">
        <div className="action-item">
          <div className="action-btn"><span className="action-btn-text text-black">Макс.</span></div>
          <span className="action-text">{indicator.upperReferenceLimit} ед.</span>
        </div>
        <div className="action-item">
          <div className="action-btn"><span className="action-btn-text text-black">Мин.</span></div>
          <span className="action-text">{indicator.lowerReferenceLimit} ед.</span>
        </div>
        <div className="action-item">
          <div className="action-btn" onClick={() => onLike(indicator.indicatorId)} style={{ cursor: 'pointer' }}>
            <img 
              src={isLiked ? "/images/heart_colored.svg" : "/images/heart.svg"} 
              alt="Сердце" width="24" 
            />
          </div>
          <span className="action-text">{likesCount}</span>
        </div>
        
        {/* Кнопка "Следующий" с обработчиком onClick */}
        <div className="action-item">
          <div className="action-btn" onClick={onNext} style={{ cursor: 'pointer' }}>
            <img src="/images/next.svg" alt="Следующий" width="24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiochemicalIndicatorFeedCard;