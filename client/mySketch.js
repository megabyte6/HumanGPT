let stage = 0;
let name = "";
let prompt = "";
let inp;
let newPrompt = "";
let writing = [];
let msg;
let server;
let players = [];
let words = [];
let fontt;

server = new WebSocket(`ws://${window.location.host}`);

function setup() {
  if (500 * (windowHeight / 300) < windowWidth) {
    wh = 500 * (windowHeight / 300);
    ht = windowHeight;
  } else {
    wh = windowWidth;
    ht = 300 * (windowWidth / 500);
  }
	cnv = createCanvas(wh, ht);
  centerCanvas();
  strokeJoin(ROUND);
  textFont(fontt);
  textAlign(CENTER, CENTER);
  startButton = createSprite(250, 200, 100, 35);
  startButton.draw = () => {
    fill(50, 168, 109);
    stroke(37, 122, 80);
    strokeWeight(4);
    rect(0, 0, startButton.width, startButton.height, 5, 5);
    noStroke();
    fill(0);
    text("Start", 0, 3);
    if (startButton.mouse.pressed()) {
      stage = 1;
      startText();
      startButton.remove();
    }
  };
}

function preload() {
	fontt = loadFont("UbuntuMono-Bold.ttf");
}

function startText() {
  inp = createInput("");
  inp.position(windowWidth / 2 - 150, windowHeight / 2 - 20);
  inp.size(300, 40);
  inp.input(myInputEvent);
}

function centerCanvas() {
  let cx = (windowWidth - width) / 2;
  let cy = (windowHeight - height) / 2;
  cnv.position(cx, cy);
}

function mousePressed() {
	//if (stage == 2) startGame();
	//if (stage == 4) getData("ways to say hello", "hello hi hey");
}

function myInputEvent() {
	if (stage == 1) {
		name = this.value();
	} else if (stage == 3) {
		prompt = this.value();
	}
}

function draw() {
  background(15, 27, 21);
  camera.x = 250;
  camera.y = 150;
  camera.zoom = wh / 500;
  push();
  scale(wh / 500);
  if (stage == 1) {
    noStroke();
    fill(50, 168, 109);
    text("Enter Name", 250, 125);
  }
	if (stage == 3) {
    noStroke();
    fill(50, 168, 109);
    text("Enter A Chat Gpt Prompt", 250, 125);
  }
	if (stage == 2) {
    noStroke();
    fill(50, 168, 109);
    text("Waiting for other players to join...", 250, 150);
		for (let i = 0; i < players.length; i++) {
			text(players[i], 250, 175 + i*20);
		}
  }
	if (stage == 4) {
    noStroke();
    fill(50, 168, 109);
    text("Waiting for all players to answer...", 250, 150);
  }
	if (stage == 5) {
    noStroke();
    fill(50, 168, 109);
    text(newPrompt, 250, 40);
  }
  pop();
}

function keyPressed() {
	if (stage == 1) {
		if (keyCode == ENTER) {
			stage = 2;
			inp.size(0, 0);
			inp.position(-1000, -1000);
			msg = {
				operation: "init",
				arguments: {
					"name": name
				}
			}
			server.send(JSON.stringify(msg));
		}
	} else if (stage == 3) {
		if (keyCode == ENTER) {
			stage = 4;
			inp.size(0, 0);
			inp.position(-1000, -1000);
			msg = {
				operation: "submit_prompt",
				arguments: {
					"prompt": prompt
				}
			}
			server.send(JSON.stringify(msg));
		}
	}
}

server.onmessage = function(event) {
	const { data } = event;
	let message = JSON.parse(data);
	if (message.operation == "players_update") {
		players = message.arguments.players;
	}
	if (message.operation == "start_game") {
		startGame();
	}
	if (message.operation == "new_prompt") {
		getData(message.arguments.prompt,message.arguments.response);
	}
}

function startGame() {
	stage = 3;
	inp.size(500, 100);
	inp.position(windowWidth / 2 - 250, windowHeight / 2 - 20);
	inp.value(" ");
}

function getData(p, t) {
	newPrompt = p;
	writing = t.split(" ");
	stage = 5;
	count = 0;
	line = 0;
	for (let i = 0; i < writing.length; i++) {
		words.push(new Word(writing[i], 50 + count + writing[i].length*3, 100 + line*15));
		count += words[i].sprite.width;
		if (words[i].sprite.x > 450) {
			line++;
			count = 0;
		}
	}
}

class Word {
	constructor(t, x, y) {
		this.sprite = createSprite(x, y, t.length*4, 10, "kinematic");
		this.sprite.draw = () => {
			fill(255);
			rect(0, 0, this.sprite.width, this.sprite.height);
			fill(0);
			textSize(8);
			text(t, 0, 1);
			if (this.sprite.mouse.pressing()) {
				this.sprite.x = mouse.x;
				this.sprite.y = mouse.y;
			}
		}
	}
}
