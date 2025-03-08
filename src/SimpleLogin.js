import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

function SimpleLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const correctPassword = "minhasenha"; // Defina aqui a senha desejada

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      onLogin();
    } else {
      setError("Senha incorreta!");
    }
  };

  return (
    <Container className="p-4">
      <h2 className="text-center">Entre com a senha</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="password">
          <Form.Control 
            type="password" 
            placeholder="Digite a senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Entrar
        </Button>
      </Form>
    </Container>
  );
}

export default SimpleLogin;
