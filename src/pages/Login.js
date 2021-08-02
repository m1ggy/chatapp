import React, { useState } from 'react';
import { Form, Button, Col, Row, Card } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../context/authContext';
export default function Login() {
  const [creds, setCreds] = useState({
    email: '',
    password: '',
  });
  const { loading, setLoading, login } = useAuth();
  const history = useHistory();
  const [message, setMessage] = useState('');
  function handleSubmit(e) {
    e.preventDefault();
    login(creds.email, creds.password)
      .then((res) => {
        history.push('/dashboard');
        setMessage('Logged in');
      })
      .catch(() => {
        setMessage('Failed to login');
      });
  }
  return (
    <Card
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItem: 'center',
        width: '400px',

        marginTop: '300px',
      }}
    >
      <Card.Body style={{ textAlign: 'center' }}>
        <Card.Title>Login</Card.Title>
        <Col>
          <Row as={Form} onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='text'
                required
                value={creds.email}
                onChange={(e) => setCreds({ ...creds, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group style={{ marginBottom: 10 }}>
              <Form.Label>password</Form.Label>
              <Form.Control
                type='password'
                required
                value={creds.password}
                onChange={(e) =>
                  setCreds({ ...creds, password: e.target.value })
                }
              />
            </Form.Group>
            <Button
              type='submit'
              style={{ marginTop: 20, width: `75px`, margin: `auto` }}
            >
              Login
            </Button>
          </Row>
        </Col>
      </Card.Body>
      <Card.Footer style={{ textAlign: 'center' }}>
        <p>
          Need an Account?<Link to='/register'>Signup</Link>{' '}
        </p>
        {message}
      </Card.Footer>
    </Card>
  );
}