import React, { useState, useEffect, Fragment } from 'react';
import io from 'socket.io-client';
import { Menu, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import { toggleAtom } from '../../../utils/atoms';
import { Bell } from '@/components/icons/bell';
import { Dot } from '@/components/icons/dot';

const NotificationMenu = () => {
  const { t } = useTranslation('common');
  const [isChecked, setIsChecked] = useAtom(toggleAtom);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let userId;
    if (typeof window !== 'undefined' && window.localStorage) {
      userId = localStorage.getItem('userId');
    }

    if (userId) {
      const socket = io('http://localhost:5000/notifications', {
        query: { userId },
        transports: ['websocket'], // Ensure using websocket transport
      });

      socket.on('connect', () => {
        console.log('Connected to the notification server');
      });

      socket.on('notification', (data) => {
        console.log('New notification:', data);
        setNotifications((prev) => [data, ...prev]);
        toast.info(`${data.title}: ${data.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from the notification server');
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  const handleToggle = () => {
    setIsChecked((prevIsChecked) => !prevIsChecked);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="relative flex items-center justify-center rounded text-heading outline-none transition duration-300 ease-in-out focus:outline-none focus:ring-1" aria-label="show notifications">
        <Bell className="h-5 w-5" />
        {notifications.some(n => !n.read) && (
          <div className="absolute -top-1 end-0 flex text-green-500">
            <Dot />
          </div>
        )}
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
        <Menu.Items as="ul" className="absolute mt-1 w-80 rounded bg-white shadow-md end-0 origin-top-end focus:outline-none">
          {notifications.map((notification, index) => (
            <Menu.Item key={index}>
              {({ active }) => (
                <li className={`${active ? 'bg-gray-100' : ''} flex flex-col space-y-1 px-4 py-3 text-sm`}>
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
  );
};

export default NotificationMenu;
