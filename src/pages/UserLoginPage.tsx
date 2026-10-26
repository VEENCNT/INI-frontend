import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const UserLoginPage: React.FC = () => {
  return (
    <Container className="p-4 d-flex flex-column justify-content-center h-100">
      <h1 className="page-title text-center mb-4">Вход в систему</h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Логин</Form.Label>
          <Form.Control type="text" placeholder="Введите логин" />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Пароль</Form.Label>
          <Form.Control type="password" placeholder="Введите пароль" />
        </Form.Group>
        <Button variant="purple" className="w-100 py-2 fw-bold">Войти</Button>
      </Form>
    </Container>
  );
};

export default UserLoginPage;