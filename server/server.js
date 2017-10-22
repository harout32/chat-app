const path = require('path');
const express = require('express');

let app = express();

const port = process.env.PORT || '3000';


app.use(express.static(path.join(__dirname,'../public')));


app.listen(port,()=>{
    console.log(`starting to listen to port : ${port}` );
});
