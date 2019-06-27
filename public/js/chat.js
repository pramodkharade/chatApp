
const socket = io();
const $messageForm = document.querySelector('#message-form');
const $messageFrominput = $messageForm.querySelector('#message');
const $messageFormButton = $messageForm.querySelector('button');
const $sendMessageButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

/*****Template****/
const $messageTemplate = document.querySelector('#message-template').innerHTML;

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    $messageFormButton.setAttribute('disabled','disabled');
    const message = $messageFrominput.value;
    socket.emit('sendMessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled');
        $messageFrominput.value = '';
        $messageFrominput.focus();
        if(error){
            return console.log(error);
        }
        console.log('Message Delivered!');
        
    });
});

socket.on('message',(msg)=>{
    const html = Mustache.render($messageTemplate,{
        msgDynamic:msg
    });
    $messages.insertAdjacentHTML('beforeend',html);
    console.log(msg);
});

$sendMessageButton.addEventListener('click',(e)=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supportted to your browser.');
    }
    $sendMessageButton.setAttribute('disabled','disabled');
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            console.log('Location shared');
            $sendMessageButton.removeAttribute('disabled');
        });
        
    });
});
