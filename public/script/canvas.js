// globle Variable
let ctximg;
let workState = 0;
let canvas;
let tool = "pen";
let penColor = "Black";
let penWidth = 1;
let erasorWidth = 50;
let currentX = 0;
let currentY = 0;
let img
let draggable = false;
let startX,startY;
let textState=0;
let xa=0;
let ya=0;
let  lineXb,lineYb,lineXa,lineYa;
let rectXa,rectYa,rectYb,rectXb,rectFlag=false;
let imgImp = document.createElement("img");
let socket;
let images=[];
let current_img_index=0;
// history Store
let history = {
  redo_list: [],
  undo_list: [],
  saveState: function (canvas) {

    this.undo_list.push(canvas.toDataURL());
    console.log(this.undo_list.length);
  },

  undo: function (canvas, ctx) {
    console.log(this.undo_list.length)
    this.restoreStateUndo(canvas, ctx);
  },
  restoreStateUndo: function (canvas, ctx) {
    if (this.undo_list.length > 0) {
      if (this.undo_list.length <= 1) {

        this.undo_list.pop();
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        return
      }else{
        this.redo_list.push(canvas.toDataURL());
        let restore_state = this.undo_list[(this.undo_list.length) - 2];
        this.undo_list.pop();
  
        img = document.createElement("img");
        img.src = restore_state;
  
        img.onload = function () {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          ctx.drawImage(img, 0, 0,);
          socket.emit('StateEmit',{restore_state});
        }
      }
     
     
    }
  },


  restoreStateRedu: function (canvas, clk) {
    if (this.redo_list.length <= 0) {

      return;
    }
    history.saveState(canvas);
    let restore_state = this.redo_list[(this.redo_list.length) - 1];
    this.redo_list.pop();

    let img = document.createElement("img");
    img.src = restore_state;
    img.onload = function () {

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.drawImage(img, 0, 0,);
      socket.emit('StateEmit',{restore_state});
    }
  },
  redu: function (canvas, clk) {

    this.restoreStateRedu(canvas, clk);
  }
}

function getSelector(select) {
  tool = select;
 // console.log(tool)
  if (tool == "pen" || tool=="rect" || tool=="line") { 
    subMenuOpen();
    document.getElementById("fontSizeContainer").style.display="none";
    document.getElementById("color").style.display="inline-block";
    document.getElementById("thickness").style.display="inline-block";
  
  
  }
  if(tool=="text"){ textState=1; subMenuOpen()
    
    document.getElementById("color").style.display="none";
    document.getElementById("thickness").style.display="none";
    document.getElementById("fontSizeContainer").style.display="inline-block";
    // document.getElementById("fontSize2").style.display="block";
  
  }else if(tool=="rect"){
   // document.getElementsByName(canvas).style.cursor = "pointer";
  }
  

}
function setPenColor(value) {
  penColor = value;
}


function undo() {
  history.undo(canvas, ctx);
}
function redo() {
  history.redu(canvas, ctx);
}


