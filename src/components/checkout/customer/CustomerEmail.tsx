// import React, { useState } from 'react';
// import { useModalAction } from '@/components/ui/modal/modal.context';
// import { customerAtom } from '@/contexts/checkout';
// import { useAtom } from 'jotai';
// import { useTranslation } from 'next-i18next';
// import { userClient } from '@/data/client/user';

// const CustomerEmail = () => {
//   const { closeModal } = useModalAction();
//   const { t } = useTranslation('common');
//   const [selectedCustomer, setCustomer] = useAtom(customerAtom);
//   const [inputValue, setInputValue] = useState('');
//   const [emailSuggestions, setEmailSuggestions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showAddButton, setShowAddButton] = useState(true);

//   async function fetchEmailSuggestions(inputValue) {
//     setLoading(true);
//     try {
//       const response = await userClient.fetchUsers({
//         name: inputValue,
//         page: 1,
//       });
//       const users = response?.data || [];
//       const suggestions = users.map((user) => ({
//         value: user.id,
//         email: user.email,
//         label: user.name,
//       }));
//       setEmailSuggestions(suggestions);
//     } catch (error) {
//       console.error('Error fetching email suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   function handleInputChange(value) {
//     setInputValue(value);
//     fetchEmailSuggestions(value);
//     setShowAddButton(true);
//   }

//   function handleAddEmail() {
//     console.log('Add new email:', inputValue);
//     closeModal();
//   }

//   function handleSelectEmail(suggestion) {
//     setCustomer({ id: suggestion.value, email: suggestion.email, label:suggestion.label });
//     setInputValue(suggestion.email);
//     setEmailSuggestions([]);
//     setShowAddButton(false); 
//     closeModal();
//   }

//   console.log('emailSuggestions', emailSuggestions)

//   return (
//     <div className="shadow-700 bg-light p-5 md:p-8">
//       <h1 className="mb-5 text-lg text-heading sm:mb-6">
//         {selectedCustomer ? t('text-update') : t('text-select')}{' '}
//         {t('text-customer')}
//       </h1>
//       <div className="relative">
//         <input
//           className="mb-4 h-12 w-full rounded border border-accent px-4 py-2"
//           type="text"
//           value={inputValue}
//           onChange={(e) => handleInputChange(e.target.value)}
//           placeholder={t('Enter email')}
//         />
//         {loading && (
//           <div className="absolute top-0 right-0 bottom-0 flex items-center px-4 text-accent">
//             Loading...
//           </div>
//         )}
//         {!loading && emailSuggestions.length === 0 && inputValue !== '' && showAddButton && (
//           <div className="absolute top-0 right-0 bottom-0 flex items-center py-4 text-accent">
//             No email found.{' '}
//             <button
//               className="ml-2 text-green-500 hover:underline"
//               onClick={handleAddEmail}
//             >
//               Add
//             </button>
//           </div>
//         )}
//         {!loading && emailSuggestions.length > 0 && (
//           <ul className="absolute z-10 mt-1 w-full max-h-24 overflow-y-auto rounded border border-accent bg-white py-1 shadow-lg">
//             {emailSuggestions.map((suggestion) => (
//               <li
//                 key={suggestion.value}
//                 className="cursor-pointer px-4 py-2 hover:bg-accent hover:text-white snap-y"
//                 onClick={() => handleSelectEmail(suggestion)}
//               >
//                 {suggestion.email}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CustomerEmail;



import React, { useState, useEffect } from 'react';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { customerAtom } from '@/contexts/checkout';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import { userClient } from '@/data/client/user';

const CustomerEmail = () => {
  const { closeModal } = useModalAction();
  const { t } = useTranslation('common');
  const [selectedCustomer, setCustomer] = useAtom(customerAtom);
  const [inputValue, setInputValue] = useState('');
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddButton, setShowAddButton] = useState(true);

  useEffect(() => {
    fetchEmailSuggestions('');
  }, []); // Fetch suggestions when component mounts

  async function fetchEmailSuggestions(value) {
    setLoading(true);
    try {
      const response = await userClient.fetchUsers({
        name: value,
        page: 1,
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
    fetchEmailSuggestions(value);
    setShowAddButton(true);
  }

  function handleAddEmail() {
    closeModal();
  }

  function handleSelectEmail(suggestion) {
    setCustomer({ id: suggestion.value, email: suggestion.email, label: suggestion.label });
    setInputValue(suggestion.email);
    setEmailSuggestions([]);
    setShowAddButton(false);
    closeModal();
  }

  return (
    <div className="shadow-700 bg-light p-5 md:p-8">
      <h1 className="mb-5 text-lg text-heading sm:mb-6">
        {selectedCustomer ? t('text-update') : t('text-select')}{' '}
        {t('text-customer')}
      </h1>
      <div className="relative">
        <input
          className="mb-4 h-12 w-full rounded border border-accent px-4 py-2"
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={t('Enter email')}
        />
        {loading && (
          <div className="absolute top-0 right-0 bottom-0 flex items-center px-4 text-accent">
            Loading...
          </div>
        )}
        {!loading && emailSuggestions.length === 0 && inputValue !== '' && showAddButton && (
          <div className="absolute top-0 right-0 bottom-0 flex items-center py-4 text-accent">
            No email found.{' '}
            <button
            type="button"
              className="ml-2 text-green-500 hover:underline"
              onClick={handleAddEmail}
            >
              Add
            </button>
          </div>
        )}
        {!loading && emailSuggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full max-h-24 overflow-y-auto rounded border border-accent bg-white py-1 shadow-lg">
            {emailSuggestions.map((suggestion) => (
              <li
                key={suggestion.value}
                className="cursor-pointer px-4 py-2 hover:bg-accent hover:text-white snap-y"
                onClick={() => handleSelectEmail(suggestion)}
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

