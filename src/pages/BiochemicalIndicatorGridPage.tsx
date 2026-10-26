// import React, { useState } from 'react';
// import { mockIndicators } from '../data';
// import { Card, Button, Form } from 'react-bootstrap';

// const GridPage: React.FC = () => {
//   const [indicators, setIndicators] = useState(mockIndicators);
//   const [sliderValue, setSliderValue] = useState<number>(5000);
//   const [activeFilter, setActiveFilter] = useState<number | null>(null);

//   const handleLike = (id: number) => {
//     setIndicators(indicators.map(indicators => {
//       if (indicators.indicatorId === id) {
//         return {
//           ...indicators,
//           isLiked: !indicators.isLiked,
//           likesCount: indicators.isLiked ? indicators.likesCount - 1 : indicators.likesCount + 1
//         };
//       }
//       return indicators;
//     }));
//   };

//   const filteredIndicators = indicators.filter((ind) => {
//     if (activeFilter === null) return true;
//     return activeFilter >= ind.lowerReferenceLimit && activeFilter <= ind.upperReferenceLimit;
//   });

//   return (
//     <div className="grid-container p-3 h-100 overflow-auto pb-5 mb-4">
//       <h1 className="page-title mb-3">Биохимические показатели</h1>

//       {/* Блок поиска */}
//       <Card className="search-card mb-3 shadow-none">
//         <Card.Body className="p-3">
//           <div className="search-title mb-3 text-purple">Количество вещества в крови, ед.</div>
          
//           <div className="slider-container">
//             <span className="slider-label">0</span>
//             <Form.Range 
//               min={0} 
//               max={5000} 
//               step={1} 
//               value={sliderValue} 
//               onChange={(e) => setSliderValue(Number(e.target.value))} 
//               className="custom-slider"
//             />
//             <span className="slider-label">5000</span>
//           </div>
//         </Card.Body>
//       </Card>
      
//       {/* Кнопка Поиск вынесена из карточки */}
//       <Button 
//         variant="purple" 
//         className="w-100 search-btn fw-bold mb-3" 
//         onClick={() => setActiveFilter(sliderValue)}
//       >
//         Поиск
//       </Button>

//       {/* Сетка карточек */}
//       <div className="row g-2">
//         {filteredIndicators.map((indicator) => (
//           <div className="col-6" key={indicator.indicatorId}>
//             <Card className="h-100 shadow-none indicator-card">
//               <div className="card-img-wrapper">
//                 <img 
//                   src={indicator.imageUrl || '/images/default-image.jpg'} 
//                   alt={indicator.title} 
//                   className="card-img-top"
//                 />
//               </div>
//               <Card.Body className="p-2 d-flex flex-column">
//                 <Card.Title className="card-title text-truncate-2">{indicator.title}</Card.Title>
//                 <div className="card-range mb-2">
//                   Показания: {indicator.lowerReferenceLimit}-{indicator.upperReferenceLimit} ед.
//                 </div>
                
//                 <div className="mt-auto">
//                   <div className="d-flex justify-content-between align-items-center mb-2">
//                     <Button
//                       className={`like-pill ${indicator.isLiked ? 'is-liked' : ''}`}
//                       onClick={() => handleLike(indicator.indicatorId)}
//                     >
//                       <img 
//                         src={indicator.isLiked ? "/images/heart_colored.svg" : "/images/heart.svg"} 
//                         alt="Лайк" 
//                         style={{ width: '14px', height: '14px', marginRight: '4px' }} 
//                       />
//                       <span className="like-count">{indicator.likesCount}</span>
//                     </Button>
//                     <Button variant="purple" className="btn-small px-2 py-1">Подробнее</Button>
//                   </div>
//                   <Button variant="purple" className="btn-small w-100 py-1">Удалить</Button>
//                 </div>
//               </Card.Body>
//             </Card>
//           </div>
//         ))}
//         {filteredIndicators.length === 0 && (
//           <div className="text-center w-100 mt-4 text-muted">
//             Ничего не найдено
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GridPage;

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