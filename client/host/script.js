let stage = 0;
let players = [];
let prompts = [];
let responses = [];

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
	server.send(JSON.stringify(msg));
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
		let count = 1;
		for (let player of players) {
			if (count < 8) {
				text(player, 175, 100 + count*20);
			} else if (count < 15) {
				text(player, 250, 100 + count*20);
			} else {
				text(player, 325, 100 + count*20);
			}
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
		if (stage == 1) {
			prompts = ["hello", "hi", "hey"];
			responses = ["wehfiuew fewgfiqw diuqwiud d hiudiu hdiuwh dwuhd duwhd hfdfoiqewfefj  fojff jje", "qhd hfdfhiuwiehf fkn feojfejfqhfduehfhfdhiufh fid iuhfdiushfifdoif", "hewf heif iudiuf eh fid ufeduf hdufh ue fued fiuedfiehfiue hfi efheif heiuf h"];
			startVoting(3);
		}
	}
}

function endVoting() {
	allSprites.remove();
	let buttons = [];
}

class VotingButton {
	constructor(x, y, w, h, c) {
		this.sprite = createSprite(x, y, w, h);
		this.sprite.draw = () => {
			fill(50, 168, 109);
			stroke(37, 122, 80);
			strokeWeight(8);
			rect(0, 0, this.sprite.width, this.sprite.height);
			rect(0 - this.sprite.width/2 + 5, 0 - this.sprite.height/2 + 5, 25, 25);
			fill(15, 27, 21);
			textSize(30);
			strokeWeight(4);
			textWrap(WORD);
			noStroke();
			fill(0);
			textSize(10);
			text(c, 0 - this.sprite.width/2 + 5, 0 - this.sprite.height/2 + 5);
			text(prompts[c-1], 0, -30, 65, 65);
			textSize(7);
			text(responses[c-1], 0, 15, 65, 65);
		}
	}
}


function startVoting(n) {
	allSprites.remove();
	stage = 2;
	let buttons = [];
	if (n > 0) buttons.push(new VotingButton(500/4, 300/4 + 3.75, (500/4)-30, 150-30, 1));
	if (n > 1) buttons.push(new VotingButton(500/4, (300/4)*3 - 3.75, (500/4)-30, 150-30, 2));
	if (n > 2) buttons.push(new VotingButton((500/4)*2, 300/4 + 3.75, (500/4)-30, 150-30, 3));
	if (n > 3) buttons.push(new VotingButton((500/4)*2, (300/4)*3 - 3.75, (500/4)-30, 150-30, 4));
	if (n > 4) buttons.push(new VotingButton((500/4)*3, 300/4 + 3.75, (500/4)-30, 150-30, 5));
	if (n > 5) buttons.push(new VotingButton((500/4)*3, (300/4)*3 - 3.75, (500/4)-30, 150-30, 6));
}

function keyPressed() {
	
}

server.onmessage = function(event) {
	const {data} = event;
	let message = JSON.parse(data);
	if(message.operation == "players_update") {
		players = message.arguments.players;
	}
	if(message.operation == "start_voting") {
		prompts = message.arguments.prompts;
		responses = message.arguments.responses;
		startVoting(message.arguments.number);
	}
	if(message.operation == "end_voting") {
		
	}
}
