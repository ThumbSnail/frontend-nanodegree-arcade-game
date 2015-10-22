/*
 *
 * Global Constants & Variables
 *
*/

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

//Game constants:
var MAX_ENEMIES = 10;
var GOAL_POINTS = 2;
var PLAYER_LIVES = 3;
var GEM_POINTS = 3;

/*
 *
 * Enemy Class
 *
*/

// Enemies our player must avoid
var Enemy = function() {
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

/* Enemy Constants and Common Variables */

//For graphics:
Enemy.prototype.sprite = 'images/enemy-bug.png';  //enemy image
//For hit detection:
Enemy.prototype.RADIUS = Math.floor(0.40 * COL_WIDTH);  //use most of the bug for hit detection
Enemy.prototype.CENTER_X = Math.floor(COL_WIDTH / 2);  //the center of the bug's body
//For positioning:
Enemy.prototype.Y_OFFSET = -17; //px
Enemy.prototype.enemyHighestRow = 1;  
Enemy.prototype.enemyLowestRow = 3;
//For speed:
Enemy.prototype.MIN_SPEED = 1;
Enemy.prototype.MAX_SPEED = 8;
Enemy.prototype.DEFAULT_SPEED = 20; //px

/* Enemy Methods */

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
		this.row = getRandomInt(this.enemyHighestRow, this.enemyLowestRow);
	}
};

