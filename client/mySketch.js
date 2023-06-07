let stage = 0;
let name = "";
let prompt = "";
let nameInput;
let newPrompt = "";
let writing = [];
let finishedWords;
let msg;
let server;
let players = [];
let fontt;
let words;
let t = [];

server = new WebSocket(`ws://${window.location.host}`);

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
	startButton = createSprite(250, 200, 100, 35);
	startButton.draw = () => {
		fill(50, 168, 109);
		stroke(37, 122, 80);
		strokeWeight(4);
		rect(0, 0, startButton.width, startButton.height, 5, 5);
		noStroke();
		fill(0);
		text("Start", 0, 0);
		if(startButton.mouse.pressed()) {
			stage = 1;
			startText();
			startButton.remove();
		}
	};
}

function preload() {
	if(window.location.host != "preview.openprocessing.org") {
		fontt = loadFont("UbuntuMono-Bold.ttf");
	}
}

function startText() {
	nameInput = createInput("");
	nameInput.position(windowWidth / 2 - 150, windowHeight / 2 - 20);
	nameInput.size(300, 40);
	nameInput.input(myInputEvent);
}

function centerCanvas() {
	let cx = (windowWidth - width) / 2;
	let cy = (windowHeight - height) / 2;
	cnv.position(cx, cy);
}

