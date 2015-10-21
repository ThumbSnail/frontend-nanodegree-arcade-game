//Maybe all these consts should go in a global.js file or something?

//Input constants:
var ALLOWED_KEYS = {
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down',
	67: 'c'  //to switch player sprite
};

//Screen Dimension constants:
var SCREEN_WIDTH = 505;
var SCREEN_HEIGHT = 606;

//Tile-Grid Dimension constants:
var COL_WIDTH = 101;  //px
var ROW_HEIGHT = 83;  //px
var MAX_COL_INDEX = 4;	// 0 1 2 3 4
var MAX_ROW_INDEX = 5;	// 1
						// 2
						// 3
						// 4
						// 5

//Sprite constants:  (it's weird that so much transparency is saved in the graphics):
var PLAYER_Y_OFFSET = -13;  //to center the sprites on a tile, shove up by this many px

//Array of available character graphics for the player
var playerSprites = [
	'images/char-boy.png',
	'images/char-cat-girl.png',
	'images/char-horn-girl.png',
	'images/char-pink-girl.png',
	'images/char-princess-girl.png'
];

//Enemy constants:
var ENEMY_Y_OFFSET = -17; //px
var ENEMY_MIN_SPEED = 1;
var ENEMY_MAX_SPEED = 6;
var ENEMY_DEFAULT_SPEED = 20; //px

//row range in which enemies can spawn:
//Possible TODO: add more enemy rows once score reaches a certain point (in order to make game harder)
var enemyHighestRow = 1;
var enemyLowestRow = 3;


// Enemies our player must avoid
var Enemy = function() {
	this.sprite = 'images/enemy-bug.png';  //enemy image
	
	this.speed,	this.x, this.row;  //variables for speed and position
	
	this.spawn(SCREEN_WIDTH);  //set up the position variables
	this.setRandomSpeed();  //set up the speed;
};

//Sets the position x and row (y) of the enemy
Enemy.prototype.spawn = function(maxRange) {
	_spawnX.call(this, maxRange);;  //set x position of the enemy
	_spawnRow.call(this);  //set row (y) position of the enemy

	//Sets the x of the enemy
	//Takes a maxRange so that at the start of the game, some enemies can already be ON the map
	function _spawnX(maxRange) {  
		this.x = -COL_WIDTH + getRandomInt(0, maxRange); //stick offscreen left + random variance
	}

	//Sets the row (y) of the enemy
	//Spawn on a random enemy row (the stone tiles)
	function _spawnRow() {
		this.row = getRandomInt(enemyHighestRow, enemyLowestRow);
	}
};

//set the additional speed factor of this enemy
Enemy.prototype.setRandomSpeed = function() {
	this.speed = getRandomInt(ENEMY_MIN_SPEED, ENEMY_MAX_SPEED);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.

	this.x += this.speed * ENEMY_DEFAULT_SPEED * dt; //distance travelled

	if (this.x > (SCREEN_WIDTH + COL_WIDTH)) {  //bounds:  once fully offscreen right
		this.spawn(-COL_WIDTH/2);  //reset to offscreen left plus a little variance
		this.setRandomSpeed();  //assign a new random speed
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	var y = this.row * ROW_HEIGHT + ENEMY_Y_OFFSET;
	ctx.drawImage(Resources.get(this.sprite), this.x, y);
};


/*
 *
 *  Player Class
 *
*/

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
	this.spriteIndex = 0;  
	this.setSprite();  //assign the player an image based on its spriteIndex
	//px coordinates, for rendering
	this.x;
	this.y;
	//tile coordinates (since moves by tiles)
	this.col = 2;  //x
	this.row = 5;  //y
};

//Assign the player character an image based on its spriteIndex
Player.prototype.setSprite = function() {
	this.sprite = playerSprites[this.spriteIndex];
};

//Increment spriteIndex and keep it in bounds of the playerSprites array
Player.prototype.nextSprite = function() {
	this.spriteIndex < playerSprites.length - 1 ? this.spriteIndex++ : this.spriteIndex = 0;
}

//Converts from tile position to x,y position
Player.prototype.update = function(dt) {
	this.x = this.col * COL_WIDTH;
	this.y = this.row * ROW_HEIGHT + PLAYER_Y_OFFSET;

};

//Draw the player on the screen.
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
		case 'c':
			this.nextSprite();
			this.setSprite();
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

function getRandomInt(min, max) {
	max++; //to make the max inclusive
	return Math.floor(Math.random() * (max - min)) + min;
}
