import React, { useState, useRef, useEffect } from 'react';
import type { BiochemicalIndicator } from '../types';
import BiochemicalIndicatorFeedCard from '../components/BiochemicalIndicatorFeedCard';
import { currentUserId } from '../data';

interface BiochemicalIndicatorFeedPageProps {
  initialIndicators: BiochemicalIndicator[];
}

const BiochemicalIndicatorFeedPage: 
  React.FC<BiochemicalIndicatorFeedPageProps> = ({ initialIndicators }) => {
  const [indicators, setIndicators] = useState(initialIndicators);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  const loopedIndicators = [...indicators, ...indicators, ...indicators];

  useEffect(() => {
    if (feedContainerRef.current && indicators.length > 0) {
      const cardHeight = feedContainerRef.current.clientHeight;
      feedContainerRef.current.scrollTop = indicators.length * cardHeight;
    }
  }, [indicators.length]);

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
    if (!feedContainerRef.current) return;
    const container = feedContainerRef.current;
    const cardHeight = container.clientHeight;
    
    container.style.scrollSnapType = 'none';
    
    const currentIndex = Math.round(container.scrollTop / cardHeight);
    
    container.scrollTo({
      top: (currentIndex + 1) * cardHeight,
      behavior: 'smooth'
    });

    setTimeout(() => {
      if (container) container.style.scrollSnapType = 'y mandatory';
    }, 500);
  };

  const handleScroll = () => {
    if (!feedContainerRef.current || indicators.length === 0) return;
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      const container = feedContainerRef.current;
      if (!container) return;
      
      const cardHeight = container.clientHeight;
      const currentIndex = Math.round(container.scrollTop / cardHeight);

      if (currentIndex >= indicators.length * 2) {
        container.style.scrollSnapType = 'none';
        container.scrollTop = (currentIndex - indicators.length) * cardHeight;

        requestAnimationFrame(() => {
          if (container) container.style.scrollSnapType = 'y mandatory';
        });
      } 
      
      else if (currentIndex < indicators.length) {
        container.style.scrollSnapType = 'none';
        container.scrollTop = (currentIndex + indicators.length) * cardHeight;
        requestAnimationFrame(() => {
          if (container) container.style.scrollSnapType = 'y mandatory';
        });
      }
    }, 100);
  };

  return (
    <div 
      className="feed-container" 
      ref={feedContainerRef}
      onScroll={handleScroll}
    >
      {loopedIndicators.map((indicator, index) => (
        <BiochemicalIndicatorFeedCard 
          key={`${indicator.indicatorId}-${index}`} 
          indicator={indicator}
          isExpanded={expandedId === indicator.indicatorId}
          onLike={handleLike}
          onToggleExpand={toggleExpand}
          onNext={handleNext}
        />
      ))}
    </div>
  );
};

export default BiochemicalIndicatorFeedPage;