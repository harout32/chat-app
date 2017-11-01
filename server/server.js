const path     = require('path');
const express  = require('express');
const http     = require('http');
const socketIO = require('socket.io');

const port     = process.env.PORT || '3000';

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');
 
let app        = express();
let server     = http.createServer(app);
let io         = socketIO(server);  
let users = new Users();

app.use(express.static(path.join(__dirname,'../public')));
io.on('connection', (socket) => {

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and Room name are required');
            return;
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        //greeting message to the newly joined  user
        socket.emit('newMessage',generateMessage('Admin','welcome to chat app'));
        //informing the others when new user joined
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined `));
        callback();
    })

    //listening to creating messages from the client side
    socket.on('createMessage',(message, callback)=>{
    //to emit the the new message to all the users
        io.emit('newMessage',generateMessage(message.from,message.text));
        callback('this is from the server');
    });
    //on create location 
    socket.on('createLocationMessage',(location) => {
        io.emit('newLocationMessage',generateLocationMessage('Admin',location.latitude,location.longitude));
    });
//on disconnecting
socket.on("disconnect", ()=>{
    let user = users.removeUser(socket.id);

    if(user) {
        io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left.`));
    }

});
});



server.listen(port,()=>{
    console.log(`starting to listen to port : ${port}` );
});


        //io.emit  ->  io.to('the room name').emit 
        //socket.broadcast.emit  ->  socket.broadcast.to('the room name').emit
        //socket.emit