import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  BiochemicalIndicator,
  BiochemicalIndicatorDraft,
  BiochemicalIndicatorFilter,
  DraftMediaForm,
  DraftPublishForm,
} from '../../types';
import { mockIndicators } from '../../data';
import {
  getBiochemicalIndicators,
  getBiochemicalIndicatorFeedFirst,
  getNextBiochemicalIndicator,
  getBiochemicalIndicatorDraft,
  createBiochemicalIndicatorDraft,
  publishBiochemicalIndicatorDraft,
  deleteBiochemicalIndicator,
  setBiochemicalIndicatorLike,
} from '../../api/generated/biochemicalIndicatorApi';
import type { RootState } from '../../app/store';

interface DraftState {
  /** Черновик загружен с сервера */
  loaded: boolean;
  /** Черновик создан (есть indicatorId) — определяет вид страницы «Добавить» */
  isCreated: boolean;
  indicatorId: number | null;
  title: string;
  description: string;
  lowerReferenceLimit: number | null;
  upperReferenceLimit: number | null;
  imageUrl?: string;
  videoUrl?: string;
}

const emptyDraft: DraftState = {
  loaded: false,
  isCreated: false,
  indicatorId: null,
  title: '',
  description: '',
  lowerReferenceLimit: null,
  upperReferenceLimit: null,
  imageUrl: undefined,
  videoUrl: undefined,
};

interface IndicatorsState {
  /** Элементы страницы «Плитка» (могут быть отфильтрованы) */
  items: BiochemicalIndicator[];
  loading: boolean;
  error: string | null;
  /** Фильтр пользователя: значение содержания вещества в крови */
  filterValue: number | null;
  /** Элементы ленты (всегда без фильтра, накапливаются при листании) */
  feedItems: BiochemicalIndicator[];
  feedIndex: number;
  feedLoading: boolean;
  /** Черновик текущего пользователя */
  draft: DraftState;
}

const initialState: IndicatorsState = {
  items: [],
  loading: false,
  error: null,
  filterValue: null,
  feedItems: [],
  feedIndex: 0,
  feedLoading: false,
  draft: emptyDraft,
};

function applyMockFilter(
  indicators: BiochemicalIndicator[],
  filter: BiochemicalIndicatorFilter,
): BiochemicalIndicator[] {
  return indicators.filter((indicator) => {
    if (filter.indicatorConcentration !== undefined && !(
      filter.indicatorConcentration >= indicator.lowerReferenceLimit &&
      filter.indicatorConcentration <= indicator.upperReferenceLimit
    )) {
      return false;
    }
    return true;
  });
}

/** Плитка: получение показателей с фильтром. При недоступности бэкенда (только как гость) — mock */
export const fetchIndicators = createAsyncThunk<
  BiochemicalIndicator[],
  BiochemicalIndicatorFilter,
  { state: RootState; rejectValue: string }
>('indicators/fetchIndicators', async (filter, { getState, rejectWithValue }) => {
  const { isAuthenticated } = getState().auth;
  try {
    return await getBiochemicalIndicators(filter);
  } catch {
    if (!isAuthenticated) {
      return applyMockFilter(mockIndicators, filter);
    }
    return rejectWithValue('Не удалось загрузить показатели с сервера');
  }
});

/** Лента: первый опубликованный элемент (без фильтрации) */
export const fetchFeedFirst = createAsyncThunk<
  BiochemicalIndicator[],
  void,
  { state: RootState; rejectValue: string }
>('indicators/fetchFeedFirst', async (_, { getState, rejectWithValue }) => {
  const { isAuthenticated } = getState().auth;
  try {
    return [await getBiochemicalIndicatorFeedFirst()];
  } catch {
    if (!isAuthenticated) {
      return mockIndicators;
    }
    return rejectWithValue('Не удалось загрузить ленту с сервера');
  }
});

