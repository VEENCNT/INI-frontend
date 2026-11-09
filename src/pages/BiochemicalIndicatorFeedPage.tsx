import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchFeedFirst, fetchFeedNext, toggleIndicatorLike } from '../features/indicators/indicatorsSlice';
import BiochemicalIndicatorFeedCard from '../components/BiochemicalIndicatorFeedCard';
import LoadingOverlay from '../components/LoadingOverlay';

const BiochemicalIndicatorFeedPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const feedItems = useAppSelector((state) => state.indicators.feedItems);
  const feedIndex = useAppSelector((state) => state.indicators.feedIndex);
  const feedLoading = useAppSelector((state) => state.indicators.feedLoading);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [searchParams] = useSearchParams();

  // Лента загружается своим эндпоинтом и не зависит от фильтра страницы «Плитка»
  useEffect(() => {
    if (feedItems.length === 0) {
      dispatch(fetchFeedFirst());
    }
  }, [dispatch, feedItems.length]);

  // Позиционирование по ?indicatorId= (переход «Подробнее» из плитки)
  const indicatorIdParam = searchParams.get('indicatorId');
  let currentIndex = feedIndex;
  if (indicatorIdParam) {
    const foundIndex = feedItems.findIndex(
      (indicator) => indicator.indicatorId === Number(indicatorIdParam),
    );
    if (foundIndex !== -1) {
      currentIndex = foundIndex;
    }
  }

  const currentIndicator = feedItems[currentIndex] || feedItems[0];

  const handleLike = (id: number) => {
    dispatch(toggleIndicatorLike(id));
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleNext = () => {
    if (!currentIndicator) return;
    dispatch(fetchFeedNext(currentIndicator.indicatorId));
  };

  if (!currentIndicator) {
    return (
      <div className="p-3 text-center position-relative h-100">
        {feedLoading && <LoadingOverlay />}
        Показатели не найдены
      </div>
    );
  }

  return (
    <div className="feed-container" style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      {feedLoading && <LoadingOverlay />}
      <BiochemicalIndicatorFeedCard
        indicator={currentIndicator}
        isExpanded={expandedId === currentIndicator.indicatorId}
        isLiked={currentIndicator.isLiked}
        canInteract={isAuthenticated}
        onLike={handleLike}
        onToggleExpand={toggleExpand}
        onNext={handleNext}
      />
    </div>
  );
};

export default BiochemicalIndicatorFeedPage;
