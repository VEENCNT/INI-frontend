import type { BiochemicalIndicator } from './types';

export const mockIndicators: BiochemicalIndicator[] = [
  {
    indicatorId: 1,
    title: 'Крайне низкий альбумин',
    description: 'Серьезный дефицит основного белка крови, может указывать на проблемы с печенью или почками.',
    lowerReferenceLimit: 35,
    upperReferenceLimit: 50,
    likesCount: 3,
    isLiked: false,
    isOwner: false,
  },
  {
    indicatorId: 2,
    title: 'Высокий холестерин',
    description: 'Повышенный уровень липидов, фактор риска сердечно-сосудистых заболеваний.',
    lowerReferenceLimit: 3.0,
    upperReferenceLimit: 5.2,
    imageUrl: '/images/cholesterol.png',
    videoUrl: '/videos/cholesterol.mp4',
    likesCount: 5,
    isLiked: false,
    isOwner: false,
  },
  {
    indicatorId: 3,
    title: 'Нормальный уровень лимфоцитов',
    description: 'Показатель углеводного обмена в пределах нормы.',
    lowerReferenceLimit: 2000,
    upperReferenceLimit: 4800,
    imageUrl: '/images/lymphocytes.png',
    videoUrl: '/videos/lymphocytes.mp4',
    likesCount: 12,
    isLiked: false,
    isOwner: false,
  },
];
