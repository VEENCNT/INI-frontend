/**
 * Демонстрационный режим работы без бэкенда (GitHub Pages).
 *
 * При сборке для GitHub Pages выставляется VITE_MOCK_MODE=true; дополнительно
 * режим включается автоматически на домене *.github.io и по параметру ?mock.
 * Все запросы к /api перехватываются axios-адаптером и обслуживаются локальными
 * данными из localStorage — приложение остаётся полностью работоспособным,
 * включая вход, лайки, черновик, публикацию и удаление.
 */
import axios, { type AxiosAdapter, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { biochemicalIndicatorApi } from './generated/client';

const STORAGE_KEY = 'ini-mock-state-v1';

export interface MockIndicator {
  indicatorId: number;
  title: string;
  description: string;
  lowerReferenceLimit: number;
  upperReferenceLimit: number;
  imageUrl?: string;
  videoUrl?: string;
  likesCount: number;
  isLiked: boolean;
  isOwner: boolean;
  creatorId: number;
}

interface MockDraft {
  indicatorId: number | null;
  title: string;
  description: string;
  lowerReferenceLimit: number | null;
  upperReferenceLimit: number | null;
  imageUrl?: string;
  videoUrl?: string;
}

interface MockState {
  indicators: MockIndicator[];
  draft: MockDraft;
}

let currentUserId = 0;

const asset = (file: string): string => `${import.meta.env.BASE_URL}${file.replace(/^\/+/, '')}`;

function seedIndicators(): MockIndicator[] {
  const rows: Array<[string, number, number, number, string]> = [
    ['Нормальный Альбумин', 35, 50, 12, 'albumin.png'],
    ['Высокий холестерин', 3, 5.2, 128, 'cholesterol.png'],
    ['Нормальное число лимфоцитов', 2000, 4800, 7, 'lymphocytes.png'],
    ['Низкий Альбумин', 25, 35, 3, 'albumin.png'],
    ['Нормальный холестерин', 3, 5.2, 42, 'cholesterol.png'],
    ['Крайне низкий Альбумин', 10, 25, 0, 'lymphocytes.png'],
  ];
  return rows.map(([title, lower, upper, likes, image], index) => ({
    indicatorId: index + 1,
    title,
    description:
      'Показатель крови, используемый для оценки питания и расчёта индекса нутритивной недостаточности.',
    lowerReferenceLimit: lower,
    upperReferenceLimit: upper,
    imageUrl: asset(`images/${image}`),
    likesCount: likes,
    isLiked: index === 1,
    isOwner: false,
    creatorId: 2,
  }));
}

function seedDraft(): MockDraft {
  return {
    indicatorId: null,
    title: 'Оценка питания по индексу нутритивной недостаточности',
    description: '',
    lowerReferenceLimit: null,
    upperReferenceLimit: null,
    imageUrl: asset('images/albumin.png'),
  };
}

function loadState(): MockState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MockState;
      if (Array.isArray(parsed.indicators) && parsed.indicators.length > 0) {
        return {
          indicators: parsed.indicators,
          draft: parsed.draft ?? seedDraft(),
        };
      }
    }
  } catch {
    // повреждённое localStorage игнорируем — стартуем с демо-данных
  }
  return { indicators: seedIndicators(), draft: seedDraft() };
}

const state: MockState = loadState();

function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // приватный режим браузера и т.п. — демо продолжит работать в памяти
  }
}

function toDto(item: MockIndicator): Record<string, unknown> {
  return {
    indicatorId: item.indicatorId,
    title: item.title,
    description: item.description,
    lowerReferenceLimit: item.lowerReferenceLimit,
    upperReferenceLimit: item.upperReferenceLimit,
    imageUrl: item.imageUrl ?? '',
    videoUrl: item.videoUrl ?? '',
    creatorId: item.creatorId,
    createdAt: new Date().toISOString(),
    formedAt: new Date().toISOString(),
    isOwner: item.isOwner ? 1 : 0,
    isLiked: item.isLiked ? 1 : 0,
    likesCount: item.likesCount,
  };
}

function withViewer(item: MockIndicator): MockIndicator {
  return {
    ...item,
    isOwner: item.creatorId === currentUserId,
  };
}

function findIndicator(id: number): MockIndicator | undefined {
  return state.indicators.find((item) => item.indicatorId === id);
}

function parseBody(data: unknown): Record<string, unknown> {
  if (!data) return {};
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (data instanceof FormData) {
    const result: Record<string, unknown> = {};
    data.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  if (typeof data === 'object') return data as Record<string, unknown>;
  return {};
}

function response<T>(config: InternalAxiosRequestConfig, data: T, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: status === 201 ? 'Created' : 'OK',
    headers: {},
    config,
    request: {},
  } as AxiosResponse<T>;
}

