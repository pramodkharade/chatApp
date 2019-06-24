
const socket = io();
document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = document.querySelector('#message').value;
    socket.emit('sendMessage',message);
});

socket.on('message',(msg)=>{
    console.log('Greeting message to all  New client connection:',msg);
});
