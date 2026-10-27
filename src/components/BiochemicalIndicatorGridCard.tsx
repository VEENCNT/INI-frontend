import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { BiochemicalIndicator } from '../types';
import { currentUserId } from '../data';

interface BiochemicalIndicatorGridCardProps {
  indicator: BiochemicalIndicator;
  onLike: (id: number) => void;
  onDelete: (id: number) => void;
}

const BiochemicalIndicatorGridCard: React.FC<BiochemicalIndicatorGridCardProps> = ({ indicator, onLike, onDelete }) => {
  const isLiked = indicator.likes.includes(currentUserId);
  const likesCount = indicator.likes.length;

  const navigate = useNavigate();

  return (
    <Card className="h-100 shadow-none indicator-card">
      <div className="card-img-wrapper">
        <img 
          src={indicator.imageUrl || '/images/placeholder.png'} 
          alt={indicator.title} 
          className="card-img-top"
        />
      </div>
      <Card.Body className="p-2 d-flex flex-column">
        <Card.Title className="card-title text-truncate-2">{indicator.title}</Card.Title>
        <div className="card-range mb-2">
          Показания: {indicator.lowerReferenceLimit}-{indicator.upperReferenceLimit} ед.
        </div>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2 gap-2">
            <Button 
              className={`like-pill ${isLiked ? 'is-liked' : ''}`}
              onClick={() => onLike(indicator.indicatorId)}
            >
              <img 
                src={isLiked ? "/images/heart_colored.svg" : "/images/heart.svg"} 
                alt="Лайк" 
                className="like-icon"
              />
              <span className="like-count">{likesCount}</span>
            </Button>
            
            <Button 
              variant="purple" 
              className="btn-small flex-grow-1"
              onClick={() => navigate(`/biochemical-indicator/feed?indicatorId=${indicator.indicatorId}`)}
            >
              Подробнее
            </Button>
          </div>
          
          <Button 
            variant="purple" 
            className="btn-small w-100"
            onClick={() => onDelete(indicator.indicatorId)}
          >
            Удалить
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BiochemicalIndicatorGridCard;