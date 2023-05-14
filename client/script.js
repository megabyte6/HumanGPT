//Websocekt variables
const mywsServer = new WebSocket("ws://localhost:8080")
const submitButton = document.getElementById("submitNameButton");

const askButton = document.getElementById("submitGPTButton");


submitButton.onclick = ()=>{
    let msg = {
        operation: "init",
        arguments: {
            "name": document.getElementById("name").value
        }
        
    }
    console.log(JSON.stringify(msg))
    mywsServer.send(JSON.stringify(msg))
}
askButton.onclick = ()=>{
    let msg = {
        operation: "getgpt",
        arguments: {
            "prompt": document.getElementById("gptask").value
        }
        
    }
    console.log(JSON.stringify(msg))
    mywsServer.send(JSON.stringify(msg))
}
//DOM Elements
/*const myCanvas = document.getElementById("myCanvas")
const ctx = myCanvas.getContext("2d");
let mouseDown = 0;
let pageX = 0;
let pageY = 0;
document.body.onmousedown = function(evt) { 
    ++mouseDown;
    pageX = event.pageX
    pageY = event.pageY
  }
  document.body.onmouseup = function(evt) {
    --mouseDown;
    pageX = event.pageX
    pageY = event.pageY
}
document.onmousemove = function(evt){
    pageX = event.pageX
    pageY = event.pageY

}
function tick(){
    var x = pageX - myCanvas.getBoundingClientRect().left,
        y = pageY - myCanvas.getBoundingClientRect().top;
    if(mouseDown){
        drawOn(x,y);
        sendloc(x,y);
    }
    setTimeout(tick, 5);
}
tick();



function drawOn(x,y){
    ctx.beginPath();
    ctx.arc(x,y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "#000000"
    ctx.fill();
    
}


//Sending message from client
function sendloc(x,y) {
    const text = x + "," + y;
    
    mywsServer.send(text)
}

//Creating DOM element to show received messages on browser page
function addtoGrid(msg) {
    const x = msg.split(",")[0];
    const y = msg.split(",")[1];
    drawOn(x,y);

}

//enabling send message when connection is open
mywsServer.onopen = function() {
    console.log("open")
}*/
//handling message event
mywsServer.onmessage = function(event) {
    const { data } = event;
    document.getElementById("response").textContent = data;
    
    addtoGrid(data);
}