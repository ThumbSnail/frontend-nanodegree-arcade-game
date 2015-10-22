//TODO:  Also, should you make a base sprite class?  (Since there's some shared funcs
	//between the enemies and the player now)

//Maybe all these consts should go in a global.js file or something?
//or... perhaps they should go onto their respective class's prototype?

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

//Player constants:  (it's weird that so much transparency is saved in the graphics):
var PLAYER_Y_OFFSET = -13;  //to center the sprites on a tile, shove up by this many px
var PLAYER_START_COL = 2;  //starting position tile x
var PLAYER_START_ROW = 5;  //starting position tile y

//Array of available character graphics for the player
var PLAYER_SPRITES = [
	'images/char-boy.png',
	'images/char-cat-girl.png',
	'images/char-horn-girl.png',
	'images/char-pink-girl.png',
	'images/char-princess-girl.png'
];

//Enemy constants:
var MAX_ENEMIES = 10;
var ENEMY_Y_OFFSET = -17; //px
var ENEMY_MIN_SPEED = 1;
var ENEMY_MAX_SPEED = 6;
var ENEMY_DEFAULT_SPEED = 20; //px

//row range in which enemies can spawn:
//Possible TODO: add more enemy rows once score reaches a certain point (in order to make game harder)
var enemyHighestRow = 1;
var enemyLowestRow = 3;

/*
 *
 * Enemy Class
 *
*/

// Enemies our player must avoid
var Enemy = function() {
	this.sprite = 'images/enemy-bug.png';  //enemy image
	
	//for position:
	this.x, this.row;  //row is (y) in tile coords
	this.spawn(SCREEN_WIDTH);  //set up the position variables
	
	//for speed:
	this.speed;
	this.setRandomSpeed();  //set up the speed

	//for hit detection:
	this.currentCenterX;  //it's center when taking account its current position
	this.setCurrentCenterX();  //set up the value
};

//Enemy constants
Enemy.prototype.RADIUS = Math.floor(0.40 * COL_WIDTH);  //half the bug's body is about 46px wide
Enemy.prototype.CENTER_X = Math.floor(COL_WIDTH / 2);  //the center of the bug's body

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

//Updates the enemy's current center (its center in relation to its position on the map)
Enemy.prototype.setCurrentCenterX = function() {
	this.currentCenterX = this.x + this.CENTER_X;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.

	this.x += this.speed * ENEMY_DEFAULT_SPEED * dt; //distance travelled

	this.setCurrentCenterX();  //keep track of its center relative to the map

	this.detectCollision();  //see if enemy bumped into the player

	if (this.x > (SCREEN_WIDTH + COL_WIDTH)) {  //bounds:  once fully offscreen right
		this.spawn(-COL_WIDTH/2);  //reset to offscreen left plus a little variance
		this.setRandomSpeed();  //assign a new random speed
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	var y = this.row * ROW_HEIGHT + ENEMY_Y_OFFSET;  //convert tile coordinate to px (y)
	ctx.drawImage(Resources.get(this.sprite), this.x, y);
};

//Determines whether or not the enemy has collided with the player
  //Source help / adapted from:  https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  //This still uses the idea of circle collision, but since the player and enemy MUST be
  //in the same row, the math is simpler.
Enemy.prototype.detectCollision = function() {
	if (this.row == player.row) { //only check if enemy is in same row as player
		//there's a collision when "the distance between the center points of the two sprites is less than
		//their radii added together"

		var distance = Math.abs(this.currentCenterX - player.currentCenterX);
		var bothRadii = this.RADIUS + player.RADIUS;
		if (distance < bothRadii) {
			player.placeAtStart();
		}
	}
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
	//for the sprite image:
	this.spriteIndex = 0;  
	this.setSprite();  //assign the player an image based on its spriteIndex

	//tile coordinates (since moves by tiles)
	this.col;  //x
	this.row;  //y
	this.placeAtStart();  //put player at starting position

	//for hit detection:
	this.currentCenterX;  //it's center when taking account its current position
	this.setCurrentCenterX();  //set this value
};

//Constants for this player class:
//For hit detection:
Player.prototype.CENTER_X = Math.floor(COL_WIDTH / 2);  //the center of the player's body
Player.prototype.RADIUS = Math.floor(0.163 * COL_WIDTH);  //half the player's body is about 16px wide

//Assign the player character an image based on its spriteIndex
Player.prototype.setSprite = function() {
	this.sprite = PLAYER_SPRITES[this.spriteIndex];
};

//Increment spriteIndex and keep it in bounds of the PLAYER_SPRITES array
Player.prototype.nextSprite = function() {
	this.spriteIndex < PLAYER_SPRITES.length - 1 ? this.spriteIndex++ : this.spriteIndex = 0;
}

//Places player at the starting position
Player.prototype.placeAtStart = function() {
	this.col = PLAYER_START_COL;
	this.row = PLAYER_START_ROW;
}

//Updates the player's current center (its center in relation to its position on the map)
Player.prototype.setCurrentCenterX = function() {
	this.currentCenterX = this.col * COL_WIDTH + this.CENTER_X;
};

//TODO Looks for collisions on special items
//Looks to see if over water (ie, won the round)
Player.prototype.update = function(dt) {
	if (this.row === 0) {  //if made it to the finish line (the water)
		//TODO:  up the score, reset player position, put stars in the water (remove when player makes first move)
	}

};

//Draw the player on the screen, first converting from tile coords to px (x,y)
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
		case 'c':
			this.nextSprite();
			this.setSprite();
			break;
	}

	if (key !== 'c') {
		this.setCurrentCenterX();  //if player moved, update his center value
		//do this here instead of in update to save on unnecessary calls (since this changes less frequently)
	}
};

//Player can also use the mouse with the same functionality
//as the keyboard.  (minus the c-key to change portraits, obviously)
Player.prototype.handleClicks = function(tileCol, tileRow) {
	var nearX = tileCol - this.col;
	var nearY = tileRow - this.row;

	//move if clicked on an adjacent (including diagonal) tile
	if ((nearX >= -1 && nearX <= 1) && (nearY >= -1 && nearY <= 1)) {
		this.col = tileCol;
		this.row = tileRow;
	}
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
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

//This adds the mouse as a control option
  //Source help:  http://www.homeandlearn.co.uk/JS/html5_canvas_mouse_events.html
document.querySelector('#canvas').addEventListener('mousedown', function(event) {
	//convert mouse clicks to tile coordinates:
	var tileCol = Math.floor(event.offsetX / COL_WIDTH);
	//y is a little awkward due to the transparency included in the tile graphics
	//In effect, it's like there's an extra 60%-row of padding at the top of the canvas
	var tileRow = Math.floor((event.offsetY - ROW_HEIGHT * 0.60) / ROW_HEIGHT);

	if (tileRow >= 0 && tileRow < MAX_ROW_INDEX + 1) {  //weed out any clicks not on the actual tiles
		player.handleClicks(tileCol, tileRow);
	}
});

//possible TODO:  set up touch listeners for mobile devices
  //Source help:  http://www.homeandlearn.co.uk/JS/html5_canvas_touch_events.html

//returns a random integer between the provided range, inclusively
function getRandomInt(min, max) {
	max++; //to make the max inclusive
	return Math.floor(Math.random() * (max - min)) + min;
}


//stil TODO basics:
//hit detection - death / loss of heart
//finishline - win