const express= require("express");
const rough= require("roughjs");
const  connect  = require("http2");
const app= express();
const PORT= 8000;
const httpServer= require('http').createServer(app);
const io= require("socket.io")(httpServer);
app.use(express.static("public"));
let connection=[];
io.on('connection',(socket)=>{
    connection.push(socket);
    console.warn(`${socket.id} has connected`);
    setTimeout(function(){
        socket.send('New User Connected!');
     }, 3000);
    socket.on('draw',(data)=>{
        connection.forEach((con)=>{
            if(con.id!=socket.id){
                con.emit('ondraw',({x:data.x,y:data.y,tool:data.tool,pencolor:data.penColor,penwidth:data.penWidth}));
            }
        })
    });

    socket.on('down',(data)=>{
        connection.forEach((con)=>{
            if(con.id!=socket.id){
                con.emit('ondown',({x:data.x,y:data.y}));
            }
        })
    });

    socket.on('rectEmit',(data)=>{
        connection.forEach((con)=>{
            if(con.id!=socket.id){
               // console.warn("RectEmitted");
                con.emit('rectDraw',({x1:data.rectXa,y1:data.rectYa,x2:data.rectXb,y2:data.rectYb,width:data.width,color:data.color}));
            }
        })
    });

    socket.on('lineEmit',(data)=>{
        connection.forEach((con)=>{
            if(con.id!=socket.id){
              //  console.warn("lineEmitted",data);
                con.emit('lineDraw',({x1:data.lineXa,y1:data.lineYa,x2:data.lineXb,y2:data.lineYb,width:data.penColor,color:data.penColor}));
            }
        })
    });
    socket.on('TextEmit',(data)=>{
        connection.forEach((con)=>{
            if(con.id!=socket.id){
            console.warn("TextEmitted",data);
                con.emit('TextDraw',({fs:data.fs,xa:data.xa,ya:data.ya,text:data.text}));
            }
        })
    });
    socket.on('StateEmit',(data)=>{
        connection.forEach((con)=>{
            if(con.id!=socket.id){
            console.warn("StateEmitted",data);
                con.emit('StateDraw',({restore_state:data.restore_state}));
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