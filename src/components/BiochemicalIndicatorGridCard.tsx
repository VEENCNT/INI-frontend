import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { BiochemicalIndicator } from '../types';
import { resolveMediaUrl } from '../utils/media';

interface BiochemicalIndicatorGridCardProps {
  indicator: BiochemicalIndicator;
  isLiked: boolean;
  /** Лайк доступен только авторизованному пользователю */
  canInteract: boolean;
  /** Удаление доступно только создателю показателя */
  canDelete: boolean;
  onLike: (id: number) => void;
  onDelete: (id: number) => void;
}

const BiochemicalIndicatorGridCard: React.FC<BiochemicalIndicatorGridCardProps> = ({
  indicator,
  isLiked,
  canInteract,
  canDelete,
  onLike,
  onDelete,
}) => {
  const likesCount = indicator.likesCount;
  const imageUrl = resolveMediaUrl(indicator.imageUrl);

  const navigate = useNavigate();

  return (
    <Card className="h-100 shadow-none indicator-card">
      <div className="card-img-wrapper">
        <img
          src={imageUrl || '/images/placeholder.png'}
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
          <div className={`d-flex justify-content-between align-items-center gap-2 ${canDelete ? 'mb-2' : ''}`}>
            {canInteract && (
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
            )}

            <Button
              variant="purple"
              className="btn-small flex-grow-1"
              onClick={() => navigate(`/biochemical-indicator/feed?indicatorId=${indicator.indicatorId}`)}
            >
              Подробнее
            </Button>
          </div>

          {canDelete && (
            <Button
              variant="purple"
              className="btn-small w-100"
              onClick={() => onDelete(indicator.indicatorId)}
            >
              Удалить
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default BiochemicalIndicatorGridCard;
