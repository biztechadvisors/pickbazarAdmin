// ${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/notifications

import io from 'socket.io-client';

// Helper function to get user ID from local storage
const getUserId = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem('userId');
    }
    return null; // Return null if not found
};

// Initialize the socket connection
const initSocketConnection = () => {
    const userId = getUserId(); // Retrieve user ID from local storage

    if (!userId) {
        console.error('User ID not found in local storage');
        return null;
    }

    const socket = io(`http://localhost:5050/notifications`, {
        extraHeaders: {
            'x-user-id': userId, // Use the authenticated user's ID
        },
    });

    socket.on('connect', () => {
        console.log('Connected to socket server');
    });

    socket.on('notification', (message) => {
        console.log('Received notification:', message);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
    });

    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
    });

    // Subscribe to notifications
    socket.emit('subscribe', { userId });

    return socket;
};

const socket = initSocketConnection();

// Higher-Order Function to send notifications
const withNotification = (fn) => async (...args) => {
    try {
        const result = await fn(...args);
        const userId = getUserId();
        const message = 'Your custom notification message'; // Adjust the message as needed
        if (socket) {
            console.log('Emitting notify event with userId and message:', userId, message);
            socket.emit('notify', { userId, message });
        } else {
            console.error('Socket connection not initialized');
        }

        return result;
    } catch (error) {
        console.error('Error during function execution:', error);
        throw error;
    }
};

export { withNotification, socket };