function myInputEvent() {
	if(stage == 1) {
		name = this.value();
	} else if(stage == 3) {
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
	if(stage == 1) {
		noStroke();
		fill(50, 168, 109);
		text("Enter Name", 250, 125);
	}
	if(stage == 3) {
		noStroke();
		fill(50, 168, 109);
		text("Enter A Chat Gpt Prompt", 250, 125);
	}
	if(stage == 2) {
		noStroke();
		fill(50, 168, 109);
		text("Waiting for other players to join...", 250, 150);
		for(let i = 0; i < players.length; i++) {
			text(players[i], 250, 175 + i * 20);
		}
	}
	if(stage == 4) {
		noStroke();
		fill(50, 168, 109);
		text("Waiting for all players to answer...", 250, 150);
	}
	if(stage == 5) {
		noStroke();
		fill(50, 168, 109);
		text(newPrompt, 250, 40);
		rectMode(CENTER);
		fill(25, 84, 54);
		rect(250, 150, 300, 150);
		words.tick();
		finishedWords.tick();
	}
	if(stage == 6) {
		//voting
	}
	if (stage == 7) {
		noStroke();
		fill(50, 168, 109);
		text("Waiting for all players to vote...", 250, 150);
	}
	if (stage = 8) {
		//show results
	}
	pop();
}

function showResults() {
	stage = 8;
}

class VotingButton {
	constructor(x, y, w, h, c) {
		this.sprite = createSprite(x, y, w, h);
		this.sprite.draw = () => {
			fill(50, 168, 109);
			stroke(37, 122, 80);
			strokeWeight(8);
			rect(0, 0, this.sprite.width, this.sprite.height);
			fill(15, 27, 21);
			textSize(30);
			strokeWeight(4);
			text(c, 0, 0);
			if (this.sprite.mouse.pressed()) {
				msg = {
					operation: "submit_vote",
					arguments: {
					"vote": c
					}
				}
				server.send(JSON.stringify(msg));
				stage = 7;
				endVoting();
			}
		}
	}
}

function mousePressed() {
	if(window.location.host == "preview.openprocessing.org") {
		if(stage == 2) startGame();
		if(stage == 4)
			getData("ways to say hello", "hello hi hey")
		else
			if(stage == 5) startVoting();
	}
}

function keyPressed() {
	if(stage == 1) {
		if(keyCode == ENTER) {
			stage = 2;
			nameInput.size(0, 0);
			nameInput.position(-1000, -1000);
			msg = {
				operation: "init",
				arguments: {
					"name": name
				}
			}
			server.send(JSON.stringify(msg));
		}
	} else if(stage == 3) {
		if(keyCode == ENTER) {
			stage = 4;
			nameInput.size(0, 0);
			nameInput.position(-1000, -1000);
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
	const {data} = event;
	let message = JSON.parse(data);
	if(message.operation == "players_update") {
		players = message.arguments.players;
	}
	if(message.operation == "start_game") {
		startGame();
	}
	if(message.operation == "new_prompt") {
		getData(message.arguments.prompt, message.arguments.response);
	}
	if(message.operation == "start_voting") {
		startVoting(message.arguments.number);
	}
	if(message.operation == "end_voting") {
		endVoting();
		showResults();
	}
}

function startGame() {
	stage = 3;
	nameInput.size(500, 100);
	nameInput.position(windowWidth / 2 - 250, windowHeight / 2 - 20);
	nameInput.value(" ");
}

function endVoting() {
	allSprites.remove();
	let buttons = [];
}

function startVoting(n) {
	allSprites.remove();
	stage = 6;
	let buttons = [];
	if (n > 0) buttons.push(new VotingButton(500/4, 300/4 + 3.75, (500/4)-30, 150-30, 1));
	if (n > 1) buttons.push(new VotingButton(500/4, (300/4)*3 - 3.75, (500/4)-30, 150-30, 2));
	if (n > 2) buttons.push(new VotingButton((500/4)*2, 300/4 + 3.75, (500/4)-30, 150-30, 3));
	if (n > 3) buttons.push(new VotingButton((500/4)*2, (300/4)*3 - 3.75, (500/4)-30, 150-30, 4));
	if (n > 4) buttons.push(new VotingButton((500/4)*3, 300/4 + 3.75, (500/4)-30, 150-30, 5));
	if (n > 5) buttons.push(new VotingButton((500/4)*3, (300/4)*3 - 3.75, (500/4)-30, 150-30, 6));
}

function getData(p, t) {
	newPrompt = p;
	writing = t.split(" ");
	stage = 5;

	words = new WordList(50,450,250)
	
	writing.forEach((word)=>{
		words.list.push(new Word(word));
	})
	words.updateSmooth();
	words.list.forEach((word)=>word.solidifyLocation())
	

	finishedWords = new WordList(100,400,75)

	let submitButton = createSprite(450, 150, 80, 35, "kinematic");
	submitButton.draw = () => {
		fill(50, 168, 109);
		stroke(37, 122, 80);
		strokeWeight(4);
		rect(0, 0, submitButton.width, submitButton.height, 5, 5);
		noStroke();
		fill(0);
		text("Submit", 0, 0);
		if(submitButton.mouse.pressed()) {
			stage = 6;
			msg = {
				operation: "submit_response",
				arguments: {
					"response": finishedWords.list.map((word)=>word.word).join(" ")
				}
			}
			finishedWords.list.forEach((word)=>word.sprite.remove());
			finishedWords.list = null;
			finishedWords = null;
			words.list.forEach((word)=>word.sprite.remove());
			words.list = null;
			words = null;
			server.send(JSON.stringify(msg));
			submitButton.remove();
		}
	};

	let shuffleButton = createSprite(50, 150, 80, 35, "kinematic");
	shuffleButton.draw = () => {
		fill(50, 168, 109);
		stroke(37, 122, 80);
		strokeWeight(4);
		rect(0, 0, shuffleButton.width, shuffleButton.height, 5, 5);
		noStroke();
		fill(0);
		text("Shuffle", 0, 0);
		if(stage == 6) shuffleButton.remove();
		if(shuffleButton.mouse.pressed()) {
			
			words.list = shuffle(words.list)
			words.updateSmooth();
			
		}
	};
	
	

}

class Word {
	constructor(word) {
		this.sprite = createSprite(0,0,this.getWidthFromWord(word) + 4, 10, "kinematic");
		this.word = word
		this.dragtick = 0;
		this.sprite.draw = () => {
			fill(255);
			rect(0, 0, this.sprite.width, this.sprite.height);
			fill(0);
			textSize(8);
			text(this.word, 0, -0.5);
			if(this.sprite.mouse.pressing()) {
				this.dragtick++
				this.sprite.x = mouse.x;
				this.sprite.y = mouse.y;
				if(!this.dragged){
					
					
					//first time
					words.list = words.list.filter((word)=>{
						return word !== this
					});
					
					words.updateSmooth();
					words.list.forEach((word)=>word.solidifyLocation())

					finishedWords.list = finishedWords.list.filter((word)=>{
						return word !== this
					});
					
					finishedWords.updateSmooth();
					finishedWords.list.forEach((word)=>word.solidifyLocation())
					

				}
				this.dragged = true;
				
				if(finishedWords.inbounds(this)){
					if(this.dragtick % 2 == 0){
						words.list = words.list.filter((word)=>word !== this);
				
						words.updateSmooth();
						finishedWords.checkPosOfWord(this)
					}

				}else{
					if(this.dragtick % 2 == 0){
						finishedWords.list = finishedWords.list.filter((word)=>word !== this);
						finishedWords.updateSmooth();
						words.checkPosOfWord(this)
					}
				}
				
				
			}else{
				this.dragged = false;
			}
		}
	}

	solidifyLocation(){
		this.setPermanent(this.sprite.destx,this.sprite.desty);
		

	}

	setPermanent(x,y){
		this.origx = x;
		this.origy = y;
	}

	getWidthFromWord(word){
		return Math.floor(word.length * 4)
	}

	
}

function mouseReleased() {
	if(stage == 5){
		words.list = words.list.filter((word)=> !finishedWords.inbounds(word))
		words.list = words.list.filter((word)=>{
			if(word.dragged && word.dragtick < 20){
				finishedWords.list.push(word);
				word.dragged = false;
				word.dragtick = 0;
				return false;

			}
			return true;
		})
		finishedWords.list = finishedWords.list.filter((word)=>{
			if(word.dragged && word.dragtick < 20){
				words.list.push(word);
				word.dragged = false;
				word.dragtick = 0;
				return false;

			}
			return true;
		})
		finishedWords.updateSmooth();
		words.updateSmooth();
		words.list.forEach((word)=>{
			
			word.solidifyLocation();

		})
		finishedWords.list.forEach((word)=>{
			
			word.solidifyLocation();

		})

		finishedWords.updateSmooth();
		words.updateSmooth();

	}
}

function shuffle(array) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while(currentIndex != 0) {

		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]
		];
	}

	return array;
}

