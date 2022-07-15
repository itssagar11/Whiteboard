const express= require("express");
const  connect  = require("http2");
const app= express();
const PORT= 8000;
const httpServer= require('http').createServer(app);
const io= require("socket.io")(httpServer);
app.use(express.static("public"));
let connection=[]
io.on('connection',(socket)=>{
    connection.push(socket);
    console.warn(`${socket.id} has connected`);
    setTimeout(function(){
        socket.send('New User Connected!');
     }, 3000);
    socket.on('draw',(data)=>{
        connection.forEach((con)=>{
            if(con.id!=socket.id){
                con.emit('ondraw',({x:data.x,y:data.y,tool:data.tool}));
            }
        })
    });

    socket.on('down',(data)=>{
        connection.forEach((con)=>{
            if(con.id!=socket.id){
                con.emit('ondown',({x:data.x,y:data.y,tool:data.tool}));
            }
        })
    });


    socket.on('disconnect',(reason)=>{
        console.warn(`${socket.id} has disconnected`);
        connection=connection.filter((con)=>con.id!==socket.id);
    })
})







httpServer.listen(8000,()=>{
    console.warn(`Server Started on ${PORT}`);
})