const { Server } = require('socket.io');
let io;

module.exports = {
    init: (httpServer) => {
        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost/';

        io = new Server(httpServer, {
            cors: {
                origin: FRONTEND_URL, // Configure this according to your needs
                methods: ["GET", "POST"]
            }
        });

        io.on('connection', (socket) => {
            // Handle user authentication and room joining
            socket.on('register', (userId) => {
                console.log(`User registered: ${userId}`);
                socket.join(`user_${userId}`); // allows targeting user-specific notifications
            });

            socket.on('disconnect', () => {
                // Handle disconnect
                console.log(`Client disconnected: ${socket.id}`);
            });
        });

        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
};