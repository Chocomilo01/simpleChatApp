const io = require('socket.io')(3000, {
   cors: {
       origin: "http://127.0.0.1:5501",
       methods: ["GET", "POST"]
   }
});
const users = {};

io.on('connection', socket => {
    console.log('New user connected. Socket ID:', socket.id); //displays users name and socket Id

    socket.on('new-user', name => {
        console.log(`New user joined: ${name}. Socket ID: ${socket.id}`);
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
        
    });

    socket.on('send-chat-message', message => {
        console.log(`Message received from ${users[socket.id]}: ${message}`);
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        const disconnectedUserName = users[socket.id];
        if (disconnectedUserName) {
            console.log(`User disconnected: ${disconnectedUserName}. Socket ID: ${socket.id}`);
            socket.broadcast.emit('user-disconnected', disconnectedUserName);
            delete users[socket.id];
        } else {
            console.log('Unknown user disconnected. Socket ID:', socket.id);
        }
    });

    socket.on('error', error => {
        console.error('Socket error:', error);
    });
});

io.on('error', error => {
    console.error('Server error:', error);
});