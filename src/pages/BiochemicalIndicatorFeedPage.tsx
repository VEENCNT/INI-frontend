import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { BiochemicalIndicator } from '../types';
import BiochemicalIndicatorFeedCard from '../components/BiochemicalIndicatorFeedCard';
import { currentUserId } from '../data';

interface BiochemicalIndicatorFeedPageProps {
  initialIndicators: BiochemicalIndicator[];
}

const BiochemicalIndicatorFeedPage: 
  React.FC<BiochemicalIndicatorFeedPageProps> = ({ initialIndicators }) => {
  const [indicators, setIndicators] = useState<BiochemicalIndicator[]>(initialIndicators);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const indicatorIdParam = searchParams.get('indicatorId');
  const nextParam = searchParams.get('next');

  let baseIndex = 0;
  if (indicatorIdParam) {
    const foundIndex = indicators.findIndex(indicator => 
      indicator.indicatorId === Number(indicatorIdParam)
    );
    if (foundIndex !== -1) {
      baseIndex = foundIndex;
    }
  }

  let currentIndex = baseIndex;
  if (nextParam === 'true' && indicators.length > 0) {
    currentIndex = (baseIndex + 1) % indicators.length;
  }

  const currentIndicator = indicators[currentIndex] || indicators[0];

  const handleLike = (id: number) => {
    setIndicators(indicators.map(indicator => {
      if (indicator.indicatorId === id) {
        const hasLiked = indicator.likes.includes(currentUserId);
        const newLikes = hasLiked
          ? indicator.likes.filter(userId => userId !== currentUserId)
          : [...indicator.likes, currentUserId];
          
        return { ...indicator, likes: newLikes };
      }
      return indicator;
    }));
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleNext = () => {
    if (!currentIndicator) return;
    navigate(`/biochemical-indicator/feed?indicatorId=${currentIndicator.indicatorId}&next=true`);
  };

  if (!currentIndicator) {
    return <div className="p-3 text-center">Показатели не найдены</div>;
  }

  return (
    <div className="feed-container" style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <BiochemicalIndicatorFeedCard 
        indicator={currentIndicator}
        isExpanded={expandedId === currentIndicator.indicatorId}
        onLike={handleLike}
        onToggleExpand={toggleExpand}
        onNext={handleNext}
      />
    </div>
  );
};

export default BiochemicalIndicatorFeedPage;