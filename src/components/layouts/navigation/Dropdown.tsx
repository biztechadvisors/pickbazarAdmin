import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { dealerOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import Link from '@/components/ui/link';

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { permissions }: any = getAuthCredentials();
  let permission = hasAccess(dealerOnly, permissions);
  let identify = permissions;
  const matching: any = 'dealer';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col">
      <div className="" onClick={toggleMenu}>
        <div className="flex w-full items-center text-base text-body-dark text-start focus:text-accent cursor-pointer">
          <h3>Orders</h3>
          <ChevronDownIcon
            className={`h-3.5 w-3.5 shrink-0 opacity-75 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''
              }`}
          />
        </div>
      </div>
      <div className={`${isOpen ? '' : 'hidden'}`}>
        <div className="space-y-1 border-0 border-l border-dashed border-slate-300 ltr:pl-1 rtl:pr-1">
          <div>
            <Link
              href="/orders"
              className='relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[""] hover:text-accent focus:text-accent focus:text-accent'
            >
              <span>Order</span>
            </Link>
          </div>
          {permission && identify == matching && (
            <div>
              <Link
                href="/orders/dealer"
                className='relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[""] hover:text-accent focus:text-accent focus:text-accent'
              >
                <span>Self Order</span>
              </Link>
            </div>
          )}
          <div>
            <Link
              href="/sales"
              className='relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[""] hover:text-accent focus:text-accent focus:text-accent'
            >
              <span>Sales</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;

