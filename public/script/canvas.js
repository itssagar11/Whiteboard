// globle Variables
let workState = 0;
let canvas;
let tool = "pen";
let penColor = "Black";
let penWidth = 1;
let erasorWidth = 20;
let currentX = 0;
let currentY = 0;
let img
let draggable = false;
let imgImp = document.createElement("img");
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
      }
      this.redo_list.push(canvas.toDataURL());
      let restore_state = this.undo_list[(this.undo_list.length) - 2];
      this.undo_list.pop();

      img = document.createElement("img");
      img.src = restore_state;

      img.onload = function () {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.drawImage(img, 0, 0,);
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
    }
  },
  redu: function (canvas, clk) {

    this.restoreStateRedu(canvas, clk);
  }
}

function getSelector(select) {
  tool = select;
  if (tool == "pen") { PenMenuOpen() }

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

    reader.onload = function (e) {
      console.log(e.target.result);

      imgImp.src = e.target.result;
      imgImp.onload = function () {
        console.log("x and y is ", currentX, currentY);

        ctx.drawImage(imgImp, currentX, currentY, imgImp.width / 2, imgImp.height / 2);

      }
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function Draw() {
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth + 500;
  canvas.height = window.innerHeight + 200;
  currentX = canvas.width / 2;
  currentY = canvas.height / 2
  console.log(canvas.height)
  let x, y;
  if (canvas.getContext) {
    ctx = canvas.getContext("2d");


    ctx.lineCap = "round";
    let mouseDown = false;
    let socket = io();
    window.onmousedown = (e) => {
      socket.emit('down', { x, y });

      mouseDown = true;
    }

    canvas.onmouseup = (e) => {

      history.saveState(canvas);
      console.log("save");
    }
    window.onmouseup = (e) => {

      socket.emit('draw', { x, y });

      mouseDown = false;
    }
    socket.on("ondraw", ({ x, y }) => {
      ctx.lineTo(x, y);
      ctx.stroke();
      //ctx.moveTo(x,y)

    })

    socket.on("ondown", ({ x, y }) => {

      ctx.moveTo(x, y)

    })
    canvas.onmousemove = (event) => {

      if (tool == "curser") {
        // if(draggable){
        //   currentX=event.layerX;
        // currentY=event.layerY;

        // console.log("cursor moving");
        // }

      } else {
        x = event.layerX;
        y = event.layerY;

        if (mouseDown) {

          socket.emit('draw', { x, y });
          document.body.style.cursor = "pointer";
          if (tool == "eraser") {
            ctx.strokeStyle = '#F2F2F2';
            ctx.lineWidth = erasorWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineTo(x, y);

            ctx.stroke();
          } else if (tool == "pen") {
            ctx.strokeStyle = document.getElementById("color").value;
            ctx.lineWidth = document.getElementById("thickness").value / 10;
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
          }

          // push();
          // push();

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
