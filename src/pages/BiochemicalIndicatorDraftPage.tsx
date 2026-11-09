import React, { useEffect, useRef, useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { createDraft, fetchDraft, publishDraft } from '../features/indicators/indicatorsSlice';
import { resolveMediaUrl } from '../utils/media';
import LoadingOverlay from '../components/LoadingOverlay';

const BiochemicalIndicatorDraftPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const draft = useAppSelector((state) => state.indicators.draft);
  const loading = useAppSelector((state) => state.indicators.loading);
  const error = useAppSelector((state) => state.indicators.error);

  // Локальные поля инициализируются данными черновика: при возврате на страницу
  // черновик уже может быть загружен в Redux
  const [title, setTitle] = useState(draft.title);
  const [description, setDescription] = useState(draft.description);
  const [lowerLimit, setLowerLimit] = useState(
    draft.lowerReferenceLimit != null ? String(draft.lowerReferenceLimit) : '',
  );
  const [upperLimit, setUpperLimit] = useState(
    draft.upperReferenceLimit != null ? String(draft.upperReferenceLimit) : '',
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Вид страницы зависит от того, создан ли черновик у текущего пользователя
  useEffect(() => {
    if (!draft.loaded) {
      dispatch(fetchDraft());
    }
  }, [dispatch, draft.loaded]);

  // Если черновик догрузился уже после монтирования — подставляем его данные
  // (паттерн adjusting state during render)
  const [prevDraftLoaded, setPrevDraftLoaded] = useState(draft.loaded);
  if (draft.loaded !== prevDraftLoaded) {
    setPrevDraftLoaded(draft.loaded);
    if (draft.loaded) {
      setTitle(draft.title);
      setDescription(draft.description);
      setLowerLimit(draft.lowerReferenceLimit != null ? String(draft.lowerReferenceLimit) : '');
      setUpperLimit(draft.upperReferenceLimit != null ? String(draft.upperReferenceLimit) : '');
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'image') {
        setImageFile(file);
        setImagePreview(url);
      } else {
        setVideoFile(file);
        setVideoPreview(url);
      }
    }
  };

  // Шаг 1: создание черновика (title, image, video)
  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(
      createDraft({
        title,
        imageFile: imageFile ?? undefined,
        videoFile: videoFile ?? undefined,
      }),
    );
    if (createDraft.fulfilled.match(resultAction)) {
      // Черновик создан — форма переключится в полный вид («Отправить»)
      setTitle(resultAction.payload.title ?? title);
    }
  };

  // Шаг 2: публикация черновика (description, lowerReferenceLimit, upperReferenceLimit)
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(
      publishDraft({
        description,
        lowerReferenceLimit: Number(lowerLimit),
        upperReferenceLimit: Number(upperLimit),
      }),
    );
    if (publishDraft.fulfilled.match(resultAction)) {
      navigate('/biochemical-indicator/grid');
    }
  };

  const isDraftCreated = draft.isCreated;

  const existingImageUrl = resolveMediaUrl(draft.imageUrl);
  const existingVideoUrl = resolveMediaUrl(draft.videoUrl);
  const imageSrc = imagePreview ?? existingImageUrl;
  const videoSrc = videoPreview ?? existingVideoUrl;

  const mediaBoxStyle: React.CSSProperties = {
    height: '200px',
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  };

  const mediaFitStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  return (
    <Container className="p-3 h-100 overflow-auto pb-5 mb-5 position-relative">
      {loading && <LoadingOverlay />}
      <h1 className="page-title mb-3">Добавление показателя</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={isDraftCreated ? handlePublish : handleNext}>
        <p className="section-title text-purple mb-3">Медиа</p>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Изображение</Form.Label>
          <div className="border rounded text-center d-flex justify-content-center align-items-center mb-2" style={mediaBoxStyle}>
            {imageSrc ? (
              <img src={imageSrc} alt="Превью" style={mediaFitStyle} />
            ) : (
              <span className="text-muted">Изображение не загружено</span>
            )}
          </div>
          <Form.Control
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="d-none"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'image')}
          />
          <Button variant="purple" className="w-100 draft-btn" onClick={() => imageInputRef.current?.click()}>
            Загрузить ↓
          </Button>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Видео</Form.Label>
          <div className="border rounded text-center d-flex justify-content-center align-items-center mb-2" style={mediaBoxStyle}>
            {videoSrc ? (
              <video src={videoSrc} controls autoPlay loop muted playsInline style={mediaFitStyle} />
            ) : (
              <span className="text-muted">Видео не загружено</span>
            )}
          </div>
          <Form.Control
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="d-none"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'video')}
          />
          <Button variant="purple" className="w-100 draft-btn" onClick={() => videoInputRef.current?.click()}>
            Загрузить ↓
          </Button>
        </Form.Group>

        <p className="section-title text-purple mb-3">Заголовки</p>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Название</Form.Label>
          <Form.Control
            type="text"
            placeholder="Например: Крайне низкий Альбумин"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        {isDraftCreated && (
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Описание</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="Например: Серьезный дефицит основного белка крови..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        )}

        {isDraftCreated && (
          <>
            <h2 className="section-title text-purple mb-3">Поля по теме</h2>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Нижняя граница содержания в крови, ед.</Form.Label>
              <Form.Control
                type="number"
                placeholder="Например: 50"
                required
                value={lowerLimit}
                onChange={(e) => setLowerLimit(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Верхняя граница содержания в крови, ед.</Form.Label>
              <Form.Control
                type="number"
                placeholder="Например: 65"
                required
                value={upperLimit}
                onChange={(e) => setUpperLimit(e.target.value)}
              />
            </Form.Group>
          </>
        )}

        <Button variant="purple" type="submit" className="w-100 draft-btn" disabled={loading}>
          {loading ? 'Отправка...' : isDraftCreated ? 'Отправить' : 'Далее'}
        </Button>
      </Form>
    </Container>
  );
};

export default BiochemicalIndicatorDraftPage;
