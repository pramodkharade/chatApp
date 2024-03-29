
const socket = io();
const $messageForm = document.querySelector('#message-form');
const $messageFrominput = $messageForm.querySelector('#message');
const $messageFormButton = $messageForm.querySelector('button');
const $sendMessageButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');

/*****Template****/
const $messageTemplate = document.querySelector('#message-template').innerHTML;
const $locationmessageTemplate = document.querySelector('#location-message-template').innerHTML;
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
/***Options/querystring***/

const {username,room } = Qs.parse(location.search,{ignoreQueryPrefix:true});

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
const autoScroll = ()=>{
    // new Message element
    const $newMessage = $messages.lastElementChild;

    // Height of new Message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible height 
    const visibleHeight = $messages.offsetHeight;

    // Height of Message container

    const containerHeight = $messages.scrollHeight;

    // How far I have to scroll

    const scrollOffset = $messages.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight;
    }

}
socket.on('message',(msg)=>{
    const html = Mustache.render($messageTemplate,{
        username:msg.username,
        msgDynamic:msg.text,
        createdAt:moment(msg.createdAt).format('h:mm:ss a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoScroll();
    console.log(msg);
});
socket.on('locationmessage',(url)=>{
    const html = Mustache.render($locationmessageTemplate,{
        username:url.username,
        url:url.url,
        createdAt:moment(url.createdAt).format('h:mm:ss a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoScroll();
    console.log(url);
});
socket.on('roomData',({room,users})=>{
    const html = Mustache.render($sidebarTemplate,{
        room,
        users
    });
    $sidebar.insertAdjacentHTML('beforeend',html);
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

socket.emit('join',{username,room},(error)=>{
    console.log('Emit Event:',username);
    if(error){
        alert(error);
        location.href='/';
    }
});