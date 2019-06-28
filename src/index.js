const express =  require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const app = express();
const {generateMessages,generateLocationMessages} = require('./utils/messages');
const {addUser,removeUser,getUser,getUserInRoom} = require('./utils/users');

const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 4000;
publicDirectoryPath = path.join(__dirname,'../public');

app.use(express.static(publicDirectoryPath));
let count = 0;
io.on('connection',(socket)=>{
    
    socket.on('join',({username,room},callback)=>{
        console.log('usrname:',username);
       const {error,user} = addUser({id:socket.id,username:username,room:room});
     
       if(error){
        return callback(error);
       }
        socket.join(user.room);
        socket.emit('message',generateMessages('Welcome!'));
        socket.broadcast.to(user.room).emit('message',generateMessages(`${user.username} has joined.`));
        /*****
         * * socket.emit, io.emit,socket.broadcast.emit
         * io.to.emit , socket.broadcast.to.emit
         * *********/
        callback();
    });
    socket.on('sendMessage',(sendMsg,callback)=>{
        const filter = new Filter();
        if(filter.isProfane(sendMsg)){
            return callback('Profanity word is not allowed.')
        }
        io.to('').emit('message',generateMessages(sendMsg));
        callback();
    });
    socket.on('sendLocation',(cords,callback)=>{
        io.emit('locationmessage',generateLocationMessages(`https://google.com/maps?q=${cords.latitude},${cords.longitude}`));
        callback();
    });
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message',generateMessages(`${user.username} has a left`));
        }
    });
});
server.listen(port,()=>{
    console.log(`Server is running on ${port}`);
});