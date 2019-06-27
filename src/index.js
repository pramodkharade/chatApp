const express =  require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const app = express();
const {generateMessages,generateLocationMessages} = require('../src/utils/messages');

const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 4000;
publicDirectoryPath = path.join(__dirname,'../public');

app.use(express.static(publicDirectoryPath));
let count = 0;
io.on('connection',(socket)=>{
    socket.emit('message',generateMessages('Welcome!'));
    socket.broadcast.emit('message',generateMessages('New user has joined!'));
    socket.on('sendMessage',(sendMsg,callback)=>{
        const filter = new Filter();
        if(filter.isProfane(sendMsg)){
            return callback('Profanity word is not allowed.')
        }
        io.emit('message',generateMessages(sendMsg));
        callback();
    });
    socket.on('sendLocation',(cords,callback)=>{
        io.emit('locationmessage',generateLocationMessages(`https://google.com/maps?q=${cords.latitude},${cords.longitude}`));
        callback();
    });
    socket.on('disconnect',()=>{
        io.emit('message',generateMessages('A user has left! '));
    });
});
server.listen(port,()=>{
    console.log(`Server is running on ${port}`);
});