/** Лента: следующий опубликованный элемент относительно indicatorId.
 *  null в ответе — mock-режим гостя: просто листаем по кругу */
export const fetchFeedNext = createAsyncThunk<
  BiochemicalIndicator | null,
  number,
  { state: RootState; rejectValue: string }
>('indicators/fetchFeedNext', async (indicatorId, { getState, rejectWithValue }) => {
  const { isAuthenticated } = getState().auth;
  try {
    return await getNextBiochemicalIndicator(indicatorId);
  } catch {
    if (!isAuthenticated) {
      return null;
    }
    return rejectWithValue('Не удалось загрузить следующий показатель');
  }
});

/** Черновик: загрузка текущего черновика пользователя (или дефолтной структуры) */
export const fetchDraft = createAsyncThunk<
  BiochemicalIndicatorDraft,
  void,
  { rejectValue: string }
>('indicators/fetchDraft', async (_, { rejectWithValue }) => {
  try {
    return await getBiochemicalIndicatorDraft();
  } catch {
    return rejectWithValue('Не удалось загрузить черновик');
  }
});

/** Черновик: шаг 1 — создание (multipart: title, image, video) */
export const createDraft = createAsyncThunk<
  BiochemicalIndicatorDraft,
  DraftMediaForm,
  { rejectValue: string }
>('indicators/createDraft', async (form, { rejectWithValue }) => {
  try {
    return await createBiochemicalIndicatorDraft(form);
  } catch {
    return rejectWithValue('Не удалось создать черновик');
  }
});

/** Черновик: шаг 2 — публикация (description, lowerReferenceLimit, upperReferenceLimit) */
export const publishDraft = createAsyncThunk<
  BiochemicalIndicator,
  DraftPublishForm,
  { rejectValue: string }
>('indicators/publishDraft', async (form, { rejectWithValue }) => {
  try {
    return await publishBiochemicalIndicatorDraft(form);
  } catch {
    return rejectWithValue('Не удалось опубликовать показатель');
  }
});

/** Удаление показателя (доступно только авторизованному пользователю) */
export const removeIndicator = createAsyncThunk<
  number,
  number,
  { state: RootState; rejectValue: string }
>('indicators/removeIndicator', async (indicatorId, { getState, rejectWithValue }) => {
  if (!getState().auth.isAuthenticated) {
    return rejectWithValue('Только авторизованный пользователь может удалять показатели');
  }
  try {
    await deleteBiochemicalIndicator(indicatorId);
  } catch {
    return rejectWithValue('Не удалось удалить показатель');
  }
  return indicatorId;
});

/** Лайк/анлайк (доступен только авторизованному пользователю), body { "like": 1 | 0 } */
export const toggleIndicatorLike = createAsyncThunk<
  { indicatorId: number; like: boolean },
  number,
  { state: RootState; rejectValue: string }
>('indicators/toggleIndicatorLike', async (indicatorId, { getState, rejectWithValue }) => {
  const { isAuthenticated } = getState().auth;
  const indicator =
    getState().indicators.items.find((item) => item.indicatorId === indicatorId) ??
    getState().indicators.feedItems.find((item) => item.indicatorId === indicatorId);
  if (!isAuthenticated) {
    return rejectWithValue('Только авторизованный пользователь может ставить лайки');
  }
  const like = !indicator?.isLiked;
  try {
    await setBiochemicalIndicatorLike(indicatorId, like);
  } catch {
    return rejectWithValue('Не удалось поставить лайк');
  }
  return { indicatorId, like };
});

function draftFromResponse(draft: BiochemicalIndicatorDraft): DraftState {
  return {
    loaded: true,
    // дефолтная структура от бэкенда имеет indicatorId = null — черновик ещё не создан
    isCreated: Boolean(draft.indicatorId),
    indicatorId: draft.indicatorId,
    title: draft.title ?? '',
    description: draft.description ?? '',
    lowerReferenceLimit: draft.lowerReferenceLimit,
    upperReferenceLimit: draft.upperReferenceLimit,
    imageUrl: draft.imageUrl || undefined,
    videoUrl: draft.videoUrl || undefined,
  };
}

