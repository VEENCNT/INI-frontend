import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const BiochemicalIndicatorDraftPage: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      type === 'image' ? setImagePreview(url) : setVideoPreview(url);
    }
  };

  return (
    <Container className="p-3 h-100 overflow-auto pb-5 mb-5">
      <h1 className="page-title mb-3">Черновик</h1>
      <Form>
        <h2 className="section-title mb-3">Медиа</h2>
        
        {/* Изображение */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Изображение</Form.Label>
          <div className="border rounded p-3 text-center d-flex justify-content-center align-items-center mb-2" style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
            {imagePreview ? (
              <img src={imagePreview} alt="Превью" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span className="text-muted">Изображение не загружено</span>
            )}
          </div>
          <Form.Control type="file" accept="image/*" onChange={(e: any) => handleFileChange(e, 'image')} />
        </Form.Group>

        {/* Видео */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Видео</Form.Label>
          <div className="border rounded p-3 text-center d-flex justify-content-center align-items-center mb-2" style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
            {videoPreview ? (
              <video src={videoPreview} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span className="text-muted">Видео не загружено</span>
            )}
          </div>
          <Form.Control type="file" accept="video/*" onChange={(e: any) => handleFileChange(e, 'video')} />
        </Form.Group>

        <h2 className="section-title mb-3">Заголовки</h2>
        
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Название</Form.Label>
          <Form.Control type="text" placeholder="Например: Крайне низкий Альбумин" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Описание</Form.Label>
          <Form.Control as="textarea" rows={4} placeholder="Например: Серьезный дефицит основного белка крови..." />
        </Form.Group>

        <h2 className="section-title mb-3">Поля по теме</h2>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Нижняя граница содержания в крови, ед.</Form.Label>
          <Form.Control type="number" placeholder="Например: 50" required />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="fw-bold">Верхняя граница содержания в крови, ед.</Form.Label>
          <Form.Control type="number" placeholder="Например: 65" required />
        </Form.Group>

        <Button variant="purple" type="submit" className="w-100 py-2 fs-5 fw-bold">
          Отправить
        </Button>
      </Form>
    </Container>
  );
};

export default BiochemicalIndicatorDraftPage;