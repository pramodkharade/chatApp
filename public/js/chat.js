
const socket = io();
socket.on('message',(msg)=>{
    console.log('Greeting message to all  New client connection:',msg);
});
// socket.on('countUpdated',(count)=>{
//     console.log("The count has been updated!",count);
// });

document.querySelector("#increment").addEventListener('click',()=>{
    console.log('clicked');
    socket.emit('increment');
});