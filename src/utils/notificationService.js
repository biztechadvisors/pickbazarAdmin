// // notificationService.js

// import io from 'socket.io-client';

// // Initialize the socket connection
// const initSocketConnection = () => {
//     const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage

//     const socket = io(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/notifications`, {
//         extraHeaders: {
//             'x-user-id': userId, // Use the authenticated user's ID
//         },
//     });

//     socket.on('notification', (message) => {
//         console.log('Received notification:', message);
//     });

//     // Subscribe to notifications
//     socket.emit('subscribe', { userId });

//     // Unsubscribe from notifications (if needed)
//     // socket.emit('unsubscribe', { userId });

//     return socket;
// };

// const socket = initSocketConnection();

// // Higher-Order Function to send notifications
// const withNotification = (fn) => async (...args) => {
//     try {
//         const result = await fn(...args);
//         const userId = localStorage.getItem('userId');
//         const message = 'Your custom notification message'; // Adjust the message as needed

//         socket.emit('notify', { userId, message });

//         return result;
//     } catch (error) {
//         console.error('Error during function execution:', error);
//         throw error;
//     }
// };

// export { withNotification, socket };



