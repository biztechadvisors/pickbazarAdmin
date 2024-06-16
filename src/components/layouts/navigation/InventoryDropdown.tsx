import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { dealerOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import Link from '@/components/ui/link';

const InventoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { permissions }: any = getAuthCredentials();
  let permission = hasAccess(dealerOnly, permissions);
  let identify = permissions;
  const matching: any = 'dealer';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <a className="flex flex-col">
    
      <a className="" onClick={toggleMenu}>
        <div className="flex w-full items-center text-base text-body-dark text-start focus:text-accent">
          
          <h3>Inventory</h3>
          <ChevronDownIcon
            className={`h-3.5 w-3.5 shrink-0 opacity-75 transition-transform duration-300 ${
              isOpen ? 'rotate-90' : ''
            }`}
          />
        </div>
      </a>
      <div className={`${isOpen ? '' : 'hidden'} !mt-0`}>       
        <div className="space-y-1 border-0 border-l border-dashed border-slate-300 ltr:pl-1 rtl:pr-1">
          <div>
            <Link
              href="/mera-shop"
              className='relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[""] hover:text-accent focus:text-accent focus:text-accent'
            >
              <span>Account Details</span>
            </Link>
          </div>
          
          <div>
            <Link
              href="/mera-shop/attributes"
              className='relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[""] hover:text-accent focus:text-accent focus:text-accent'
            >
              <span>Attributes</span>
            </Link>
          </div>
          <div>
            <Link
              href="/mera-shop/groups"
              className='relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[""] hover:text-accent focus:text-accent focus:text-accent'
            >
              <span>Groups</span>
            </Link>
          </div>
          <div>
            <Link
              href="/mera-shop/categories"
              className='relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[""] hover:text-accent focus:text-accent focus:text-accent'
            >
              <span>Categories</span>
            </Link>
          </div>
          <div>
            <Link
              href="/mera-shop/subCategories"
              className='relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[""] hover:text-accent focus:text-accent focus:text-accent'
            >
              <span>SubCategories</span>
            </Link>
          </div>
          <div>
            <Link
              href="/mera-shop/products"
              className='relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[""] hover:text-accent focus:text-accent focus:text-accent'
            >
              <span>Products</span>
            </Link>
          </div>
          <div>
            <Link
              href="/mera-shop/reviews"
              className='relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[""] hover:text-accent focus:text-accent focus:text-accent'
            >
              <span>Reviews</span>
            </Link>
          </div>
          <div>
            <Link
              href="/mera-shop/tags"
              className='relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[""] hover:text-accent focus:text-accent focus:text-accent'
            >
              <span>Tags</span>
            </Link>
          </div>
        </div>
       
      </div>
     
    </a>
  );
};

export default InventoryDropdown;
