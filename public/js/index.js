var socket =  io();
var messageTextBox = jQuery('[name=message]');

socket.on('connect', () => {
    console.log('Conneted to server');
});

socket.on("disconnect", () => {
    console.log('disconnected from the server');
});

socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    console.log('new Email arrived');
    console.log(message); 
    var li = jQuery('<li></li>');
    li.text(`${message.from}  ${formattedTime}: ${message.text}`);
    jQuery('#messages').append(li);
 });

jQuery('#message-form').on('submit',function(e){
    e.preventDefault();
    socket.emit('createMessage',{
        from:'user',
        text: messageTextBox.val()
    },function(knowledgeMessage) {
        messageTextBox.val('');
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click',function(){
    if (!navigator.geolocation){
        return alert('Geolocation not Supported by your browser');
    }

    locationButton.attr('disabled','disabled').text('Sending Location...')
    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    },function(){
        locationButton.removeAttr('disabled').text('Send Location');
        alert('unable to fetch your location')
    })
});

socket.on('newLocationMessage',function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Current Location</a>');
    li.text(`${message.from}  ${formattedTime}:  `);
    a.attr('href',message.url);
    li.append(a);
    jQuery('#messages').append(li);
})