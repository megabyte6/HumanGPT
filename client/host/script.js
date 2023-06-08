let stage = 0;
let players = [];

server = new WebSocket(`ws://${window.location.host}`);

server.onopen = function(event){
    let msg = {
        operation: "init_host",
        arguments: {
            "name": "bleh"
        }  
    }
    server.send(JSON.stringify(msg));
}

function setup() {
	if(500 * (windowHeight / 300) < windowWidth) {
		wh = 500 * (windowHeight / 300);
		ht = windowHeight;
	} else {
		wh = windowWidth;
		ht = 300 * (windowWidth / 500);
	}
	cnv = createCanvas(wh, ht);
	centerCanvas();
	strokeJoin(ROUND);
	if(window.location.host != "preview.openprocessing.org") {
		textFont(fontt);
	}
	textAlign(CENTER, CENTER);
	startButton = createSprite(250, 250, 100, 30);
	startButton.draw = () => {
		fill(50, 168, 109);
		stroke(37, 122, 80);
		strokeWeight(4);
		rect(0, 0, startButton.width, startButton.height, 5, 5);
		noStroke();
		fill(0);
		text("Start Game", 0, 0);
		if(startButton.mouse.pressed()) {
			stage = 1;
			startGame();
			startButton.remove();
		}
	}
}

function startGame() {
	let msg = {
  	operation: "trigger_start",
    arguments: {
    }      
  }
}

function preload() {
	if(window.location.host != "preview.openprocessing.org") {
		fontt = loadFont("UbuntuMono-Bold.ttf");
	}
}

function centerCanvas() {
	let cx = (windowWidth - width) / 2;
	let cy = (windowHeight - height) / 2;
	cnv.position(cx, cy);
}

function draw() {
	background(15, 27, 21);
	camera.x = 250;
	camera.y = 150;
	camera.zoom = wh / 500;
	push();
	scale(wh / 500);
	if(stage == 0) {
		noStroke();
		fill(50, 168, 109);
		textSize(30);
		text("Players:", 250, 75);
		textSize(15);
		let count = 0;
		for (let player of players) {
			text(player, 250, 100 + count*20);
			count++;
		}
	}
	if (stage == 1) {
		fill(50, 168, 109);
		textSize(20);
		text("Follow the instructions on your screens.", 250, 150);
	}
	pop();
}

function mousePressed() {
	if(window.location.host == "preview.openprocessing.org") {
		
	}
}

function keyPressed() {
	
}

server.onmessage = function(event) {
	const {data} = event;
	let message = JSON.parse(data);
	if(message.operation == "players_update") {
		players = message.arguments.players;
	}
}
