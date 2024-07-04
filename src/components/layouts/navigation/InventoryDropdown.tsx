// import React, { useState, useEffect } from 'react';
// import { ChevronDownIcon } from '@heroicons/react/solid';
// import { dealerOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
// import Link from '@/components/ui/link';

// const InventoryDropdown = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [newShopSlug, setNewShopSlug] = useState(''); // State for newShopSlug
//   const { permissions } = getAuthCredentials();
//   const permission = hasAccess(dealerOnly, permissions);

//   useEffect(() => {
//     const storedShopSlug = localStorage.getItem('shopSlug');
//     if (storedShopSlug) {
//       setNewShopSlug(storedShopSlug);
//     }
//   }, []);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleSetNewShopSlug = (newShopSlug) => {
//     localStorage.setItem('shopSlug', newShopSlug);
//     setNewShopSlug(newShopSlug);
//   };

//   const buildUrl = (path) => {
//     return `/${newShopSlug}/${path}`;
//   };

//   return (
//     <div className="flex flex-col">
//       <button className="flex w-full items-center text-base text-body-dark text-start focus:text-accent" onClick={toggleMenu}>
//         <h3>Inventory</h3>
//         <ChevronDownIcon
//           className={`h-3.5 w-3.5 shrink-0 opacity-75 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
//         />
//       </button>
//       <div className={`${isOpen ? '' : 'hidden'} mt-0`}>
//         <div className="space-y-1 border-0 border-l border-dashed border-slate-300 ltr:pl-1 rtl:pr-1">
//           <div>
//             <Link
//               href={buildUrl('')}
//               className="relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[''] hover:text-accent focus:text-accent"
//               onClick={() => handleSetNewShopSlug(newShopSlug)}
//             >
//               <span>Account Details</span>
//             </Link>
//           </div>
//           <div>
//             <Link
//               href={buildUrl('/attributes')}
//               className="relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[''] hover:text-accent focus:text-accent"
//               onClick={() => handleSetNewShopSlug(newShopSlug)}
//             >
//               <span>Attributes</span>
//             </Link>
//           </div>
//           <div>
//             <Link
//               href={buildUrl('/groups')}
//               className="relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[''] hover:text-accent focus:text-accent"
//               onClick={() => handleSetNewShopSlug(newShopSlug)}
//             >
//               <span>Groups</span>
//             </Link>
//           </div>
//           <div>
//             <Link
//               href={buildUrl('/categories')}
//               className="relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[''] hover:text-accent focus:text-accent"
//               onClick={() => handleSetNewShopSlug(newShopSlug)}
//             >
//               <span>Categories</span>
//             </Link>
//           </div>
//           <div>
//             <Link
//               href={buildUrl('/subCategories')}
//               className="relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[''] hover:text-accent focus:text-accent"
//               onClick={() => handleSetNewShopSlug(newShopSlug)}
//             >
//               <span>SubCategories</span>
//             </Link>
//           </div>
//           <div>
//             <Link
//               href={buildUrl('/products')}
//               className="relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[''] hover:text-accent focus:text-accent"
//               onClick={() => handleSetNewShopSlug(newShopSlug)}
//             >
//               <span>Products</span>
//             </Link>
//           </div>
//           <div>
//             <Link
//               href={buildUrl('/reviews')}
//               className="relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[''] hover:text-accent focus:text-accent"
//               onClick={() => handleSetNewShopSlug(newShopSlug)}
//             >
//               <span>Reviews</span>
//             </Link>
//           </div>
//           <div>
//             <Link
//               href={buildUrl('/tags')}
//               className="relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[''] hover:text-accent focus:text-accent"
//               onClick={() => handleSetNewShopSlug(newShopSlug)}
//             >
//               <span>Tags</span>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InventoryDropdown;



import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { dealerOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import Link from '@/components/ui/link';

const InventoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newShopSlug, setNewShopSlug] = useState('');
  const { permissions } = getAuthCredentials();
  const permission = hasAccess(dealerOnly, permissions);

  useEffect(() => {
    const storedShopSlug = localStorage.getItem('shopSlug');
    const storedIsOpen = localStorage.getItem('isOpen') === 'true';
    if (storedShopSlug) {
      setNewShopSlug(storedShopSlug);
    }
    setIsOpen(storedIsOpen);
  }, []);

  const toggleMenu = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    localStorage.setItem('isOpen', newIsOpen);
  };

  const handleSetNewShopSlug = (newShopSlug) => {
    localStorage.setItem('shopSlug', newShopSlug);
    setNewShopSlug(newShopSlug);
  };

  const buildUrl = (path) => {
    return `/${newShopSlug}/${path}`;
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
          <div>
            <Link
              href={buildUrl('')}
              className="relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[''] hover:text-accent focus:text-accent"
              onClick={() => handleSetNewShopSlug(newShopSlug)}
            >
              <span>Account Details</span>
            </Link>
          </div>
          <div>
            <Link
              href={buildUrl('/attributes')}
              className="relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[''] hover:text-accent focus:text-accent"
              onClick={() => handleSetNewShopSlug(newShopSlug)}
            >
              <span>Attributes</span>
            </Link>
          </div>
          <div>
            <Link
              href={buildUrl('/groups')}
              className="relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[''] hover:text-accent focus:text-accent"
              onClick={() => handleSetNewShopSlug(newShopSlug)}
            >
              <span>Groups</span>
            </Link>
          </div>
          <div>
            <Link
              href={buildUrl('/categories')}
              className="relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[''] hover:text-accent focus:text-accent"
              onClick={() => handleSetNewShopSlug(newShopSlug)}
            >
              <span>Categories</span>
            </Link>
          </div>
          <div>
            <Link
              href={buildUrl('/subCategories')}
              className="relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[''] hover:text-accent focus:text-accent"
              onClick={() => handleSetNewShopSlug(newShopSlug)}
            >
              <span>SubCategories</span>
            </Link>
          </div>
          <div>
            <Link
              href={buildUrl('/products')}
              className="relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[''] hover:text-accent focus:text-accent"
              onClick={() => handleSetNewShopSlug(newShopSlug)}
            >
              <span>Products</span>
            </Link>
          </div>
          <div>
            <Link
              href={buildUrl('/reviews')}
              className="relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[''] hover:text-accent focus:text-accent"
              onClick={() => handleSetNewShopSlug(newShopSlug)}
            >
              <span>Reviews</span>
            </Link>
          </div>
          <div>
            <Link
              href={buildUrl('/tags')}
              className="relative flex w-full cursor-pointer items-center rounded-lg py-2 px-5 text-sm text-body-dark text-start before:absolute before:-left-0.5 before:top-[18px] before:h-px before:w-3 before:border-t before:border-dashed before:border-gray-300 before:content-[''] hover:text-accent focus:text-accent"
              onClick={() => handleSetNewShopSlug(newShopSlug)}
            >
              <span>Tags</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDropdown;
