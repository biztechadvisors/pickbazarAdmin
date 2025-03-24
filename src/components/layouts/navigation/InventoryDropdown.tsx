import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { dealerOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import Link from '@/components/ui/link';

const InventoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newShopSlug, setNewShopSlug] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null); // Track hovered item
  const { permissions } = getAuthCredentials();
  const permission = hasAccess(dealerOnly, permissions);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedShopSlug = localStorage.getItem('shopSlug');
      const storedIsOpen = localStorage.getItem('isOpen') === 'true';
      if (storedShopSlug) {
        setNewShopSlug(storedShopSlug);
      }
      setIsOpen(storedIsOpen);
    }
  }, []);

  const toggleMenu = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isOpen', newIsOpen);
    }
  };

  const handleSetNewShopSlug = (newShopSlug) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shopSlug', newShopSlug);
    }
    setNewShopSlug(newShopSlug);
  };

  const buildUrl = (path) => {
    return `/${newShopSlug}/${path}`;
  };

  // Tooltip content for each item
  const tooltips = {
    accountDetails: 'View and manage your account details.',
    attributes: 'Add values like color, material, etc.',
    categories: 'Organize products into categories.',
    subCategories: 'Create subcategories under parent categories.',
    groups: 'Manage collections of products.',
    products: 'Add and manage products in your inventory.',
    reviews: 'View and manage product reviews.',
    tags: 'Add tags to categorize products.',
  };

  return (
    <div className="flex flex-col">
      <button
        className="flex w-full items-center text-base text-body-dark text-start focus:text-accent"
        onClick={toggleMenu}
      >
        <h3>Inventory</h3>
        <ChevronDownIcon
          className={`h-3.5 w-3.5 shrink-0 opacity-75 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`${isOpen ? '' : 'hidden'} mt-0`}>
        <div className="space-y-1 border-0 border-l border-dashed border-slate-300 ltr:pl-1 rtl:pr-1">
          {Object.entries(tooltips).map(([key, tooltip]) => (
            <div
              key={key}
              className="relative"
              onMouseEnter={() => setHoveredItem(key)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                href={buildUrl(key === 'groups' ? 'groups' : key === 'accountDetails' ? '' : key)}
                className="relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[''] hover:text-accent focus:text-accent"
                onClick={() => handleSetNewShopSlug(newShopSlug)}
              >
                <span>
                  {key === 'accountDetails'
                    ? 'Account Details'
                    : key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              </Link>
              {hoveredItem === key && (
                <div
                  className="absolute left-full ml-2 p-2 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                >
                  <p className="text-sm text-gray-700">{tooltip}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryDropdown;