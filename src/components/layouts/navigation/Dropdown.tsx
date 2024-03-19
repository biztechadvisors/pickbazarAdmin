import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { dealerOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import Link from '@/components/ui/link';

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { permissions } = getAuthCredentials();
  let permission = hasAccess(dealerOnly, permissions);
  let identify = permissions;
  const matching: any = 'dealer';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <a className="flex flex-col">
      {/* <div className="px-3 pb-5 text-xs font-semibold uppercase tracking-[0.05em] text-body/60">
        Order management
      </div> */}
      {/* <div className="space-y-2"> */}
      <a className="" onClick={toggleMenu}>
        <div className="flex w-full items-center text-base text-body-dark text-start focus:text-accent">
          {/* <span className="text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-5 w-5 me-3"
              >
                <path
                  fill="currentColor"
                  d="m17.5 5.625-2.228 7.243a1.25 1.25 0 0 1-1.196.882H6.568a1.25 1.25 0 0 1-1.202-.906L3.304 5.625H17.5Z"
                  opacity="0.2"
                ></path>
                <path
                  fill="currentColor"
                  d="M7.5 16.875a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Zm6.875-1.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm3.723-9.816-2.23 7.243a1.866 1.866 0 0 1-1.791 1.323H6.568a1.883 1.883 0 0 1-1.802-1.36l-2.827-9.89H.625a.625.625 0 0 1 0-1.25h1.314a1.256 1.256 0 0 1 1.202.906L3.775 5H17.5a.625.625 0 0 1 .598.809Zm-1.444.441H4.132l1.835 6.422a.625.625 0 0 0 .601.453h7.509a.625.625 0 0 0 .597-.441l1.98-6.434Z"
                ></path>
              </svg>
            </span> */}
          <h3>Orders</h3>
          <ChevronDownIcon
            className={`h-3.5 w-3.5 shrink-0 opacity-75 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''
              }`}
          />
        </div>
      </a>
      <div className={`${isOpen ? '' : 'hidden'} !mt-0`}>
        {/* <div className="pt-2 ltr:pl-5 rtl:pr-5"> */}
        <div className="space-y-1 border-0 border-l border-dashed border-slate-300 ltr:pl-1 rtl:pr-1">
          <div>
            <Link
              href="/orders"
              className='relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[""] hover:text-accent focus:text-accent focus:text-accent'
            >
              <span>Order</span>
            </Link>
          </div>
          {permission && identify == matching &&
            <div>
              <Link
                href="/shops/create"
                className='relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[""] hover:text-accent focus:text-accent focus:text-accent'
              >
                <span>Self Order</span>
              </Link>
            </div>
          }
          <div>
            <Link
              href="/sales"
              className='relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[""] hover:text-accent focus:text-accent focus:text-accent'
            >
              <span>Sales</span>
            </Link>
          </div>

        </div>
        {/* </div> */}
      </div>
      {/* </div> */}
    </a>
  );
};

export default Dropdown;
