import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { PlusIcon } from '@/components/icons/plus-icon';
import Modal from '@/components/ui/modal/modal';
import axios from 'axios';

const AddCustomer = () => {
  const { t } = useTranslation('common');
  const { closeModal } = useModalAction();
  const [formData, setFormData] = useState({ email: '', phone: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Make a POST request to the API endpoint
      await axios.post('YOUR_API_ENDPOINT', formData);
      // Close the modal after form submission
      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error.message);
      // Handle any errors that occur during form submission
    }
  };

  return (
    <Modal title={t('text-add-customer')} onClose={closeModal}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            {t('text-email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            {t('text-phone')}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent"
          />
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover focus:outline-none focus:bg-accent-hover"
          >
            {t('text-submit')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCustomer;