const indicatorsSlice = createSlice({
  name: 'indicators',
  initialState,
  reducers: {
    setFilterValue(state, action: PayloadAction<number | null>) {
      state.filterValue = action.payload;
    },
    // Сброс фильтра пользователя (при выходе из системы)
    resetFilter(state) {
      state.filterValue = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndicators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIndicators.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIndicators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Ошибка загрузки';
      })
      .addCase(fetchFeedFirst.pending, (state) => {
        state.feedLoading = true;
        state.error = null;
      })
      .addCase(fetchFeedFirst.fulfilled, (state, action) => {
        state.feedLoading = false;
        if (state.feedItems.length === 0) {
          state.feedItems = action.payload;
          state.feedIndex = 0;
        }
      })
      .addCase(fetchFeedFirst.rejected, (state, action) => {
        state.feedLoading = false;
        state.error = action.payload ?? 'Ошибка загрузки ленты';
      })
      .addCase(fetchFeedNext.pending, (state) => {
        state.feedLoading = true;
      })
      .addCase(fetchFeedNext.fulfilled, (state, action) => {
        state.feedLoading = false;
        if (action.payload === null) {
          // mock-режим гостя: закольцованное листание
          if (state.feedItems.length > 0) {
            state.feedIndex = (state.feedIndex + 1) % state.feedItems.length;
          }
          return;
        }
        const existingIndex = state.feedItems.findIndex(
          (item) => item.indicatorId === action.payload!.indicatorId,
        );
        if (existingIndex !== -1) {
          // бэкенд вернул уже известный элемент (цикл ленты) — перемещаемся к нему
          state.feedIndex = existingIndex;
        } else {
          state.feedItems = [...state.feedItems, action.payload!];
          state.feedIndex = state.feedItems.length - 1;
        }
      })
      .addCase(fetchFeedNext.rejected, (state, action) => {
        state.feedLoading = false;
        state.error = action.payload ?? 'Ошибка загрузки ленты';
      })
      .addCase(fetchDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.draft = draftFromResponse(action.payload);
      })
      .addCase(fetchDraft.rejected, (state, action) => {
        state.loading = false;
        state.draft = { ...emptyDraft, loaded: true };
        state.error = action.payload ?? 'Ошибка загрузки черновика';
      })
      .addCase(createDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.draft = draftFromResponse(action.payload);
      })
      .addCase(createDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Ошибка создания черновика';
      })
      .addCase(publishDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [action.payload, ...state.items];
        // черновик опубликован — сбрасываем к состоянию «не создан»
        state.draft = { ...emptyDraft, loaded: true };
      })
      .addCase(publishDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Ошибка публикации';
      })
      .addCase(removeIndicator.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.indicatorId !== action.payload);
        state.feedItems = state.feedItems.filter((item) => item.indicatorId !== action.payload);
      })
      .addCase(removeIndicator.rejected, (state, action) => {
        state.error = action.payload ?? 'Ошибка удаления';
      })
      .addCase(toggleIndicatorLike.fulfilled, (state, action) => {
        const { indicatorId, like } = action.payload;
        const indicator =
          state.items.find((item) => item.indicatorId === indicatorId) ??
          state.feedItems.find((item) => item.indicatorId === indicatorId);
        if (!indicator) return;
        indicator.isLiked = like;
        indicator.likesCount = Math.max(0, indicator.likesCount + (like ? 1 : -1));
      })
      .addCase(toggleIndicatorLike.rejected, (state, action) => {
        state.error = action.payload ?? 'Ошибка лайка';
      });
  },
});

export const { setFilterValue, resetFilter } = indicatorsSlice.actions;
export default indicatorsSlice.reducer;
