const path     = require('path');
const express  = require('express');
const http     = require('http');
const socketIO = require('socket.io');

const port     = process.env.PORT || '3000';

const {generateMessage} = require('./utils/message');

let app        = express();
let server     = http.createServer(app);
let io         = socketIO(server);  


app.use(express.static(path.join(__dirname,'../public')));
io.on('connection', (socket) => {
    console.log('new user connected');
    socket.emit('newMessage',generateMessage('Admin','welcome to chat app'))
    socket.broadcast.emit('newMessage',generateMessage('Admin','new user joind'));

    // socket.emit('newMessage', {
    //     form:'harout@example.com',
    //     text : 'hey how are you',
    //     createdAt: new Date().getTime()
    // });

    socket.on('createMessage',(message, callback)=>{
        console.log(JSON.stringify(message,undefined,2));
    //to emit the the new message to all the users
    io.emit('newMessage',generateMessage(message.from,message.text));    
    callback('this is from the server');
    });

    socket.on("disconnect", ()=>{
        console.log('user was disconnected');
    });


});

server.listen(port,()=>{
    console.log(`starting to listen to port : ${port}` );
});