//set the additional speed factor of this enemy
Enemy.prototype.setRandomSpeed = function() {
	this.speed = getRandomInt(this.MIN_SPEED, this.MAX_SPEED);
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

	this.x += this.speed * this.DEFAULT_SPEED * dt; //distance travelled

	this.setCurrentCenterX();  //keep track of its center relative to the map

	this.detectCollision();  //see if enemy bumped into the player

	if (this.x > (SCREEN_WIDTH + COL_WIDTH)) {  //bounds:  once fully offscreen right
		this.spawn(-COL_WIDTH/2);  //reset to offscreen left plus a little variance
		this.setRandomSpeed();  //assign a new random speed
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	var y = this.row * ROW_HEIGHT + this.Y_OFFSET;  //convert tile coordinate to px (y)
	ctx.drawImage(Resources.get(this.sprite), this.x, y);
};

//Determines whether or not the enemy has collided with the player
  //Source help / adapted from:  https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  //This still uses the idea of circle collision, but since the player and enemy MUST be
  //in the same row, the math is simpler.
Enemy.prototype.detectCollision = function() {
	if (this.row == player.row && !player.wasHit) { //only check if enemy is in same row as player
		//there's a collision when "the distance between the center points of the two sprites is less than
		//their radii added together"

		var distance = Math.abs(this.currentCenterX - player.currentCenterX);
		var bothRadii = this.RADIUS + player.RADIUS;
		if (distance < bothRadii) {
			player.wasHit = true;
			player.lives--;
			stats.render();  //update the number of hearts shown on this display
			if (player.lives === 0) {
				gem.inPlay = false;  //remove the current gem (if any)
				stats.gameOver();
			}
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
	this.wasHit = false;  //bool used for animation
	this.lives = 3;  //3 hits before game over

	//for animation:
	this.rotation = 0;  //radians, used to spin player in circle after being hit

	//for goal detection:
	this.finished = false;  //turns true when crosses finish line (the water tiles)
};

/* Player Constants */

//For hit detection:
Player.prototype.CENTER_X = Math.floor(COL_WIDTH / 2);  //the center of the player's body
//For animation:
Player.prototype.CENTER_Y = COL_WIDTH;  //it's actually about 100 px down from the top, so just use COL_WIDTH
Player.prototype.RADIUS = Math.floor(0.163 * COL_WIDTH);  //half the player's body is about 16px wide
//For positioning:
Player.prototype.Y_OFFSET = -1 * Math.floor(.13 * COL_WIDTH);  //to center the sprites on a tile
Player.prototype.START_COL = 2;  //starting position tile x
Player.prototype.START_ROW = 5;  //starting position tile y
//For character graphic:
Player.prototype.SPRITES = [
	'images/char-boy.png',
	'images/char-cat-girl.png',
	'images/char-horn-girl.png',
	'images/char-pink-girl.png',
	'images/char-princess-girl.png'
];

/* Player Methods */

//Assign the player character an image based on its spriteIndex
Player.prototype.setSprite = function() {
	this.sprite = this.SPRITES[this.spriteIndex];
};

//Increment spriteIndex and keep it in bounds of the SPRITES array
Player.prototype.nextSprite = function() {
	this.spriteIndex < this.SPRITES.length - 1 ? this.spriteIndex++ : this.spriteIndex = 0;
}

//Places player at the starting position
Player.prototype.placeAtStart = function() {
	this.col = this.START_COL;
	this.row = this.START_ROW;
	this.setCurrentCenterX()
}

//Updates the player's current center (its center in relation to its position on the map)
Player.prototype.setCurrentCenterX = function() {
	this.currentCenterX = this.col * COL_WIDTH + this.CENTER_X;
};

//Looks to see if player has stepped on a special tile or item
//If the player reaches the finish, it triggers all the "scored a goal"-related matters
//If the player reaches a gem, it triggers all the gem-related matters
Player.prototype.update = function() {
	//if made it to the finish line (the water)
	if (!this.finished && this.row === 0) {
		gem.gemEffect = -1;  //reset in case player picked up a gem this round
		star.setCol(this.col);  //place the star where the player crossed the goal line
		this.finished = true;  //scored a goal!  Show a gold star
		stats.updateScore(GOAL_POINTS);  //update the score
		this.placeAtStart();  //reset player position
		gem.spawn();  //spawn a new gem for this next 'level'
	}

	//if stepped on a gem:
	if (gem.inPlay && gem.col === this.col && gem.row == this.row) {
		gem.inPlay = false;  //no longer render the gem
		stats.updateScore(GEM_POINTS);  //increase score
		gem.statusEffect();  //trigger the gem's additional effect
	}
};

//Draw the player on the screen, first converting from tile coords to px (x,y)
Player.prototype.render = function() {
	var x = this.col * COL_WIDTH;
	var y = this.row * ROW_HEIGHT + this.Y_OFFSET;

	if (this.wasHit) {  //render spinning animation
		this.animateSpin(y);
	}
	else { 
		//render normally, without animation
		ctx.drawImage(Resources.get(this.sprite), x, y);

		//if orange gem was collected, player CANNOT move backwards
		//thus, draw a red x behind him to make it more clear what's in effect
		if (gem.gemEffect != undefined && gem.gemEffect === gem.ORANGE) {
			this.drawRedX(y);
		}
	}
};

//Source help:  http://stackoverflow.com/questions/2677671/how-do-i-rotate-a-single-object-on-an-html-5-canvas
//Since I don't keep track of currentCenterY, this takes the current y position as an argument
Player.prototype.animateSpin = function(y) {
	this.rotation += 0.025 * 2 * Math.PI;  //rotate 9 degrees per cycle

	if (this.rotation > 2 * Math.PI) {  //circle complete, animation over
		//reset player
		this.rotation = 0;
		this.wasHit = false;
		this.placeAtStart();
	}
	else {  //draw the next step in the rotation
		ctx.save();
		ctx.translate(this.currentCenterX, y + this.CENTER_Y);
		ctx.rotate(this.rotation);
		ctx.drawImage(Resources.get(this.sprite), - this.CENTER_X, -this.CENTER_Y);
		ctx.restore();  //reset
	}
};

//Draws a big red 'X' at the player's feet to inform him/her that they cannont move backwards now
  //(Because they picked up an orange gem this round)
Player.prototype.drawRedX = function(y) {
	ctx.fillStyle = '#f00';
	ctx.font = '40pt Tahoma, sans-serif';

	ctx.fillText('X', this.currentCenterX, y + ROW_HEIGHT * 1.50);
};

//Using the arrow keys, move Player 1 tile from current position
//Also prevents player from moving off the game screen
//The 'c' key is used to swap character sprites
Player.prototype.handleInput = function(key) {
	if (this.finished) {
		this.finished = false;  //remove the 'hey, you scored!' feedback; that is, stop rendering the star
	}

	//if an orange gem was picked up, prevent the player from moving backwards
	if (gem.gemEffect === gem.ORANGE && key === 'down') {
		return;
	}

	if (!this.wasHit) {  //don't allow movement when death animation is occurring
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
	}

	if (key !== 'c') {
		this.setCurrentCenterX();  //if player moved, update his center value
		//do this here instead of in update to save on unnecessary calls (since this changes less frequently)
	}
};

//Player can also use the mouse with the same functionality
//as the keyboard.  (but to change portraits, click the character.  [no c key obviously])
Player.prototype.handleClicks = function(tileCol, tileRow) {
	if (this.finished) {
		this.finished = false;  //remove the 'hey, you scored!' feedback; that is, stop rendering the star
	}

	if (!this.wasHit) {  //don't allow movement when death animation is occurring

		//To switch character sprites when playing only with mouse:
		if (tileCol === this.col && tileRow === this.row) {  //if clicked directly ON the player
			this.nextSprite();  //swap to the next character sprite
			this.setSprite();
		}

		var nearX = tileCol - this.col;
		var nearY = tileRow - this.row;

		//if an orange gem was picked up, prevent the player from moving backwards
		if (gem.gemEffect === gem.ORANGE && nearY === 1) {
			return;
		}

		//move if clicked on an adjacent (including diagonal) tile
		if ((nearX >= -1 && nearX <= 1) && (nearY >= -1 && nearY <= 1)) {
			this.col = tileCol;
			this.row = tileRow;
			this.setCurrentCenterX();  //if player moved, update his center value
			//do this here instead of in update() to save on unnecessary calls (since this changes less frequently)
		}
	}
};

/*
 *
 * Stats Class (lives, score, high score)
 *
*/

var Stats = function() {
	this.heartSprite = 'images/Heart.png';  //represents the player's lives
	this.scale = 0.40;  //since the heart graphic is too big to fit

	//Score label:
	this.scoreLabel = 'Score';
	this.scoreLabelX = Math.floor(2.5 * COL_WIDTH); //x location to render
	this.scoreLabelY = 0; //y location to render

	//Score:
	this.score = 0;  //current game score
	this.scoreY = Math.floor(0.25 * ROW_HEIGHT);  //y location to render (x is same as above label)

	//High Score label:
	this.highLabel = 'High';
	this.highLabelX = Math.floor(4.5 * COL_WIDTH); //x location to render
	this.highLabelY = 0; //y location to render

	//High Score:
	this.high = 0;  //best score ever
	//x location same as label, y location same as score

	//Aesthetics:
	this.labelColor = '#777';
	this.scoreColor = '#000';
	this.labelFont = '12pt Tahoma, sans-serif';
	this.scoreFont = '16pt Tahoma, sans-serif';
};

//Render all the stats information, at the top of the canvas, but outside the tile area
Stats.prototype.render = function() {
	ctx.clearRect(0, 0, SCREEN_WIDTH, ROW_HEIGHT * .50);
	this.renderHearts();
	this.renderLabels();
	this.renderScores();
};

//Draws a heart to represent each of the player's lives
Stats.prototype.renderHearts = function() {
	ctx.save();
	ctx.scale(this.scale, this.scale);
	for (var i = 0; i < player.lives; i++) {
		ctx.drawImage(Resources.get(this.heartSprite), i * COL_WIDTH, -ROW_HEIGHT * this.scale);
	}
	ctx.restore(); //reset
};

//sets the style for and then draws the text for both labels
Stats.prototype.renderLabels = function() {
	ctx.fillStyle = this.labelColor;
	ctx.font = this.labelFont;

	ctx.fillText(this.scoreLabel, this.scoreLabelX, this.scoreLabelY);  //score
	ctx.fillText(this.highLabel, this.highLabelX, this.highLabelY);  //high
};

//Sets the style for and then draws the text for both score types
Stats.prototype.renderScores = function() {
	ctx.fillStyle = this.scoreColor;
	ctx.font = this.scoreFont;

	ctx.fillText(this.score, this.scoreLabelX, this.scoreY);  //score
	ctx.fillText(this.high, this.highLabelX, this.scoreY);  //high
};

//Increases the current game's score by the value passed in
Stats.prototype.updateScore = function(val) {
	this.score += val;
	this.render();  //update the labels
};

//updates the player's best ever score upon game finish if it's a new record
Stats.prototype.updateHigh = function() {
	if (this.high < this.score) {
		this.high = this.score;
	}
}

Stats.prototype.gameOver = function() {
	this.updateHigh();  //check to see if there was a high score
	player.lives = PLAYER_LIVES;  //reset player lives to beginning amount
	this.score = 0;  //reset score
	this.render();  //update the display
	gem.gemEffect = -1;  //remove the gemEffect if there was any
	gem.spawn();  //spawn a new gem
}

/*
 *
 * Star Class  (Feeback for scoring a goal)
 *
*/

var Star = function() {
	this.sprite = 'images/Star.png';

	this.finalCol;  //column to place the star in (the water tile the player steps on)
	this.Y_OFFSET = -1 * Math.floor(.025 * COL_WIDTH);  //due to transparency, shift star to center
};

//Once player reaches the water, give him/her a gold star
Star.prototype.render = function() {
	if (player.finished) {  //only when player has scored a goal (reached the water)
		ctx.drawImage(Resources.get(this.sprite), this.finalCol * COL_WIDTH, this.Y_OFFSET);
	}
};

//Save the col position of the water tile the player stepped on to score
Star.prototype.setCol = function(col) {
	this.finalCol = col;
};

/*
 *
 * Gem Class
 *
*/

var Gem = function() {
	//graphics:
	this.sprites = [
		'images/Gem Blue.png',  // 0
		'images/Gem Green.png', // 1
		'images/Gem Orange.png' // 2
	];

	//type:
	this.type;  //serves as an index for the graphic, plus determines status effect

	//position:
	this.col;  //x pos in tile coord
	this.row;  //y pos in tile coord
	this.x;  //x in px
	this.y;  //y in px
	this.Y_OFFSET = -1 * Math.floor(.13 * COL_WIDTH);  //to center the sprites on a tile
	this.spawn();  //setups a gem

	//detection/collision
	this.inPlay;  //true when live, turns false after being picked up

	//status effect
	this.gemEffect = -1;  //-1 is none, otherwise matches its type when picked up
};

//Gem constants (to allow for easier readability)
Gem.prototype.BLUE = 0;
Gem.prototype.GREEN = 1;
Gem.prototype.ORANGE = 2;


//Creates a gem:  chooses its location and its type
Gem.prototype.spawn = function() {
	this.randomPosition();
	this.randomType();
	this.inPlay = true;
};

//Places the gem on a random tile that's NOT where the player starts
Gem.prototype.randomPosition = function() {
	this.col = getRandomInt(0, MAX_COL_INDEX);
	this.row = getRandomInt(1, MAX_ROW_INDEX);  //1 so that it's not in the water

	//don't place a gem right on the player's starting position
	if (this.col === player.START_COL && this.row == player.START_ROW) {
		this.randomPosition();  //try again!
	}

	this.x = this.col * COL_WIDTH;
	this.y = this.row * ROW_HEIGHT + this.Y_OFFSET;
};

//Choose a random gem type from the set of available gem sprites
Gem.prototype.randomType = function() {
	//this.type = getRandomInt(0, this.sprites.length - 1);
	this.type = 2;
};

//draws the sprite on the map, converts from tile coords to px
Gem.prototype.render = function() {
	if (this.inPlay) {  //draw only if player hasn't already picked up
		ctx.drawImage(Resources.get(this.sprites[this.type]), this.x, this.y);
	}
};

//Based on the gem type, cause a different change to the gameplay
//blue (0):  rocks form in the water and block goal line exits
//green (1):  switches direction of the enemies
//orange (2):  prevents player from moving backwards
Gem.prototype.statusEffect = function() {
	this.gemEffect = this.type;
};

/*
 *
 * Object Instantiation
 *
*/

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (var i = 0; i < MAX_ENEMIES; i++) {
	allEnemies.push(new Enemy());
}

var player = new Player();

var stats = new Stats();

var star = new Star();

var gem = new Gem();

/*
 *
 * Event Listeners
 *
*/

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

/*
 *
 * Other Functions
 *
*/

//returns a random integer between the provided range, inclusively
function getRandomInt(min, max) {
	max++; //to make the max inclusive
	return Math.floor(Math.random() * (max - min)) + min;
}


/* List of Added Extras:
  -switch character sprites
  -mouse input
  -animations (collision) / star appears upon goal scored
  -a lives (hearts) system
  -score/high score
  -gem collection for extra points
*/

//still TODO basics:
//update README  (you could also put the instruction in the html, too)
  //AND IN THE project notes === you GOTTA tell them that the orange gem INTENTIONALLY prevents moving backwards
  	//otherwise, they might view it as a fatal error/flaw.
  	  //Maybe I should have it draw a red 'x' behind them, too?  Just to be safe?

//advanced TODOs:

//mobile device touch listener?
  //^Likewise, is it possible to make this game responsive?  Can you scale down everything on a 
    //canvas to make it fit on the screen?  And then update all the constants?

//optimize graphics by using spritesheets?  (whole lotta extra work though...)

//Gems: 
  //ideas:  -reverse the direction of the enemy movement?  === the green gem
  		//  -could the bugs move down the columns?
  		//  -condense all the enemies down to being on one row (prob too hard), or two rows?
  		//  -increase enemy speed?
  		//  -rocks fall down and block some of the water exits?  === the blue gem
  		//  -the gem prevents you from moving backwards?  === the orange gem

  		// either a gem or just a 'once score reaches threshold' thing:  add another row of stones
  		   //and increase the number of enemies in the game?