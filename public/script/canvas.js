  // globle Variables
  let workState=0;
  let canvas;
  let tool="pen";
  let penColor="Black";
  let penWidth=5;
  let erasorWidth=20;
  
  
  // history Store
  let history = {
    redo_list: [],
    undo_list: [],
    saveState: function(canvas) {
      
   this.undo_list.push(canvas.toDataURL());  
   console.log(this.undo_list.length); 
    },
    
    undo: function(canvas, ctx) {
        console.log(this.undo_list.length)
      this.restoreStateUndo(canvas, ctx);
    },
    // redo: function(canvas, ctx) {
    //   this.restoreState(canvas, ctx, this.redo_list, this.undo_list);
    // },
    restoreStateUndo: function(canvas, ctx) {
      if(this.undo_list.length>0) {
        if(this.undo_list.length<=1){
          
          //this.redo_list.push(this.undo_list[this.undo_list.length-1]);
          this.undo_list.pop();
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          return
        }
        this.redo_list.push(canvas.toDataURL());
        let restore_state = this.undo_list[(this.undo_list.length)-2];
        this.undo_list.pop();
        //console.log(this.undo_list);
        //console.log(this.undo_list.length);
        let img = document.createElement("img");
        img.src= restore_state;
        
        img.onload = function() {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          ctx.drawImage(img, 0, 0,);  
        }
      }
    },


    restoreStateRedu: function(canvas,clk){
      if(this.redo_list.length<=0){
       
        return;
      }
      history.saveState(canvas);
      let restore_state= this.redo_list[(this.redo_list.length)-1];
      this.redo_list.pop();
     
      let img = document.createElement("img");
      img.src= restore_state;
      img.onload = function() {
        console.log(restore_state);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.drawImage(img, 0, 0,);  
      }
    },
    redu:function(canvas,clk){
      console.log("Redo size:");
      console.log(this.redo_list.length);
      this.restoreStateRedu(canvas,clk);
    }
  }
  
  function getSelector(select){
    tool=select;
}
function setPenColor(value){
    penColor=value;
}


function undo(){
    history.undo(canvas, ctx);
}
function redo(){
  history.redu(canvas, ctx);
}

//   function loadImg(){
//  console.error("D");
//     let ctximg= canvas.getContext("2d");
//     ctximg.fillStyle="red";
//   //ctximg.fillRect(50,200,100,50);
//    let img=document.getElementById("img");
//    console.log(img.value);
//    let toDisplay=document.createElement("img")
//   // toDisplay.src="~\fakepath\Screenshot 2022-07-09 220115.png"
//    console.log(toDisplay)
//    //img.src="icon/eraser-blue.svg";
//     //ctximg.drawImage(img, 100, 100,100,100);   
//   }

 
function Draw() {

    canvas = document.getElementById("canvas");
    canvas.width= window.innerWidth;
    canvas.height=window.innerHeight;
  
    console.log(canvas.height)
    let x,y;
    if (canvas.getContext) {
         ctx = canvas.getContext("2d");
       
        
        ctx.lineCap="round";
        let mouseDown=false;
        var socket = io();
        window.onmousedown=(e)=>{
            socket.emit('down',{x,y});
          
            mouseDown=true;
        }
        canvas.onmouseup=(e)=>{
          history.saveState(canvas);
          console.log();
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
           x=event.clientX-10;
           y=event.clientY+10;
          
           if(mouseDown){
            
              socket.emit('draw',{x,y});
            document.body.style.cursor = "pointer";
            if(tool=="eraser"){
                ctx.strokeStyle='white';
                ctx.lineWidth=erasorWidth;
            }else{
                ctx.strokeStyle=penColor;
                ctx.lineWidth=penWidth;
            }
            ctx.lineCap="round";
            ctx.lineJoin="round";
            ctx.lineTo(x,y);
            
            ctx.stroke();
           // push();
          // push();
        
           }else{
           
            document.body.style.cursor = "default";
               ctx.moveTo(x,y)
               
               console.log("done");
               ctx.beginPath();
               
           }
           

       }
     
        
    } else {

    }


}
