// import cn from 'classnames';
// import { Fragment, useState, useEffect } from 'react';
// import { Menu, Transition } from '@headlessui/react';
// import Avatar from '@/components/common/avatar';
// import Link from '@/components/ui/link';
// import { siteSettings } from '@/settings/site.settings';
// import { useTranslation } from 'next-i18next';
// import { useMeQuery } from '@/data/user';
// import ToggleSwitch from './ToggleSwitch';
// import { useAtom } from 'jotai';
// import { toggleAtom } from '../../../utils/atoms';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const notifications = [
//     {
//         id: 1,
//         title: 'Welcome!',
//         message: 'Thank you for signing up for our service.',
//         timestamp: '2024-07-18T08:30:00Z',
//         read: false,
//     },
//     {
//         id: 2,
//         title: 'New Feature Released',
//         message: 'Check out our new feature in your dashboard.',
//         timestamp: '2024-07-19T12:00:00Z',
//         read: false,
//     },
//     {
//         id: 3,
//         title: 'Account Update',
//         message: 'Your account details have been successfully updated.',
//         timestamp: '2024-07-20T15:45:00Z',
//         read: true,
//     },
//     {
//         id: 4,
//         title: 'Maintenance Alert',
//         message: 'Scheduled maintenance will occur on 2024-07-22 from 02:00 to 04:00 UTC.',
//         timestamp: '2024-07-21T10:20:00Z',
//         read: false,
//     },
// ];

// export default function NotificationMenu() {
//   // const { data } = useMeQuery();

//   console.log('data-notification', notifications);
//   const { t } = useTranslation('common');

//   const [isChecked, setIsChecked] = useAtom(toggleAtom);

//   const handleToggle = () => {
//     setIsChecked((prevIsChecked) => !prevIsChecked);
//   };

//   // Count the number of unread notifications
//   const unreadNotifications = notifications.filter(notification => !notification.read).length;
//    console.log("unreadNotifications",unreadNotifications)

//   useEffect(() => {
//     if (unreadNotifications > 0) {
//       toast.info(`You have ${unreadNotifications} new notifications`);
//     }
//   }, [unreadNotifications]);

//   return (
//     <Menu as="div" className="relative inline-block text-left">
//       <Menu.Button className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-white rounded-md bg-opacity-20 hover:bg-opacity-30">
//         <img src="/bell.png" alt="Logo" className="w-5 h-5 mr-2" />
        
//       </Menu.Button>
//       <Transition
//         as={Fragment}
//         enter="transition ease-out duration-100"
//         enterFrom="transform opacity-0 scale-95"
//         enterTo="transform opacity-100 scale-100"
//         leave="transition ease-in duration-75"
//         leaveFrom="transform opacity-100 scale-100"
//         leaveTo="transform opacity-0 scale-95"
//       >
//         <Menu.Items
//           as="ul"
//           className="absolute mt-1 w-48 rounded bg-white shadow-md end-0 origin-top-end focus:outline-none"
//         >
//           {notifications.map((notification) => (
//             <Menu.Item key={notification.id}>
//               {({ active }) => (
//                 <li
//                   className={`${
//                     active ? 'bg-gray-100' : ''
//                   } flex flex-col space-y-1 px-4 py-3 text-sm`}
//                 >
//                   <span className="font-semibold capitalize">{notification.title}</span>
//                   <span className="text-xs">{notification.message}</span>
//                   <small className="text-xs text-gray-500">{new Date(notification.timestamp).toLocaleString()}</small>
//                 </li>
//               )}
//             </Menu.Item>
//           ))}
//         </Menu.Items>
//       </Transition>
//       <ToastContainer />
//     </Menu>
//   );
// }


//------------------------------------------------------------------------------------------------------------
// import cn from 'classnames';
// import { Fragment, useState } from 'react';
// import { Menu, Transition } from '@headlessui/react';
// import Avatar from '@/components/common/avatar';
// import Link from '@/components/ui/link';
// import { siteSettings } from '@/settings/site.settings';
// import { useTranslation } from 'next-i18next';
// import { useMeQuery } from '@/data/user';
// import ToggleSwitch from './ToggleSwitch';
// import { useAtom } from 'jotai';
// import { toggleAtom } from '../../../utils/atoms';

// const notifications = [
//     {
//         id: 1,
//         title: 'Welcome!',
//         message: 'Thank you for signing up for our service.',
//         timestamp: '2024-07-18T08:30:00Z',
//         read: false,
//     },
//     {
//         id: 2,
//         title: 'New Feature Released',
//         message: 'Check out our new feature in your dashboard.',
//         timestamp: '2024-07-19T12:00:00Z',
//         read: false,
//     },
//     {
//         id: 3,
//         title: 'Account Update',
//         message: 'Your account details have been successfully updated.',
//         timestamp: '2024-07-20T15:45:00Z',
//         read: true,
//     },
//     {
//         id: 4,
//         title: 'Maintenance Alert',
//         message: 'Scheduled maintenance will occur on 2024-07-22 from 02:00 to 04:00 UTC.',
//         timestamp: '2024-07-21T10:20:00Z',
//         read: false,
//     },
// ];

