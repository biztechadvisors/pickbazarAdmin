// UserModal.js
import CustomerCreateForm from '@/components/user/user-form';
import React, { useState } from 'react';
import Modal from './modal';


 // This is to avoid screen reader issues. Set the app element to your root element.

const UserModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Create User"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: '600px',
        },
      }}
    >
      <CustomerCreateForm />
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default UserModal;
