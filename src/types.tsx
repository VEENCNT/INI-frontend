export interface BiochemicalIndicator {
  indicatorId: number;
  title: string;
  description: string;
  lowerReferenceLimit: number;
  upperReferenceLimit: number;
  imageUrl?: string;
  videoUrl?: string;
  /** Количество лайков (контракт бэкенда) */
  likesCount: number;
  /** Лайк текущего пользователя (контракт бэкенда) */
  isLiked: boolean;
  /** Текущий пользователь — создатель показателя (признак бэкенда) */
  isOwner: boolean;
}

export interface AuthUser {
  userId: number;
  login: string;
}

export interface BiochemicalIndicatorFilter {
  /** Значение содержания вещества в крови — должно попадать в диапазон показателя (indicatorConcentration на бэкенде) */
  indicatorConcentration?: number;
}

/** Черновик показателя (контракт GET /api/biochemical-indicators/draft) */
export interface BiochemicalIndicatorDraft {
  indicatorId: number | null;
  title: string;
  description: string;
  lowerReferenceLimit: number | null;
  upperReferenceLimit: number | null;
  imageUrl?: string;
  videoUrl?: string;
}

/** Шаг 1: создание черновика — POST multipart (только title, image, video) */
export interface DraftMediaForm {
  title: string;
  imageFile?: File;
  videoFile?: File;
}

/** Шаг 2: публикация черновика — PUT (только description и границы) */
export interface DraftPublishForm {
  description: string;
  lowerReferenceLimit: number;
  upperReferenceLimit: number;
}