class WordList{

	list = [];

	constructor(xleft,xright,ytop){
		this.list = [];
		this.xleft = xleft
		this.xright = xright
		this.ytop = ytop;
	}

	updateWords(){
		let totalx = this.xleft;
		let totaly = this.ytop;
		this.list.forEach((word)=>{
			if(totalx + 1 + word.sprite.width + 1 > this.xright){
				totalx = this.xleft;
				totaly += 2 + word.sprite.height;
			}
			word.sprite.x = totalx + 1 + word.sprite.width / 2;
			word.sprite.y = totaly + word.sprite.height / 2;
			word.sprite.destx = word.sprite.x
			word.sprite.desty = word.sprite.y
			totalx += 1 + word.sprite.width + 1;
			
			

		})
		

	}

	updateSmooth(){
		let totalx = this.xleft;
		let totaly = this.ytop;
		this.list.forEach((word)=>{
			if(totalx + 1 + word.sprite.width + 1 > this.xright){
				totalx = this.xleft;
				totaly += 2 + word.sprite.height;
			}
			word.sprite.destx = totalx + 1 + word.sprite.width / 2;
			word.sprite.desty = totaly + word.sprite.height / 2;
			totalx += 1 + word.sprite.width + 1;
			
			

		})

	}

	tick(){
		this.list.forEach((word)=>{
			if(word.dragged){
				return;
			}
			
			word.sprite.x = (3 * word.sprite.x + word.sprite.destx)/4
			word.sprite.y = (3 * word.sprite.y + word.sprite.desty)/4

		})
	}

	checkPosOfWord(word){
		//remove word
		let ind = -1;
		this.list = this.list.filter((lword, index) => {
			if(lword === word) ind = index;
			return lword  !== word
		})

		this.list.push(new Word(""))
		this.updateSmooth();
		this.list[this.list.length-1].solidifyLocation();
		

		
		//find closest word
		
		let closestdist = Math.abs(word.origx - word.sprite.x) + 500 * Math.abs(word.origy - word.sprite.y) ;
		
			
		
		this.list.forEach((listword, index)=>{
			//y is weighted 500x
			let dist = Math.abs(listword.origx - word.sprite.x) + 500 * Math.abs(listword.origy - word.sprite.y) ;
			
			if(dist < closestdist){
				closestdist = dist;
				
				ind = index;
			}
		})

		
		this.list.splice(ind, 0, word);

		this.list.pop().sprite.remove();

		
		
		
		
		
		this.updateSmooth();
	}

	inbounds(word){
		return this.xleft <= word.sprite.x &&  this.xright >= word.sprite.x && this.ytop <= word.sprite.y && this.ytop + 150 >= word.sprite.y
	}

	

}
