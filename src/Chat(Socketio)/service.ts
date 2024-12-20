import { Server } from 'socket.io';

const connectedUser = new Set();

const socketService = (io: Server) => {
    io.on('connection', (socket) => {
        console.log('Connected successfully', socket.id);
        socket.join("some room");
        connectedUser.add(socket.id);
        io.to("some room").emit('connected-user', connectedUser.size);

        socket.on('disconnect', () => {
            console.log('Disconnected successfully', socket.id);
            connectedUser.delete(socket.id);
            io.to("some room").emit('connected-user', connectedUser.size);
        });

        socket.on('manual-disconnect', () => {
            console.log('Manual disconnect requested', socket.id);
            socket.disconnect();
        });

        // Handling message sending and broadcasting
        socket.on('sendMessage', async (data) => {
            const enrichedMessage = {
                message: data.message,
                author: data.author,
                date: new Date().toISOString() // Adding the current timestamp
            };

            console.log('Broadcasting message:', enrichedMessage);
            io.to("some room").emit('message-receive', enrichedMessage);
        });
    });
};

export default socketService;