// export default function NotificationMenu() {
//   // const { data } = useMeQuery();

//   console.log('data-notification', notifications);
//   const { t } = useTranslation('common');

//   const [isChecked, setIsChecked] = useAtom(toggleAtom);

//   const handleToggle = () => {
//     setIsChecked((prevIsChecked) => !prevIsChecked);
//   };

//   return (
//     <Menu as="div" className="relative inline-block text-left">
//       <Menu.Button className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-white rounded-md bg-opacity-20 hover:bg-opacity-30">
//         <img src="/bell.png" alt="Logo" className="w-5 h-5 mr-2" /> 
       
//       </Menu.Button>
//       <Transition
//         as={Fragment}
//         enter="transition ease-out duration-100"
//         enterFrom="transform opacity-0 scale-95"
//         enterTo="transform opacity-100 scale-100"
//         leave="transition ease-in duration-75"
//         leaveFrom="transform opacity-100 scale-100"
//         leaveTo="transform opacity-0 scale-95"
//       >
//         <Menu.Items
//           as="ul"
//           className="absolute mt-1 w-48 rounded bg-white shadow-md end-0 origin-top-end focus:outline-none"
//         >
//           {notifications.map((notification) => (
//             <Menu.Item key={notification.id}>
//               {({ active }) => (
//                 <li
//                   className={`${
//                     active ? 'bg-gray-100' : ''
//                   } flex flex-col space-y-1 px-4 py-3 text-sm`}
//                 >
//                   <span className="font-semibold capitalize">{notification.title}</span>
//                   <span className="text-xs">{notification.message}</span>
//                   <small className="text-xs text-gray-500">{new Date(notification.timestamp).toLocaleString()}</small>
//                 </li>
//               )}
//             </Menu.Item>
//           ))}
//         </Menu.Items>
//       </Transition>
//     </Menu>
//   );
// }


//----------------------------------------------------------------------------------------------------


import cn from 'classnames';
import { Fragment, useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from '@/components/common/avatar';
import Link from '@/components/ui/link';
import { siteSettings } from '@/settings/site.settings';
import { useTranslation } from 'next-i18next';
import { useMeQuery } from '@/data/user';
import ToggleSwitch from './ToggleSwitch';
import { useAtom } from 'jotai';
import { toggleAtom } from '../../../utils/atoms';

const initialNotifications = [
    {
        id: 1,
        title: 'Welcome!',
        message: 'Thank you for signing up for our service.',
        timestamp: '2024-07-18T08:30:00Z',
        read: false,
    },
    {
        id: 2,
        title: 'New Feature Released',
        message: 'Check out our new feature in your dashboard.',
        timestamp: '2024-07-19T12:00:00Z',
        read: false,
    },
    {
        id: 3,
        title: 'Account Update',
        message: 'Your account details have been successfully updated.',
        timestamp: '2024-07-20T15:45:00Z',
        read: true,
    },
    {
        id: 4,
        title: 'Maintenance Alert',
        message: 'Scheduled maintenance will occur on 2024-07-22 from 02:00 to 04:00 UTC.',
        timestamp: '2024-07-21T10:20:00Z',
        read: false,
    },
];

export default function NotificationMenu() {
  // const { data } = useMeQuery();
  const { t } = useTranslation('common');

  const [isChecked, setIsChecked] = useAtom(toggleAtom);
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleToggle = () => {
    setIsChecked((prevIsChecked) => !prevIsChecked);
  };

  // useEffect(() => {
  //   if (notifications.length > 0) {
  //     const unreadNotifications = notifications.filter(n => !n.read);
  //     if (unreadNotifications.length > 0) {
  //       const latestNotification = unreadNotifications[0]; // Get the most recent unread notification
  //       toast.info(`${latestNotification.title}: ${latestNotification.message}`, {
  //         position: "top-right",
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //       });
  //       setNotifications(prevNotifications =>
  //         prevNotifications.map(notification =>
  //           notification.id === latestNotification.id ? { ...notification, read: true } : notification
  //         )
  //       );
  //     }
  //   }
  // }, [notifications]);

  // Simulate receiving a new notification
  const addNewNotification = () => {
    const newNotification = {
      id: notifications.length + 1,
      title: 'New Notification',
      message: `This is notification number ${notifications.length + 1}.`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications([newNotification, ...notifications]);
  };

  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-white rounded-md bg-opacity-20 hover:bg-opacity-30">
          <img src="/bell.png" alt="Logo" className="w-5 h-5 mr-2" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            as="ul"
            className="absolute mt-1 w-48 rounded bg-white shadow-md end-0 origin-top-end focus:outline-none"
          >
            {notifications.map((notification) => (
              <Menu.Item key={notification.id}>
                {({ active }) => (
                  <li
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } flex flex-col space-y-1 px-4 py-3 text-sm`}
                  >
                    <span className="font-semibold capitalize">{notification.title}</span>
                    <span className="text-xs">{notification.message}</span>
                    <small className="text-xs text-gray-500">{new Date(notification.timestamp).toLocaleString()}</small>
                  </li>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
      {/* <button onClick={addNewNotification} className="mt-4 p-2 bg-blue-500 text-white rounded">
        
      </button> */}
    </div>
  );
}