function queryFrom(config: InternalAxiosRequestConfig): URLSearchParams {
  const url = new URL(config.url ?? '', 'http://mock.local');
  const params = new URLSearchParams(url.search);
  const extra = config.params as Record<string, unknown> | undefined;
  if (extra) {
    Object.entries(extra).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.set(key, String(value));
    });
  }
  return params;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockAdapter: AxiosAdapter = async (config) => {
  await delay(180);
  const requestUrl = new URL(config.url ?? '', 'http://mock.local');
  const path = requestUrl.pathname;
  const method = (config.method ?? 'get').toLowerCase();
  const params = queryFrom(config);
  const body = parseBody(config.data);

  // --- авторизация ---
  if (path === '/api/auth/login' && method === 'post') {
    currentUserId = 1;
    return response(config, {
      token: 'mock-token',
      userId: 1,
      login: String(body.login ?? 'doctor'),
    });
  }
  if (path === '/api/auth/register' && method === 'post') {
    currentUserId = 1;
    return response(config, {
      token: 'mock-token',
      userId: 1,
      login: String(body.login ?? 'doctor'),
    }, 201);
  }
  if (path === '/api/auth/logout' && method === 'post') {
    currentUserId = 0;
    return response(config, { message: 'ok' });
  }

  // --- список показателей ---
  if (path === '/api/biochemical-indicators' && method === 'get') {
    const concentration = params.get('indicatorConcentration');
    const value = concentration !== null ? Number(concentration) : null;
    const items = state.indicators
      .filter((item) => {
        if (value === null || Number.isNaN(value)) return true;
        return value >= item.lowerReferenceLimit && value <= item.upperReferenceLimit;
      })
      .map(withViewer)
      .map(toDto);
    return response(config, items);
  }

  // --- лента ---
  if (path === '/api/biochemical-indicators/feed' && method === 'get') {
    const idParam = params.get('indicatorId');
    const next = params.get('next') === 'true';
    const items = state.indicators.map(withViewer);
    if (items.length === 0) {
      return response(config, toDto(seedIndicators()[0]));
    }
    let index = 0;
    if (idParam !== null) {
      const found = items.findIndex((item) => item.indicatorId === Number(idParam));
      index = found >= 0 ? found : 0;
      if (next) index = (index + 1) % items.length;
    }
    return response(config, toDto(items[index]));
  }

  // --- черновик ---
  if (path === '/api/biochemical-indicators/draft' && method === 'get') {
    return response(config, {
      indicatorId: state.draft.indicatorId,
      title: state.draft.title,
      description: state.draft.description,
      lowerReferenceLimit: state.draft.lowerReferenceLimit ?? 0,
      upperReferenceLimit: state.draft.upperReferenceLimit ?? 0,
      imageUrl: state.draft.imageUrl ?? '',
      videoUrl: state.draft.videoUrl ?? '',
      creatorId: currentUserId,
      createdAt: new Date().toISOString(),
      formedAt: null,
      isOwner: 1,
      isLiked: 0,
      likesCount: 0,
    });
  }
  if (path === '/api/biochemical-indicators/draft' && method === 'post') {
    const title = String(body.title ?? '');
    const image = body.image instanceof File ? URL.createObjectURL(body.image) : state.draft.imageUrl;
    const video = body.video instanceof File ? URL.createObjectURL(body.video) : state.draft.videoUrl;
    state.draft = {
      indicatorId: state.draft.indicatorId ?? Date.now(),
      title,
      description: state.draft.description,
      lowerReferenceLimit: state.draft.lowerReferenceLimit,
      upperReferenceLimit: state.draft.upperReferenceLimit,
      imageUrl: image,
      videoUrl: video,
    };
    persist();
    return response(config, {}, 201);
  }
  if (path === '/api/biochemical-indicators/draft/publish' && method === 'put') {
    const title = state.draft.title.trim() || 'Новый биохимический показатель';
    const item: MockIndicator = {
      indicatorId: Math.max(0, ...state.indicators.map((x) => x.indicatorId)) + 1,
      title,
      description: String(body.description ?? ''),
      lowerReferenceLimit: Number(body.lowerReferenceLimit ?? 0),
      upperReferenceLimit: Number(body.upperReferenceLimit ?? 0),
      imageUrl: state.draft.imageUrl ?? asset('images/placeholder.png'),
      videoUrl: state.draft.videoUrl,
      likesCount: 0,
      isLiked: false,
      isOwner: true,
      creatorId: currentUserId || 1,
    };
    state.indicators = [item, ...state.indicators];
    state.draft = seedDraft();
    persist();
    return response(config, toDto(item), 201);
  }

  // --- удаление ---
  const deleteMatch = path.match(/^\/api\/biochemical-indicators\/(\d+)$/);
  if (deleteMatch && method === 'delete') {
    const id = Number(deleteMatch[1]);
    state.indicators = state.indicators.filter((item) => item.indicatorId !== id);
    persist();
    return response(config, { message: 'deleted' });
  }

  // --- лайк ---
  const likeMatch = path.match(/^\/api\/biochemical-indicators\/(\d+)\/like$/);
  if (likeMatch && method === 'post') {
    const id = Number(likeMatch[1]);
    const item = findIndicator(id);
    if (item) {
      const like = Number(body.like) === 1;
      item.isLiked = like;
      item.likesCount = Math.max(0, item.likesCount + (like ? 1 : -1));
      persist();
      return response(config, toDto(withViewer(item)));
    }
    return response(config, { message: 'not found' }, 404);
  }

  return response(config, { message: `mock: ${method} ${path} not implemented` }, 404);
};

/** Устанавливает mock-адаптер для всех запросов приложения. */
export function installMockApi(): void {
  axios.defaults.adapter = mockAdapter;
  biochemicalIndicatorApi.instance.defaults.adapter = mockAdapter;
}

/** Включён ли демонстрационный режим. */
export function isMockMode(): boolean {
  if (import.meta.env.VITE_MOCK_MODE === 'true') return true;
  if (typeof window === 'undefined') return false;
  if (window.location.hostname.endsWith('github.io')) return true;
  return new URLSearchParams(window.location.search).has('mock');
}

