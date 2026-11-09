import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setCredentials, setError, setLoading } from '../features/auth/authSlice';
import { loginRequest } from '../api/authApi';
import LoadingOverlay from '../components/LoadingOverlay';

const UserLoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Авторизация: только axios, состояние в Redux передается вручную (без thunk)
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await loginRequest(login, password);
      dispatch(setCredentials({ user: response.user, token: response.token }));
      navigate('/biochemical-indicator/grid');
    } catch {
      dispatch(setError('Неверный логин или пароль'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Container className="p-4 d-flex flex-column justify-content-center h-100 position-relative">
      {loading && <LoadingOverlay />}
      <h1 className="page-title text-center mb-4">Вход в систему</h1>

      {error && <Alert variant="danger" className="text-center">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Логин</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="purple" type="submit" className="w-100 py-2 fw-bold" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </Button>
      </Form>
    </Container>
  );
};

export default UserLoginPage;
