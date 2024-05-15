import React, { useEffect, useState } from 'react';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { customerAtom } from '@/contexts/checkout';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import { userClient } from '@/data/client/user';
import { useMeQuery } from '@/data/user';
import { PlusIcon } from '@/components/icons/plus-icon';
import { useRouter } from 'next/router';

const CustomerEmail = ({ count }) => {
  const { closeModal } = useModalAction();
  const { t } = useTranslation('common');
  const [selectedCustomer, setCustomer] = useAtom(customerAtom);
  const [inputValue, setInputValue] = useState('');
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddButton, setShowAddButton] = useState(true);
  const router = useRouter();

  const { data: meData } = useMeQuery();
  const { id } = meData || {};
  const usrById = id;

  useEffect(() => {
    const storedInputValue = localStorage.getItem('inputValue');
    if (storedInputValue) {
      setInputValue(storedInputValue);
    }
  }, []);

  async function fetchEmailSuggestions(inputValue) {
    setLoading(true);
    try {
      const response = await userClient.fetchUsers({
        email: inputValue,
        page: 1,
        usrById,
      });
      const users = response?.data || [];
      const suggestions = users.map((user) => ({
        value: user.id,
        email: user.email,
        label: user.name,
      }));
      setEmailSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching email suggestions:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(value) {
    setInputValue(value);
    localStorage.setItem('inputValue', value);
    fetchEmailSuggestions(value);
    setShowAddButton(true);
  }

  function handleInputClick() {
    fetchEmailSuggestions(inputValue);
  }

  function handleAddEmail(e: any) {
    e.preventDefault();
    router.push('/users/create?from=checkout');
  }

  function handleSelectEmail(suggestion, e) {
    e.preventDefault();
    setCustomer({
      id: suggestion.value,
      email: suggestion.email,
      label: suggestion.label,
    });
    setInputValue(suggestion.email);
    setEmailSuggestions([]);
    setShowAddButton(false);
    closeModal();
  }

  return (
    <div className="shadow-700 bg-light p-5 md:p-8">
      <div className="mb-5 flex items-center justify-between md:mb-8">
        <div className="flex items-center space-s-3 md:space-s-4">
          {count && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-base text-light lg:text-xl">
              {count}
            </span>
          )}
          <p className="text-lg capitalize text-heading lg:text-xl">
            {t('text-customer')}
          </p>
        </div>
        {!loading &&
          emailSuggestions.length === 0 &&
          inputValue !== '' &&
          showAddButton && (
            <button
              type="button"
              className="flex items-center text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent-hover focus:text-accent-hover focus:outline-none"
              onClick={handleAddEmail}
            >
              <PlusIcon className="h-4 w-4 stroke-2 me-0.5" />
              Add
            </button>
          )}
      </div>

      <div className="relative">
        <input
          className=" h-12 w-full rounded border border-accent px-4 py-2"
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onClick={handleInputClick}
          placeholder={t('Enter email')}
        />
        {loading && (
          <div className="absolute top-0 right-0 bottom-0 flex items-center px-4 text-accent">
            Loading...
          </div>
        )}
        {!loading &&
          emailSuggestions.length === 0 &&
          inputValue !== '' &&
          showAddButton && (
            <div className="relative mt-2 rounded border border-border-200 bg-gray-100 px-5 py-6 text-center text-base">
              No email found{' '}
            </div>
          )}
        {!loading && emailSuggestions.length > 0 && (
          <ul className="absolute z-10 mt-0.5 max-h-24 w-full overflow-y-auto rounded border border-accent bg-white py-1 shadow-lg">
            {emailSuggestions.map((suggestion) => (
              <li
                key={suggestion.value}
                className="cursor-pointer snap-y px-4 py-2 hover:bg-accent hover:text-white"
                onClick={(e) => handleSelectEmail(suggestion, e)}
              >
                {suggestion.email}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomerEmail;
