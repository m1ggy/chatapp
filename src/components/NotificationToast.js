import React from 'react';
import { Toast } from 'react-bootstrap';
export default function NotificationToast({ user, show, setShow }) {
  return (
    <Toast
      show={show}
      onClose={() => setShow(false)}
      style={{
        position: 'fixed',
        bottom: '12px',
        right: '12px',
        margin: '20px',
        zIndex: 9999,
        minWidth: '250px',
      }}
      autoHide={3000}
      closeButton={false}
    >
      <Toast.Header>
        <strong className='me-auto'>New Message</strong>
        <small>few moments ago</small>
      </Toast.Header>
      <Toast.Body>You have a new message from ${user}</Toast.Body>
    </Toast>
  );
}
