import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { useUI } from '@/contexts/ui.context';
import axios from 'axios';

const CheckoutForm = () => {
  const { t } = useTranslation('common');
  const { closeCartSidebar } = useUI();

  // State to control the visibility of the form
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Function to toggle the visibility of the form
  const toggleForm = () => {
    setIsFormOpen(prevState => !prevState);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: e.target.elements['email'].value,
      phone: e.target.elements['phone'].value
    };

    try {
      // Make a POST request to the API endpoint
      const response = await axios.post('http://localhost:5050/api/dealers/customer', formData);

      // Close the cart sidebar after form submission
      closeCartSidebar();

      // Optionally, reset form state or perform other actions upon successful submission
      setIsFormOpen(false);

    } catch (error) {
      console.error('Error submitting form:', error.message);
    }
  };

  return (
    <motion.div
      layout
      initial="from"
      animate="to"
      exit="from"
      className="flex flex-col items-center justify-center"
    >
      <motion.button
        onClick={toggleForm}
        className="mb-6 rounded-full bg-accent px-6 py-3 font-bold text-light transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none"
      >
        {t('Customer-info')}
      </motion.button>

      {isFormOpen && (
        <motion.form
          layout
          initial="from"
          animate="to"
          exit="from"
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center"
        >
          <input
            type="email"
            name="email"
            placeholder={t('Enter email')}
            className="mb-3 rounded-md border border-gray-300 px-3 py-2"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder={t('Enter phone')}
            className="mb-3 rounded-md border border-gray-300 px-3 py-2"
            required
          />
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-3 font-bold text-light transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none"
          >
            {t('submit')}
          </button>
        </motion.form>
      )}
    </motion.div>
  );
};

export default CheckoutForm;
