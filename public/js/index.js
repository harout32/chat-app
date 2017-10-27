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

//  socket.emit('createMessage',{
//      to:'hello@gmail.com',
//      text: 'hello too'
//  })


jQuery('#message-form').on('submit',function(e){
    e.preventDefault();
    socket.emit('createMessage',{
        from:'user',
        text: jQuery('[name=message]').val()
    },function() {

    });
})