
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
    if(message.operation == "player_join"){
        var node = document.createElement('li');
        node.appendChild(document.createTextNode(message.arguments["name"]));
        node.setAttribute("name",message.arguments["name"])
        document.querySelector('ul').appendChild(node);
    }
    if(message.operation == "player_leave"){
        var node = document.getElementsByName(message.arguments["name"])[0];
        document.querySelector('ul').removeChild(node);

    }
    
    
    
    //addtoGrid(data);
}