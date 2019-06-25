
const socket = io();
document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = document.querySelector('#message').value;
    socket.emit('sendMessage',message);
});

socket.on('message',(msg)=>{
    console.log(msg);
});

document.querySelector('#send-location').addEventListener('click',(e)=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supportted to your browser.');
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        });
        
    });
});
