var socket =  io();
var messageTextBox = jQuery('[name=message]');
var messages = jQuery('#messages');
console.log(messages.prop);  
function scrollToButtom(){
    //Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    var preMessage = newMessage.prev();
    //Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop  = messages.prop('scrollTop');
    var scrollHeight  = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var preMessageHeight = preMessage.innerHeight();
    //calculating the heights required to scrol on new message arraives
    if(clientHeight + scrollTop + newMessageHeight + preMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', () => {
    console.log('Conneted to server');
});

socket.on("disconnect", () => {
    console.log('disconnected from the server');
});

socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery("#message-template").html() ;
    var html = Mustache.render(template, {
        text:message.text,
        from:message.from,
        createdAt:formattedTime
    });

    jQuery("#messages").append(html)
    scrollToButtom();
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
    //using jQuery without using mustache
//     var li = jQuery('<li></li>');
//     var a = jQuery('<a target="_blank">My Current Location</a>');
//     li.text(`${message.from}  ${formattedTime}:  `);
//     a.attr('href',message.url);
//     li.append(a);
//     jQuery('#messages').append(li);
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template,{
        createdAt:formattedTime,
        from:message.from,
        url:message.url
    });
    jQuery('#messages').append(html);
    scrollToButtom();
});