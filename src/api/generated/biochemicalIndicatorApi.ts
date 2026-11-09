import type {
  BiochemicalIndicator,
  BiochemicalIndicatorDraft,
  BiochemicalIndicatorFilter,
  DraftMediaForm,
  DraftPublishForm,
} from '../../types';
import { http } from '../http';

/**
 * Сгенерированный (по swagger веб-сервиса) клиент домена «Биохимические показатели».
 * Имена методов соответствуют теме проекта. Маршруты — по таблице HTTP API эндпонтов.
 */

export interface BiochemicalIndicatorListResponse {
  indicators: BiochemicalIndicator[];
}

/** Ответ бэкенда: лайки приходят полями likesCount / isLiked, владение — isOwner */
type BiochemicalIndicatorResponse = Omit<BiochemicalIndicator, 'likesCount' | 'isLiked' | 'isOwner'> & {
  likesCount?: number;
  isLiked?: boolean | number;
  isOwner?: boolean | number;
};

function normalizeIndicator(indicator: BiochemicalIndicatorResponse): BiochemicalIndicator {
  return {
    ...indicator,
    likesCount: indicator.likesCount ?? 0,
    isLiked: Boolean(indicator.isLiked),
    isOwner: Boolean(indicator.isOwner),
  };
}

/** GET /api/biochemical-indicators?indicatorConcentration= — список с фильтрацией */
export async function getBiochemicalIndicators(
  filter: BiochemicalIndicatorFilter = {},
): Promise<BiochemicalIndicator[]> {
  const params: Record<string, string | number> = {};
  if (filter.indicatorConcentration !== undefined) {
    params.indicatorConcentration = filter.indicatorConcentration;
  }

  const response = await http.get<
    BiochemicalIndicatorResponse[] | BiochemicalIndicatorListResponse
  >('/biochemical-indicators', { params });

  const list = Array.isArray(response.data) ? response.data : response.data.indicators;
  return list.map(normalizeIndicator);
}

/** GET /api/biochemical-indicators/feed — первый элемент ленты публикаций */
export async function getBiochemicalIndicatorFeedFirst(): Promise<BiochemicalIndicator> {
  const response = await http.get<BiochemicalIndicatorResponse>('/biochemical-indicators/feed');
  return normalizeIndicator(response.data);
}

/** GET /api/biochemical-indicators/feed?indicatorId=&next=true — следующий элемент ленты */
export async function getNextBiochemicalIndicator(
  indicatorId: number,
): Promise<BiochemicalIndicator> {
  const response = await http.get<BiochemicalIndicatorResponse>('/biochemical-indicators/feed', {
    params: { indicatorId, next: true },
  });
  return normalizeIndicator(response.data);
}

/** GET /api/biochemical-indicators/draft — черновик текущего пользователя (или дефолтная структура с null) */
export async function getBiochemicalIndicatorDraft(): Promise<BiochemicalIndicatorDraft> {
  const response = await http.get<BiochemicalIndicatorDraft>('/biochemical-indicators/draft');
  return response.data;
}

/** POST /api/biochemical-indicators/draft — создание черновика (multipart: title, image, video) */
export async function createBiochemicalIndicatorDraft(
  form: DraftMediaForm,
): Promise<BiochemicalIndicatorDraft> {
  const formData = new FormData();
  formData.append('title', form.title);
  if (form.imageFile) formData.append('image', form.imageFile);
  if (form.videoFile) formData.append('video', form.videoFile);

  const response = await http.post<BiochemicalIndicatorDraft>(
    '/biochemical-indicators/draft',
    formData,
  );
  return response.data;
}

/** PUT /api/biochemical-indicators/draft/publish — публикация (description, lowerReferenceLimit, upperReferenceLimit) */
export async function publishBiochemicalIndicatorDraft(
  form: DraftPublishForm,
): Promise<BiochemicalIndicator> {
  const response = await http.put<BiochemicalIndicatorResponse>(
    '/biochemical-indicators/draft/publish',
    form,
  );
  return normalizeIndicator(response.data);
}

/** DELETE /api/biochemical-indicators/{indicatorId} — мягкое удаление (только создатель) */
export async function deleteBiochemicalIndicator(indicatorId: number): Promise<void> {
  await http.delete(`/biochemical-indicators/${indicatorId}`);
}

/** POST /api/biochemical-indicators/{indicatorId}/like — body: { "like": 1 | 0 } */
export async function setBiochemicalIndicatorLike(
  indicatorId: number,
  like: boolean,
): Promise<BiochemicalIndicator> {
  const response = await http.post<BiochemicalIndicatorResponse>(
    `/biochemical-indicators/${indicatorId}/like`,
    { like: like ? 1 : 0 },
  );
  return normalizeIndicator(response.data);
}
