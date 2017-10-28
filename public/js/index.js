var socket =  io();

socket.on('connect', () => {
    console.log('Conneted to server');
});

socket.on("disconnect", () => {
    console.log('disconnected from the server');
});

socket.on('newMessage', function(message) {
    console.log('new Email arrived');
    console.log(message); 
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
 });

jQuery('#message-form').on('submit',function(e){
    e.preventDefault();
    socket.emit('createMessage',{
        from:'user',
        text: jQuery('[name=message]').val()
    },function() {

    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click',function(){
    if (!navigator.geolocation){
        return alert('Geolocation not Supported by your browser');
    }
    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    },function(){
        alert('unable to fetch your location')
    })
});

socket.on('newLocationMessage',function(message) {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Current Location</a>');
    li.text(`${message.from}:  `);
    a.attr('href',message.url);
    li.append(a);
    jQuery('#messages').append(li);
})