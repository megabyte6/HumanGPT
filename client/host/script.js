
const mywsServer = new WebSocket(`ws://${window.location.host}`)

mywsServer.onopen = function(event){
    let msg = {
        operation: "init_host",
        arguments: {
            "name": "bleh"
        }
        
    }
    
    console.log(JSON.stringify(msg))
    mywsServer.send(JSON.stringify(msg))
    
    
}

mywsServer.onmessage = function(event) {
    
    const { data } = event;
    let message = JSON.parse(data);
    if(message.operation == "players_update"){
        document.querySelector('ul').innerHTML=''
        message.arguments.players.forEach(element => {
            var node = document.createElement('li');
            node.appendChild(document.createTextNode(element));
            node.setAttribute("name",element)
            document.querySelector('ul').appendChild(node);
        });
        
    }
    
    
    
    //addtoGrid(data);
}

document.getElementById("startbutton").onclick = function(event) {
    let msg = {
        operation: "trigger_start",
        arguments: {
        }
        
    }
    
    console.log(JSON.stringify(msg))
    mywsServer.send(JSON.stringify(msg))
}

