import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchIndicators,
  removeIndicator,
  setFilterValue,
  toggleIndicatorLike,
} from '../features/indicators/indicatorsSlice';
import BiochemicalIndicatorGridCard from '../components/BiochemicalIndicatorGridCard';
import LoadingOverlay from '../components/LoadingOverlay';
import { Card, Button, Form } from 'react-bootstrap';

const BiochemicalIndicatorGridPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const indicators = useAppSelector((state) => state.indicators.items);
  const loading = useAppSelector((state) => state.indicators.loading);
  const filterValue = useAppSelector((state) => state.indicators.filterValue);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [sliderValue, setSliderValue] = useState<number>(filterValue ?? 5000);

  useEffect(() => {
    dispatch(fetchIndicators({ indicatorConcentration: filterValue ?? undefined }));
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    dispatch(setFilterValue(sliderValue));
    // Фильтр добавляется в запрос к бэкенду (?indicatorConcentration=)
    dispatch(fetchIndicators({ indicatorConcentration: sliderValue }));
  };

  return (
    <div className="grid-container p-3 h-100 overflow-auto pb-5 mb-4 position-relative">
      {loading && <LoadingOverlay />}
      <h1 className="page-title mb-3">Биохимические показатели</h1>

      <Card className="search-card mb-3 shadow-none">
        <Card.Body className="p-3">
          <div className="search-title mb-3 text-purple">Количество вещества в крови, ед.</div>
          <div className="slider-container">
            <span className="slider-label">0</span>
            <Form.Range
              min={0} max={5000} step={1} value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="custom-slider"
            />
            <span className="slider-label">5000</span>
          </div>
          <div className="slider-value text-center text-purple fw-bold mt-3 mb-0">Выбрано: {sliderValue} ед.</div>
        </Card.Body>
      </Card>

      <Button
        variant="purple"
        className="w-100 search-btn fw-bold mb-3"
        onClick={handleSearch}
        disabled={loading}
      >
        Поиск
      </Button>

      <div className="row g-2">
        {indicators.map((indicator) => (
          <div className="col-6" key={indicator.indicatorId}>
            <BiochemicalIndicatorGridCard
              indicator={indicator}
              isLiked={indicator.isLiked}
              canInteract={isAuthenticated}
              canDelete={isAuthenticated && indicator.isOwner}
              onLike={(id) => dispatch(toggleIndicatorLike(id))}
              onDelete={(id) => dispatch(removeIndicator(id))}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BiochemicalIndicatorGridPage;
