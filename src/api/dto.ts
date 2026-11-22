import type { BiochemicalIndicatorResponseDto } from './generated/biochemicalIndicatorApi';
import type { BiochemicalIndicator, BiochemicalIndicatorDraft } from '../types';

/** DTO сгенерированного клиента -> модель фронтенда */
export function toIndicator(dto: BiochemicalIndicatorResponseDto): BiochemicalIndicator {
  return {
    indicatorId: Number(dto.indicatorId ?? 0),
    title: dto.title,
    description: dto.description,
    lowerReferenceLimit: dto.lowerReferenceLimit,
    upperReferenceLimit: dto.upperReferenceLimit,
    imageUrl: dto.imageUrl || undefined,
    videoUrl: dto.videoUrl || undefined,
    likesCount: dto.likesCount ?? 0,
    isLiked: Boolean(dto.isLiked),
    isOwner: Boolean(dto.isOwner),
  };
}

/** DTO сгенерированного клиента -> черновик (null при отсутствии черновика) */
export function toDraft(dto: BiochemicalIndicatorResponseDto): BiochemicalIndicatorDraft {
  return {
    indicatorId: dto.indicatorId != null ? Number(dto.indicatorId) : null,
    title: dto.title ?? '',
    description: dto.description ?? '',
    lowerReferenceLimit: dto.lowerReferenceLimit ?? null,
    upperReferenceLimit: dto.upperReferenceLimit ?? null,
    imageUrl: dto.imageUrl || undefined,
    videoUrl: dto.videoUrl || undefined,
  };
}
