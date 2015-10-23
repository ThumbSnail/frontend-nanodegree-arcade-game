frontend-nanodegree-arcade-game
===============================

1. How to Download/Install

    A. Visit the webpage (easiest)

    	A live version is hosted on GitHub pages.  Just visit this link:

    	http://thumbsnail.github.io/frontend-nanodegree-arcade-game

    B. Download the .zip file (2nd easiest)

    	In my GitHub repository located at:

    	https://github.com/ThumbSnail/frontend-nanodegree-arcade-game

    	Click the Download ZIP button.  Unzip the file and then open the
    	index.html file in your browser of choice.

    C. Clone my repository (Hardest, unless you're familiar with GitHub/git)

    	git clone https://github.com/ThumbSnail/frontend-nanodegree-arcade-game.git

    	Then open the index.html file in the browser of your choice.

2. How to Play

    A. Goal

	    To get the highest score! Points are obtained in two ways:

	        Crossing the finish line:  Successfully navigate your character
	        to the water tiles.  Reaching a water tile gives you (initially)
	        2 points.  (As the difficulty of the game increases, so does the
	        number of points received for reaching the water tiles.)

	        Picking up a gem:  Collect gems by navigating to a tile with a gem
	        on it.  Each gem you collect is worth 3 points.

    B. Controls

	    Keyboard:  Use the arrow keys to move up, left, down, and right.
	               Press the 'c' key to change your character's sprite.

	    Mouse:     Click on any adjacent tile (even diagonal) to move there.
	               Click on your character to change its sprite.

    C. Challenges

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

	D. Difficulty

		When the points received from scoring a goal (reaching the water tiles)
		put your score over the threshold (25 points), the game's difficulty
		increased by adding an additional enemy into the mix.

		As a reward for the increased difficulty, the number of points received
		from scoring a goal also increases.

		There are 5 difficulties.  Thus, once you score about 125 points, you'll
		be facing off against 15 enemies instead of the starting 10.  And the points
		received for scoring a goal will be 7 instead of the starting 2.

		IMPORTANT:  The difficulty increase and the reward increase both persist
		beyond a game over.
		