function impInp(input) {
 
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    console.warn(reader);
    reader.onload = function (e) {
      console.log(e.target.result);

      imgImp.src = e.target.result;
      imgImp.onload = function () {
        console.log("x and y is ", currentX, currentY);

       // ctx.drawImage(imgImp, currentX, currentY, imgImp.width / 2, imgImp.height / 2);
       iw=(imgImp.width / 2);
       ih=(imgImp.height / 2)
        images.push({img:e.target.result,x:currentX,y:currentY,width:iw,height:ih});
       
        console.log(images);
        //ctx.drawImage(imgImp, currentX, currentY ,iw,ih);
        drowImage();
      }
    
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function drowImage(){
  // ctx.clearRect(0, 0 ,canvas.width,canvas.height);
  for(let i of images){
    
  let x= document.createElement('img');
  x.src=i.img;
 
    ctx.drawImage(x, i.x, i.y ,i.width,i.height);
  }
}
function getURL(){
  return window.location.href;
}
function Draw() {
  document.getElementById("link-shr").value=getURL();
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth + 800;
  canvas.height = window.innerHeight + 2500;
  currentX = canvas.width / 2;
  currentY = canvas.height / 2
  console.log(canvas.height)
  let x, y;
  if (canvas.getContext) {
    ctx = canvas.getContext("2d");


    ctx.lineCap = "round";
    let mouseDown = false;
     socket = io();

     socket.on("StateDraw",({restore_state})=>{
      let img= document.createElement("img");
      img.src=restore_state;
      img.onload = function () {
        ctx.fillStyle="#f2f2f2";
        ctx.fillRect(0,0,canvas.width,canvas.height);
       ctx.drawImage(img, 0, 0,);
      
       console.log("statedraw",img);
      }
     
    })
    window.onmousedown = (e) => {
      socket.emit('down', { x, y });

      mouseDown = true;
    }
    canvas.onmouseout=(e)=>{
     
    }
    canvas.onmouseup = (e) => {
      console.log("d");
      if(tool=="curser"){
        if(!draggable){
          return;
        }
        let trackImg=[];
        if(draggable){
          let mouseX=parseInt(e.layerX);
          let mouseY=parseInt(e.layerY);
          let dx=mouseX-startX;
          let dy=mouseY-startY; 
          ctx.clearRect(dx,dy, images[current_img_index].width, images[current_img_index].y);
          //let curr_img=;
          ctx.clearRect(images[current_img_index].x,  images[current_img_index].y , images[current_img_index].width, images[current_img_index].height);
          images[current_img_index].x+=dx;
          images[current_img_index].y+=dy;
          
          drowImage();
          startX=mouseX;
          startY=mouseY;
          
        console.log("cursor moving");
        }
        if(draggable){
          draggable=false;
        }
        console.log("img draw")
      }
      if(tool== "text" && textState==1){
        console.log("text");
        // ctx.font = '48px serif';
        // ctx.fillText('Namaste World', e.layerX, e.layerY);
        document.getElementById("textarea").style.display="inline-block";
        xa=e.layerX;
        ox="px";
        xb= xa+ox;
        ya=e.layerY;
        yb= ya+ox;
        let fs= document.getElementById("fontSize").value;
        document.getElementById("textarea").style.fontSize=fs+"px";
        document.getElementById("textarea").style.marginTop=yb;
        document.getElementById("textarea").style.marginLeft=xb;
        console.log(e.layerX,xa);
        textState=2;
        
      }else if(tool== "text" && textState==2){
        let text= document.getElementById("textarea").value;
        document.getElementById("textarea").style.display="none";
        let fs= document.getElementById("fontSize").value;
        
        fs=fs+"px serif";
        console.log(fs)
        ctx.font =fs;
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
       ctx.fillText(text,xa,ya);
       socket.emit('TextEmit',({fs,text,xa,ya}));
        console.log(text,xa,ya);
       document.getElementById("textarea").value="";
        textState=1;
      }else if(textState==3){
        // document.getElementById("textarea").value="";
        // textState=1;
      }else if(tool=="rect" && rectFlag==true){
        ctxrec = canvas.getContext("2d");
        
     
        rectXb=e.layerX;
        rectYb=e.layerY;
    
        ctxrec.beginPath();
        penColor=document.getElementById("color").value;
        penWidth=document.getElementById("thickness").value / 10;
      console.log(penColor,penWidth)
        ctxrec.strokeStyle=penColor;
        ctxrec.lineWidth = penWidth;
         ctxrec.rect(rectXa, rectYa, rectXb-rectXa, rectYb-rectYa);
        rectXb=rectXb-rectXa;
        rectYb=rectYb-rectYa;
        ctxrec.stroke();
        socket.emit('rectEmit', { rectXa, rectYa,rectXb,rectYb,penWidth,penColor});
        console.log("hii i am rectangle",rectXb,rectYb,rectFlag);
        rectFlag=false;
      }else if(tool=="line"){
        penColor=document.getElementById("color").value;
        penWidth=document.getElementById("thickness").value / 10;
      console.log(penColor,penWidth)
        ctx.strokeStyle=penColor;
        ctx.lineWidth = penWidth;
        ctx.lineTo(e.layerX,e.layerY);
         lineXb=e.layerX;
         lineYb=e.layerY;
        ctx.stroke();
        socket.emit('lineEmit',{lineXa,lineYa,lineXb,lineYb,penWidth,penColor});
        console.log("line up");
      }
      history.saveState(canvas);
    //  console.log("save");
    }

    function is_mouse_in_img(x,y,i){
    
        let img_left=i.x;
        let img_right= i.x+i.width;
        let img_top=i.y;
        let img_bottom= i.y+i.height;
        console.log(x,y,img_left,img_right,img_top,img_bottom);
        if(x>img_left && x<img_right && y>img_top && y<img_bottom  ){
          return true;
        }
        return false;
    }
    canvas.onmousedown=(e)=>{
      document.getElementById("sub-menu").style.display="none";
      if(tool=="rect"){
        rectXa=e.layerX;
        rectYa=e.layerY;
        rectXb=0;
        rectYb=0;
        rectFlag=true;
      }else if(tool=="line"){
        ctx.moveTo(e.layerX,e.layerY);
        lineXa=e.layerX;
        lineYa=e.layerY;
        console.log("line down");
      }else if(tool=="curser"){
       
        index=0;
         startX= parseInt(e.layerX);
         startY=parseInt(e.layerY);
        for(let i of images){
          if(is_mouse_in_img(startX,startY,i)){
            console.log("yes")
            draggable=true;
            document.body.style.cursor ="all-scroll";
            current_img_index=index;
            return 
          }
           
            index++;
        }
      }
    }
    window.onmouseup = (e) => {

      socket.emit('draw', { x, y,tool,penColor,penWidth});

      mouseDown = false;
    }
    // Realtime Event
  
    socket.on("rectDraw",({x1,y1,x2,y2,width,color})=>{
      ctx.beginPath();
      ctx.lineWidth = width;
ctx.strokeStyle = color;
      ctx.rect(x1, y1, x2, y2);
      ctx.stroke();
      console.log("rect draw",x1,y1,x2,y2);
    })
    socket.on('lineDraw',({x1,y1,x2,y2,width,color})=>{
      ctx.beginPath();
      context.strokeStyle = color;
      context.lineWidth =width;
ctx.moveTo(x1, y1);
ctx.lineTo(x2, y2);
ctx.stroke();
console.log("line draw",xa,y1,x2,y2)
    });

    socket.on('TextDraw',({fs,xa,ya,text})=>{
      ctx.font = fs;
      ctx.fillText(text, xa, ya);
      console.log("text Draw",fs,xa,ya,text);
    })
    socket.on("ondraw", ({ x, y,tool,pencolor,penwidth}) => {
     switch(tool){
     case "pen":
      ctx.strokeStyle=pencolor;
      ctx.lineWidth = penwidth;
      ctx.lineTo(x, y);
      ctx.stroke();
     
      break;
    case "eraser":
        ctx.strokeStyle ='#F2F2F2';
        ctx.lineWidth = 50;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineTo(x, y);
        ctx.stroke();
        console.log(tool,pencolor,penwidth);
        break;
    case "marker":
          ctx.strokeStyle = "yellow";
          ctx.globalCompositeOperation = "multiply";
          ctx.lineWidth = 15;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineTo(x, y);
          ctx.stroke();
          break;
    default:
      return;
      
      //ctx.moveTo(x,y)
     }
    })

    socket.on("ondown", ({ x, y}) => {
     console.log("break");
      ctx.moveTo(x, y)

    })
   
    canvas.onmousemove = (event) => {
      if(tool=="rect" && rectFlag==true){
       
      
      }else
      if (tool == "curser") {
        // if(!draggable){
        //   return;
        // }
        // let trackImg=[];
        // if(draggable){
        //   let mouseX=parseInt(event.layerX);
        //   let mouseY=parseInt(event.layerY);
        //   let dx=mouseX-startX;
        //   let dy=mouseY-startY; 
        //   ctx.clearRect(dx,dy, images[current_img_index].width, images[current_img_index].y);
        //   //let curr_img=;
        //   images[current_img_index].x+=dx;
        //   images[current_img_index].y+=dy;
        //   drowImage();
        //   startX=mouseX;
        //   startY=mouseY;
          
        // console.log("cursor moving");
        // }

      } else {
        x = event.layerX;
        y = event.layerY;

        if (mouseDown) {

          socket.emit('draw', { x, y,tool,penColor,penWidth});
          document.body.style.cursor = "pointer";
          if (tool == "eraser") {
            ctx.strokeStyle ='#F2F2F2';
            ctx.lineWidth = erasorWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineTo(x, y);

            ctx.stroke();
          } else if (tool == "pen") {
            penColor=document.getElementById("color").value;
            ctx.strokeStyle =penColor;
            penWidth=document.getElementById("thickness").value / 10;
            if(penWidth==0) penWidth=1;
            ctx.lineWidth = penWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineTo(x, y);

            ctx.stroke();
          } else if (tool == "marker") {
            ctx.strokeStyle = "yellow";
            ctx.globalCompositeOperation = "multiply";
            ctx.lineWidth = 15;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineTo(x, y);

            ctx.stroke();
          }else {
          }

        } else {

          document.body.style.cursor = "default";
          ctx.moveTo(x, y)

          console.log("done");
          ctx.beginPath();

        }
      }



    }


  } else {

  }


}


//downalod
function downloadCanvasAsImage(){

  let canvasImage = document.getElementById('canvas').toDataURL('image/png');

  let xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function () {
      let a = document.createElement('a');
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = 'image_name.png';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    xhr.open('GET', canvasImage); // This is to download the canvas Image
    xhr.send();
}