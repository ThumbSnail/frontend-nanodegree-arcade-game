//Input constants:
var ALLOWED_KEYS = {
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down',
	67: 'c'  //to switch player sprite
};

//Tile-Grid Dimension constants:
var COL_WIDTH = 101;  //px
var ROW_HEIGHT = 83;  //px
var MAX_COL_INDEX = 4;	// 0 1 2 3 4
var MAX_ROW_INDEX = 5;	// 1
						// 2
						// 3
						// 4
						// 5

//Player Sprite constants:  (weird because so much transparency is saved in the image):
var PLAYER_Y_OFFSET = -13;  //to center the player on a tile, shove up by this many px


//Enemy Speed Range:
var MAX_SPEED = 3;
var MIN_SPEED = 1;


// Enemies our player must avoid
var Enemy = function() {
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started

	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
	this.sprite = 'images/enemy-bug.png';
	this.speed = Math.floor(Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED); //Maybe Math.random() val?
		//^Math.floor because Math.random returns a decimal between 0 and 1
	this.spawn(); //should probably just pick a row and then be one col off left
	//maybe the gems == could switch the direction the bugs run?
	  //could you even make the game switch and have the bugs run down the column?
};

Enemy.prototype.spawn = function() {
	//83 = the tile height  ...but why do the graphics have so much extra transparency?  That's gonna complicate all the positioning...
	//101 = the tile width
	this.x = -101; //0 - image width (101, unless there's a way to grab this property)
	this.y = Math.floor(Math.random() * (3 - 1) + 1) * 83;//random row between 1 and 3 (0 is water, the rest is safe grass)  //IDEA:  maybe you could mix up the map upon restart?  like stone, grass, stone for the rows?

};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.

	//screen has 5 cols (0 - 4), 505px to work with.  So a set minimum speed for all might be 10px per update?
	//and then enemies can have their own speed value of 1 thru 3, so the fastest ones move 30px per update
	this.x += this.speed * 10 * dt;

	//bounds:  once fully exits screen right == send back to left side of screen, but randomly switch rows.
	if (this.x > (505 + 101)) {
		this.x = -101;
	}

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
	this.sprite = 'images/char-boy.png';
	this.col = 2;  //x
	this.row = 5;  //y
};


Player.prototype.update = function(dt) {

};

//Draw the player on the screen.
//Converts from tile position to x,y position
Player.prototype.render = function() {
	var x = this.col * COL_WIDTH;
	var y = this.row * ROW_HEIGHT + PLAYER_Y_OFFSET;

	ctx.drawImage(Resources.get(this.sprite), x, y);
};

//Using the arrow keys, move Player 1 tile from current position
//Also prevents player from moving off the game screen
//The 'c' key is used to swap character sprites
Player.prototype.handleInput = function(key) {
	switch(key) {
		case 'left':
			this.col > 0 ? this.col-- : this.col = 0;
			break;
		case 'right':
			this.col < MAX_COL_INDEX ? this.col++ : this.col = MAX_COL_INDEX;
			break;
		case 'up':
			this.row > 0 ? this.row-- : this.row = 0;
			break;
		case 'down':
			this.row < MAX_ROW_INDEX ? this.row++ : this.row = MAX_ROW_INDEX;
			break;
	}
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var MAX_ENEMIES = 10;
var allEnemies = [];
for (var i = 0; i < MAX_ENEMIES; i++) {
	allEnemies.push(new Enemy());
}
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.  (Well, I did!)
document.addEventListener('keyup', function(event) {
	player.handleInput(ALLOWED_KEYS[event.keyCode]);
});

//This function stops keypresses from scrolling the page:
document.addEventListener('keydown', function(event) {
	for (var prop in ALLOWED_KEYS) {
		if (event.keyCode === parseInt(prop)) {
			event.preventDefault();
		}
	}
});
