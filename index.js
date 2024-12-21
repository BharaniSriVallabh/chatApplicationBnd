import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

const app = express();

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());

const PORT = process.env.PORT || 3001;

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
    socket.on('message', (message) => {
        console.log('Message received:', message);
        io.emit('message', message);
    });
    //implementaion still in progress...
    socket.on('user-join', (username) => {
        console.log(username + 'joined the chat');
        socket.broadcast.emit('user-join', username);
    });
    socket.on('user-leave', (username) => {
        console.log(username + 'left the chat');
        socket.broadcast.emit('user-leave', username);
    });
    //
    socket.on('room_join', (data) => {
        let {username, room} = JSON.parse(data);
        console.log(room);
        socket.join(room);
        io.to(room).emit('room_join', data);
    });
    //room-leave implementation in progress...
    socket.on('room-leave', (username, room) => {
        console.log(username + 'left room:', room);
        socket.leave(room);
        socket.broadcast.to(room).emit('room-leave', username);
    });
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
    socket.on('warning', (warning) => {
        console.warn('Socket warning:', warning);
    });
    socket.on('error', (error) => {
        console.error('Socket connect error:', error);
    });
    socket.on('connect_timeout', () => {
        console.log('Socket connect timeout');
    });
    socket.on('disconnecting', () => {
        console.log('Socket disconnecting');
    });
    socket.on('reconnect_attempt', () => {
        console.log('Socket reconnect attempt');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});