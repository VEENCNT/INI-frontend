import React, { useState } from 'react';
import type { BiochemicalIndicator } from '../types';
import { currentUserId } from '../data';
import BiochemicalIndicatorGridCard from '../components/BiochemicalIndicatorGridCard';
import { Card, Button, Form } from 'react-bootstrap';

interface BiochemicalIndicatorGridPageProps {
  initialIndicators: BiochemicalIndicator[];
}

const BiochemicalIndicatorGridPage: 
  React.FC<BiochemicalIndicatorGridPageProps> = ({ initialIndicators }) => {
  const [indicators, setIndicators] = useState<BiochemicalIndicator[]>(initialIndicators);

  const [sliderValue, setSliderValue] = useState<number>(5000);
  const [activeFilter, setActiveFilter] = useState<number | null>(null);

  const handleLike = (id: number) => {
    setIndicators(indicators.map(indicator => {
      if (indicator.indicatorId === id) {
        const hasLiked = indicator.likes.includes(currentUserId);
        
        // Если лайк уже есть - убираем ID пользователя. Если нет - добавляем.
        const newLikes = hasLiked
          ? indicator.likes.filter(userId => userId !== currentUserId)
          : [...indicator.likes, currentUserId];
          
        return { ...indicator, likes: newLikes };
      }
      return indicator;
    }));
  };

  const handleDelete = (id: number) => {
    setIndicators(indicators.filter(indicator => indicator.indicatorId !== id));
  };

  const filteredIndicators = indicators.filter((indicator) => {
    if (activeFilter === null) return true;
    return activeFilter >= indicator.lowerReferenceLimit &&
           activeFilter <= indicator.upperReferenceLimit;
  });

  return (
    <div className="grid-container p-3 h-100 overflow-auto pb-5 mb-4">
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
        </Card.Body>
      </Card>
      
      <Button variant="purple" className="w-100 search-btn fw-bold mb-3" onClick={() => setActiveFilter(sliderValue)}>
        Поиск
      </Button>

      <div className="row g-2">
        {filteredIndicators.map((indicator) => (
          <div className="col-6" key={indicator.indicatorId}>
            <BiochemicalIndicatorGridCard 
              indicator={indicator} 
              onLike={handleLike} 
              onDelete={handleDelete} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BiochemicalIndicatorGridPage;