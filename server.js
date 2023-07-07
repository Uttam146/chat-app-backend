const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const { errorHandler, notFound } = require('./Middleware/errorMiddleware');
require('dotenv').config();

connectDB();
const app = express();
app.use(cors());
app.use(express.json());


require('./Routes/userRoute')(app);
require('./Routes/chatRoute')(app);
require('./Routes/messageRoute')(app);
app.use(notFound);
app.use(errorHandler);




const server = app.listen(process.env.PORT, () => {
    console.log(`Application running on port ${process.env.PORT}`)
});

const io = require('socket.io')(server, {
    ping: 60000,
    cors: {
        origin: '*',
    },
})


io.on('connection', (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._userId);
        socket.emit("connected");
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log('User Joined Room:' + room);
    })
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");
        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;
            socket.to(chat._id).emit("message recieved", newMessageRecieved);
        });
    })
    
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
})