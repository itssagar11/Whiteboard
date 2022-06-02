  
function Draw() {

    let canvas = document.getElementById("canvas");
    canvas.width= window.innerWidth;
    canvas.height=window.innerHeight;
    let x,y;
    if (canvas.getContext) {
        let ctx = canvas.getContext("2d");
        console.warn("Page lOaded");

        let mouseDown=false;
        var socket = io();
        window.onmousedown=(e)=>{
            socket.emit('down',{x,y});
            mouseDown=true;
        }

        window.onmouseup=(e)=>{
            socket.emit('draw',{x,y});
            mouseDown=false;
        }
        socket.on("ondraw",({x,y})=>{
            ctx.lineTo(x,y);
            ctx.stroke();
            //ctx.moveTo(x,y)

        })

        socket.on("ondown",({x,y})=>{
        
            ctx.moveTo(x,y)

        })
        window.onmousemove=(event)=>{
           x=event.clientX;
           y=event.clientY;
           if(mouseDown){
              socket.emit('draw',{x,y});
            document.body.style.cursor = "pointer";
            ctx.lineTo(x,y);
            ctx.stroke();
           }else{
            document.body.style.cursor = "default";
               ctx.moveTo(x,y)
           }
           

       }
     
        
    } else {

    }


}
