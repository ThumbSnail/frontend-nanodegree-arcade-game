##Frogger Clone

A.  Description

	Project 3 for Udacity's Front-End Web Developer Nanodegree

	An HTML5 Canvas powered video game, developed using the best practices in
	Object-Oriented JavaScript.

B.  How to Download/Run

	1.  Visit the following link:

[http://thumbsnail.github.io/frontend-nanodegree-arcade-game](http://thumbsnail.github.io/frontend-nanodegree-arcade-game)

	2.  Or download the project's .zip file.  Unzip the file and then open the index.html 
		file in your browser of choice:

[https://github.com/ThumbSnail/frontend-nanodegree-arcade-game/archive/master.zip](https://github.com/ThumbSnail/frontend-nanodegree-arcade-game/archive/master.zip)

	3.  Or clone the repository:
		git clone https://github.com/ThumbSnail/frontend-nanodegree-arcade-game.git
		Then open the index.html file in the browser of your choice.

C. How to Play

	1. Goal

	    To get the highest score! Points are obtained in two ways:

	        Crossing the finish line:  Successfully navigate your character
	        to the water tiles.  Reaching a water tile gives you (initially)
	        2 points.  (As the difficulty of the game increases, so does the
	        number of points received for reaching the water tiles.)

	        Picking up a gem:  Collect gems by navigating to a tile with a gem
	        on it.  Each gem you collect is worth 3 points.

	2. Controls

	    Keyboard:  Use the arrow keys to move up, left, down, and right.
	               Press the 'c' key to change your character's sprite.

	    Mouse:     Click on any adjacent tile (even diagonal) to move there.
	               Click on your character to change its sprite.

	    Touch:	   Same as mouse.

	3. Challenges

	    Enemies:  If a bug collides with you, you lose a life.  You begin each
	              game with three lives.  If you lose all three lives, it's
	              game over.

	    Gems:     Though gems do increase your score, they come with a risk.
	              Each gem produces a status effect that changes the game play.
	              The changes are:

	        Blue:    Boulders block some of the water tiles, thereby reducing
	                 the number of finish line exits.

	        Green:   The enemies travel in reverse.  (Moonwalking bugs!!!)

	        Orange:  You are no longer allowed to move backwards.

	4. Difficulty

		When the points received from scoring a goal (reaching the water tiles)
		put your score over a certain threshold, the game's difficulty
		increased by adding an additional enemy into the mix.

		As a reward for the increased difficulty, the number of points received
		from scoring a goal also increases.

		There are 5 difficulties.  The hardest difficult puts you up against
		15 enemies instead of the starting 10.  And the points received for scoring
		a goal will be 7 instead of the starting 2.

		IMPORTANT:  The difficulty increase and the reward increase both persist
		beyond a game over.

	5. Mobile Devices

		Supports tablets and larger phones.