import React, { useState } from 'react';
import { PlusIcon } from './icons/plus-icon';
import { MinusIcon } from './icons/minus-icon';
import { useModalAction } from './ui/modal/modal.context';
import { useAtom } from 'jotai';
import { dealerAddress } from '@/utils/atoms';

const UserAddressSelection = ({ addresses, count, dealerId, type }) => {
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [selectedAddress, setSelectedAddress] = useAtom(dealerAddress);
  const { openModal } = useModalAction();

  const handleAddressSelection = (address) => {
    setSelectedAddress(address);
  };

  if (!addresses || !dealerId) {
    return <div>Loading...</div>;
  }

  const displayedAddresses = showAllAddresses
    ? addresses
    : addresses.slice(0, 2);

  function onAdd() {
    openModal('ADD_OR_UPDATE_ADDRESS', { customerId: dealerId, type });
  }

  return (
    <div className="my-5 flex flex-wrap sm:my-8">
      <div className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5">
        <h4 className="mb-2 text-base font-semibold text-body-dark">
          Select Address
        </h4>
      </div>
      <div className="mb-5 w-full rounded bg-light p-5 shadow sm:w-8/12 md:w-2/3 md:p-8">
        <div className="shadow-700 bg-light">
          <div className="mb-5 flex justify-between">
            <div className="flex items-center space-s-3 md:space-s-4"></div>
            <button
              className="flex items-center text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent-hover focus:text-accent-hover focus:outline-none"
              onClick={onAdd}
            >
              <PlusIcon className="h-4 w-4 stroke-2 me-0.5" />
              Add
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 md:gap-4">
            {displayedAddresses.length > 0 ? (
              displayedAddresses.map((address, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded border border-gray-200 p-3 hover:bg-gray-50 md:p-4 ${
                    selectedAddress === address ? 'border-green-500' : ''
                  }`}
                  onClick={() => handleAddressSelection(address)}
                >
                  <h3 className="text-base font-normal">
                    {address.address.street_address}
                  </h3>
                </div>
              ))
            ) : (
              <span className="relative rounded border border-border-200 bg-gray-100 px-5 py-6 text-center text-base">
                No Address Available
              </span>
            )}
            {addresses.length > 0 && (
              <button
                className="flex items-center text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent-hover focus:text-accent-hover focus:outline-none"
                onClick={() => setShowAllAddresses(!showAllAddresses)}
              >
                {showAllAddresses ? (
                  <MinusIcon className="h-4 w-4 stroke-2 me-0.5" />
                ) : (
                  <PlusIcon className="h-4 w-4 stroke-2 me-0.5" />
                )}
                <span className="text-teal-600">
                  {showAllAddresses ? 'Show Less' : 'Show More'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAddressSelection;
