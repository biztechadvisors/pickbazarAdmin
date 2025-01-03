import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useLayer } from 'react-laag';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from '@/components/icons/bell';
import { Dot } from '@/components/icons/dot';
import NotificationCard from '@/components/ui/notification-card';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ItemType = {
  source?: string;
  title?: string;
  message?: string | React.ReactNode;
  time?: string;
  read?: boolean;
};

interface MenuType {
  data: ItemType[];
}

const NotificationMenu: React.FC<MenuType> = ({ data }) => {
  const [isOpen, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<ItemType[]>(data);

  useEffect(() => {
    let userId;
    if (typeof window !== 'undefined' && window.localStorage) {
      userId = localStorage.getItem('userId');
    }

    const socket = io('http://localhost:5000/notifications', {
      query: { userId },
      transports: ['websocket'], // Ensure using websocket transport
    });

    socket.on('connect', () => {
      console.log('Connected to the notification server');
    });

    socket.on('notification', (notification: ItemType) => {
      console.log('New notification:', notification.message);
      setNotifications((prev) => [notification, ...prev]);

      // Display toast notification
      toast.info(`${notification.title}: ${notification.message}`, {
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
  }, []);

  const handleClearAll = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const { renderLayer, triggerProps, layerProps } = useLayer({
    isOpen,
    onOutsideClick: () => setOpen(false), // close the menu when the user clicks outside
    onDisappear: () => setOpen(false), // close the menu when the menu gets scrolled out of sight
    overflowContainer: false, // keep the menu positioned inside the container
    placement: 'bottom-end', // we prefer to place the menu "bottom-end"
    triggerOffset: 12, // keep some distance to the trigger
  });

  return (
    <>
      <button
        className="relative flex items-center justify-center rounded text-heading outline-none transition duration-300 ease-in-out focus:outline-none focus:ring-1"
        aria-label="show notifications"
        {...triggerProps}
        onClick={() => setOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {notifications.some(n => !n.read) && (
          <div className="absolute -top-1 end-0 flex text-green-500">
            <Dot />
          </div>
        )}
      </button>

      {renderLayer(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              {...layerProps}
              initial={{ opacity: 0, scale: 0.85 }} // animate from
              animate={{ opacity: 1, scale: 1 }} // animate to
              exit={{ opacity: 0, scale: 0.85 }} // animate exit
              transition={{
                type: 'spring',
                stiffness: 800,
                damping: 35,
              }}
              className="z-20 w-80 overflow-hidden rounded bg-light shadow-base"
            >
              <div className="flex items-center justify-between border-b border-border-200 px-4 py-3">
                <span className="text-lg font-semibold text-heading">
                  Notification
                </span>

                <button
                  className="text-sm font-semibold text-red-500 transition duration-200 hover:text-red-600 focus:outline-none focus:ring-1"
                  onClick={handleClearAll}
                >
                  Clear all
                </button>
              </div>
              {!!notifications.length ? (
                notifications.map((item, index) => (
                  <NotificationCard
                    key={index}
                    src={item.source}
                    text={item.message}
                    time={item.time}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center border-b border-border-200 bg-light">
                  <p className="py-5 text-sm text-body">
                    You do not have any notifications.
                  </p>
                </div>
              )}

              <a
                href="#"
                className="flex h-11 items-center justify-center bg-light px-4 text-sm font-semibold text-green-500 transition duration-200 ease-in-out hover:text-green-600"
              >
                See all notifications
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default NotificationMenu;
