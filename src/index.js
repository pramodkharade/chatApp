const express =  require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const app = express();

const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 4000;
publicDirectoryPath = path.join(__dirname,'../public');

app.use(express.static(publicDirectoryPath));
let count = 0;
io.on('connection',(socket)=>{
    socket.emit('message','Welcome!');
    socket.broadcast.emit('message','New user has joined!');
    socket.on('sendMessage',(sendMsg,callback)=>{
        const filter = new Filter();
        if(filter.isProfane(sendMsg)){
            return callback('Profanity word is not allowed.')
        }
        io.emit('message',sendMsg);
        callback();
    });
    socket.on('sendLocation',(cords,callback)=>{
        io.emit('locationmessage',`https://google.com/maps?q=${cords.latitude},${cords.longitude}`);
        callback();
    });
    socket.on('disconnect',()=>{
        io.emit('message','A user has left! ');
    });
});
server.listen(port,()=>{
    console.log(`Server is running on ${port}`);
});