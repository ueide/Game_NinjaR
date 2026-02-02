// ====================
// NINJA RUN - Main Game File
// ====================
// This is the main game controller. Game logic, state management, and rendering.
// For configuration, see config.js
// For utilities, see utils.js
// For entities (classes), see entities.js
// ====================

// Game State Variables
var floor;
var screen;
var gameChar_x;
var gameChar_y;
var enemies;
var treePos_y;
var trees_x;
var canyon;
var collectable;
var mountainsPos_x;
var mountainPos_Y;
var clouds;
var moon;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var onPlatform;
var cameraPosX;
var scoreCoin;
var flagPole;
var lives;
var platform;
var menuBG;
var coinSound;
var deadSound;
var fallDownSound;
var gameThemeSound;
var jumpSound;
var levelCompleteSound;
var menuGameSound;
var particles;
var smoothCameraPosX;
var totalCoins;
var totalCoinsCollected;
var coinBounceOffset;
var hitSoundPlayed;

function preload() {
    //images
    try {
        menuBG = loadImage("images/menuGameScreen.png");
    } catch(e) {
        console.error("Failed to load menu background image:", e);
    }

    //sounds
    soundFormats("mp3");
    try {
        coinSound = loadSound("sounds/coin.mp3");
        deadSound = loadSound("sounds/dead.mp3");
        fallDownSound = loadSound("sounds/fallDown.mp3");
        gameThemeSound = loadSound("sounds/gameTheme.mp3");
        jumpSound = loadSound("sounds/jump.mp3");
        levelCompleteSound = loadSound("sounds/levelComplete.mp3");
        menuGameSound = loadSound("sounds/menuGame.mp3");
    } catch(e) {
        console.error("Failed to load sound files:", e);
    }
}

function setup() {
	createCanvas(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
	pixelDensity(1);
	floor = FLOOR_CONFIG;
    lives = GAME_CONFIG.INITIAL_LIVES;
    screen = GAME_CONFIG.STATES.LOAD_SCREEN;
    particles = [];
    smoothCameraPosX = 0;
    coinBounceOffset = 0;
    hitSoundPlayed = false;
    startGame();
}

function draw() {
    if(screen == GAME_CONFIG.STATES.LOAD_SCREEN) {
        loadScreen();
    }
    else if(screen == GAME_CONFIG.STATES.MENU) {
        menuGame();
    }
    else if(screen == GAME_CONFIG.STATES.PLAYING) {
        drawGame();
    }
    else if(screen == GAME_CONFIG.STATES.RESTART) {
        restartGame();
    }
}

function verifySound(sound) {
    if(sound && sound.isPlaying && sound.isPlaying() == false) {
        sound.play();
    }
}

// ==================== UI/MENU FUNCTIONS ====================

function menuGame() {
    // Sound management
    verifySound(menuGameSound);
    setSoundVolume(menuGameSound, GAME_CONFIG.SOUND_VOLUMES.MENU);

    // Menu background
    if(menuBG) {
        image(menuBG, 0, 0, width, height);
    } else {
        background(100, 149, 237);
    }

    // Draw buttons
    stroke(0);
    strokeWeight(2);
    
    // Start button with hover effect
    let startHovered = (mouseX > 683 && mouseX < 853 && mouseY > 259 && mouseY < 318);
    if(startHovered) {
        fill(GAME_CONFIG.UI.BUTTON_HOVER_COLOR);
    } else {
        fill(GAME_CONFIG.UI.BUTTON_NORMAL_COLOR);
    }
    rect(683, 260, 170, 58, 40);

    // Settings and Exit buttons (no hover)
    fill(GAME_CONFIG.UI.BUTTON_NORMAL_COLOR);
    noStroke();
    rect(683, 382, 170, 44, 32);
    rect(683, 460, 170, 44, 32);

    // Button text
    fill(0);
    textSize(30);
    text("Start", 736, 300);

    textSize(22);
    text("Settings", 729, 412);
    text("Exit", 748, 491);
}

function drawGame() {
    // ==================== SETUP ====================
    verifySound(gameThemeSound);
    setSoundVolume(gameThemeSound, GAME_CONFIG.SOUND_VOLUMES.MUSIC);

    cameraPosX = gameChar_x - GAME_CONFIG.CAMERA.OFFSET;
    smoothCameraPosX = lerp(smoothCameraPosX, cameraPosX, GAME_CONFIG.CAMERA.LERP_SPEED);

    // ==================== RENDERING ====================
    background(16, 40, 73);

    push();
    translate(-smoothCameraPosX, 0);

    //-------- mountains --------//
    drawMountains();

    //-------- tree --------//
    drawTrees();

    //-------- flagPole --------//
    checkPoint();
    checkFlagPole();

    //-------- check if the player die --------//
    checkIfDie();

    //-------- ground --------//
    fill(144, 114, 80);
    rect(floor.x_pos, floor.y_pos, floor.width * 3.5, floor.height);

    fill(54, 118, 42);
    rect(floor.x_pos, floor.y_pos, width * 3.5, 20);

    //-------- canyon --------//
    drawCanyons(canyon);
    checkCanyons(canyon);

    //-------- platforms with gradient --------//
    for(var i = 0; i < platform.length; i++) {
        platform[i].draw();
    }

    //-------- platform base --------//
    fill(103, 68, 40);
    arc(140, 388, 64, 30, 0, PI);
    arc(270, 343, 13, 12, 0, PI);
    arc(380, 268, 64, 30, 0, PI);
    arc(1412, 398, 17, 13, 0, PI);
    arc(1510, 353, 13, 11, 0, PI);
    arc(1755, 353, 195, 65, 0, PI);

    //-------- Enemies --------//
    for(var i = 0; i < enemies.length; i++) {
        enemies[i].draw();
        var onEnemies = enemies[i].checkEnemies(gameChar_x, gameChar_y);
        
        if(onEnemies) {
            canyon.isFound = true;
            createHitEffect(gameChar_x, gameChar_y);
        }
    }

    //-------- collectables --------//
    drawCollectables(collectable);
    checkCollectables(collectable);

    //-------------- main game character ----------------//

    //---- walking left and fall
    if (isLeft && isFalling) {
        //Head and body
        fill(0);
        ellipse(gameChar_x - 9, gameChar_y - 47, 17.5, 19);
        stroke(0);
        strokeWeight(11);
        line(gameChar_x - 4.8, gameChar_y - 32, gameChar_x + 1, gameChar_y - 14);

        //legs and arms
        strokeWeight(4);
        line(gameChar_x - 2, gameChar_y - 33.2, gameChar_x + 10.5, gameChar_y - 27.7);
        line(gameChar_x - 2, gameChar_y - 31.2, gameChar_x + 10.5, gameChar_y - 24.7);

        line(gameChar_x + 4, gameChar_y - 11, gameChar_x + 9, gameChar_y);
        line(gameChar_x - 1, gameChar_y - 9, gameChar_x - 4.5, gameChar_y - 4);
        line(gameChar_x - 4.5, gameChar_y - 4, gameChar_x - 3, gameChar_y);

        //Face and mask
        strokeWeight(1);
        fill(255);
        ellipse(gameChar_x - 10.6, gameChar_y - 49, 14, 7);
        fill(0);
        ellipse(gameChar_x - 11.2, gameChar_y - 48.6, 1.3, 2.5);

        stroke(0);
        strokeWeight(0.7);
        line(gameChar_x - 13, gameChar_y - 49.5, gameChar_x - 9, gameChar_y - 50.5);
        strokeWeight(1);
    }

    //---- walking right and fall
    else if (isRight && isFalling) {
        //Head and body
		fill(0);
		ellipse(gameChar_x + 9, gameChar_y - 47, 17.5, 19);
		stroke(0);
		strokeWeight(11);
		line(gameChar_x + 4.8, gameChar_y - 32, gameChar_x - 1, gameChar_y - 14);
	
		//legs and arms
		strokeWeight(4);
		line(gameChar_x + 2, gameChar_y - 33.2, gameChar_x - 10.5, gameChar_y - 27.7);
		line(gameChar_x + 2, gameChar_y - 31.2, gameChar_x - 10.5, gameChar_y - 24.7);

		line(gameChar_x - 4, gameChar_y - 11, gameChar_x - 9, gameChar_y );
		line(gameChar_x + 1, gameChar_y - 9, gameChar_x + 4.5, gameChar_y - 4);
		line(gameChar_x + 4.5, gameChar_y - 4, gameChar_x + 3, gameChar_y );

		//Face and mask
		strokeWeight(1);
		fill(255);
		ellipse(gameChar_x + 10.6, gameChar_y - 49, 14, 7);
		fill(0);
		ellipse(gameChar_x + 11.2, gameChar_y - 48.6, 1.3, 2.5);

		stroke(0);
		strokeWeight(0.7);
		line(gameChar_x + 13, gameChar_y - 49.5, gameChar_x + 9, gameChar_y - 50.5);
		strokeWeight(1);
    } 

    //---- walking left
    else if (isLeft) {
        //Head and body
		fill(0);
		ellipse(gameChar_x - 9, gameChar_y - 47, 17.5, 19);
		stroke(0);
		strokeWeight(11);
		line(gameChar_x - 4.8, gameChar_y - 32, gameChar_x + 1, gameChar_y - 14);
	
		//legs and arms
		strokeWeight(4);
		line(gameChar_x - 2, gameChar_y - 33.2, gameChar_x + 10.5, gameChar_y - 27.7);
		line(gameChar_x - 2, gameChar_y - 31.2, gameChar_x + 10.5, gameChar_y - 24.7);

		line(gameChar_x + 3, gameChar_y - 11, gameChar_x - 1, gameChar_y - 4);
		line(gameChar_x - 1, gameChar_y - 4, gameChar_x + 3, gameChar_y );
		line(gameChar_x - 1, gameChar_y - 9, gameChar_x - 3, gameChar_y - 4);
		line(gameChar_x - 3, gameChar_y - 4, gameChar_x , gameChar_y );

		//Face and mask
		strokeWeight(1);
		fill(255);
		ellipse(gameChar_x - 10.6, gameChar_y - 49, 14, 7);
		fill(0);
		ellipse(gameChar_x - 11.2, gameChar_y - 48.6, 1.3, 2.5);
	
		stroke(0);
		strokeWeight(0.7);
		line(gameChar_x - 13, gameChar_y - 49.5, gameChar_x - 9, gameChar_y - 50.5);
		strokeWeight(1);
    } 

    //---- Walking right
    else if (isRight) {
        //Head and body
		fill(0);
		ellipse(gameChar_x + 9, gameChar_y - 47, 17.5, 19);
		stroke(0);
		strokeWeight(11);
		line(gameChar_x + 4.8, gameChar_y - 32, gameChar_x - 1, gameChar_y - 14);
	
		//legs and arms
		strokeWeight(4);
		line(gameChar_x + 2, gameChar_y - 33.2, gameChar_x - 10.5, gameChar_y - 27.7);
		line(gameChar_x + 2, gameChar_y - 31.2, gameChar_x - 10.5, gameChar_y - 24.7);

		line(gameChar_x - 3, gameChar_y - 11, gameChar_x + 1, gameChar_y - 4);
		line(gameChar_x + 1, gameChar_y - 4, gameChar_x - 3, gameChar_y );
		line(gameChar_x + 1, gameChar_y - 9, gameChar_x + 3, gameChar_y - 4);
		line(gameChar_x + 3, gameChar_y - 4, gameChar_x , gameChar_y );

		//Face and mask
		strokeWeight(1);
		fill(255);
		ellipse(gameChar_x + 10.6, gameChar_y - 49, 14, 7);
		fill(0);
		ellipse(gameChar_x + 11.2, gameChar_y - 48.6, 1.3, 2.5);

		stroke(0);
		strokeWeight(0.7);
		line(gameChar_x + 13, gameChar_y - 49.5, gameChar_x + 9, gameChar_y - 50.5);
		strokeWeight(1);
    } 

    //---- falling OR plummeting
    else if (isFalling || isPlummeting) {
        //Head and body
        fill(0);
        ellipse(gameChar_x, gameChar_y - 47, 17.5, 19);
        rect(gameChar_x - 5.3, gameChar_y - 37, 10.5, 29, 5.5);

        //legs and arms
        stroke(0);
        strokeWeight(4);
        line(gameChar_x - 3, gameChar_y - 33.2, gameChar_x - 12, gameChar_y - 25.7);
        line(gameChar_x + 3, gameChar_y - 33.2, gameChar_x + 12, gameChar_y - 25.7);

        line(gameChar_x - 3.5, gameChar_y - 12, gameChar_x - 5.5, gameChar_y);
        line(gameChar_x + 3.5, gameChar_y - 12, gameChar_x + 5.5, gameChar_y);
        ellipse(gameChar_x - 6, gameChar_y, 1, 0.1);
        ellipse(gameChar_x + 6, gameChar_y, 1, 0.1);

        //Face and mask
        strokeWeight(1);
        fill(255);
        ellipse(gameChar_x, gameChar_y - 49, 14, 8);
        fill(0);
        ellipse(gameChar_x - 3.2, gameChar_y - 48.6, 1.3, 2.5);
        ellipse(gameChar_x + 3.2, gameChar_y - 48.6, 1.3, 2.5);

        stroke(0);
        strokeWeight(0.7);
        line(gameChar_x - 4.3, gameChar_y - 50.7, gameChar_x - 1.7, gameChar_y - 49.5);
        line(gameChar_x + 4.3, gameChar_y - 50.7, gameChar_x + 1.7, gameChar_y - 49.5);
        strokeWeight(1);
    } 

    //---- standing front
    else {
        //Head and body
        fill(0);
        ellipse(gameChar_x, gameChar_y - 47, 17, 18);
        rect(gameChar_x - 5.3, gameChar_y - 37, 10.5, 29, 5.5);

        //legs and arms
        stroke(0);
        strokeWeight(4);
        line(gameChar_x - 3, gameChar_y - 33.2, gameChar_x - 11, gameChar_y - 21.5);
        line(gameChar_x + 3, gameChar_y - 33.2, gameChar_x + 11, gameChar_y - 21.5);

        line(gameChar_x - 3, gameChar_y - 12, gameChar_x - 4, gameChar_y);
        line(gameChar_x + 3, gameChar_y - 12, gameChar_x + 4, gameChar_y);
        ellipse(gameChar_x - 5, gameChar_y, 1, 0.1);
        ellipse(gameChar_x + 5, gameChar_y, 1, 0.1);

        //Face and mask
        strokeWeight(1);
        fill(255);
        ellipse(gameChar_x, gameChar_y - 49, 14, 8);
        fill(0);
        ellipse(gameChar_x - 3.2, gameChar_y - 48.6, 1.3, 2.5);
        ellipse(gameChar_x + 3.2, gameChar_y - 48.6, 1.3, 2.5);

        stroke(0);
        strokeWeight(0.7);
        line(gameChar_x - 4.3, gameChar_y - 50.7, gameChar_x - 1.7, gameChar_y - 49.5);
        line(gameChar_x + 4.3, gameChar_y - 50.7, gameChar_x + 1.7, gameChar_y - 49.5);
        strokeWeight(1);
    }
    //-------------- main game character END ----------------//

    //----------------------- translate END -----------------------//
    pop();
    //----

    //-------- moving left -------//
    if (isLeft == true) {
        gameChar_x -= 2.2;
    }

    //-------- moving right -------//
    if (isRight == true) {
        gameChar_x += 2.2;
    }

    //-------- gravity -------//
    if (gameChar_y < floor.y_pos || canyon.isFound == true) {
        //on platform
        onPlatform = false;
        isFalling = false;

        for(var i = 0; i < platform.length; i++) {
            if(platform[i].checkPlatform(gameChar_x, gameChar_y) == true) {
                onPlatform = true;
                break;
            }
        }
        if(onPlatform == false) {
            gameChar_y += 2.2;
            isFalling = true;
        }

    } else {
        isFalling = false;
    }

    //-------- Plummeting -------//
    if (canyon.isFound == true) {
        gameChar_y += 5;
        //sound - play only once
        if(!hitSoundPlayed) {
            if(gameThemeSound) gameThemeSound.setVolume(0.1);
            verifySound(fallDownSound);
            if(fallDownSound) fallDownSound.setVolume(0.3);
            hitSoundPlayed = true;
        }

        if(gameChar_y >= 850) {
            isPlummeting = true;
        }

    } else {
        isPlummeting = false;
    }

    //---------- Moon ----------//
    // Moon moves at 5% of camera speed (parallax effect)
    let moonOffsetX = smoothCameraPosX * 0.05;
    fill(240, 240, 240, 18);
    noStroke();
    ellipse(moon.x_pos + 570 - moonOffsetX, moon.y_pos, moon.size + 55, moon.size + 55);

    fill(240, 240, 240);
    ellipse(moon.x_pos + 570 - moonOffsetX, moon.y_pos, moon.size + 40, moon.size + 40);

    //-------- Clouds with parallax --------//
    drawClouds();

    //-------- game over AND try again --------//
    if (lives < 1) {
        screen = 3;

        // sound
        if(gameThemeSound) gameThemeSound.stop(); //stop game theme sound
        verifySound(deadSound); // play dead sound
        if(deadSound) deadSound.setVolume(0.6);

        // text "game over"
        fill(0, 140);
        rect(0, 0, width, height);

        fill(255);
        rect(454, 272, 130, 48, 8);
        
        fill(255, 0, 0);
        stroke(1)
        strokeWeight(3);
        textSize(32);
        text("GAME OVER", 420, 210);

        // text "try again"
        fill(0);
        noStroke();
        textSize(20);
        text("Try again", 478, 303);
        noLoop();
    }

    //-------- Level --------//
    // Current level
    fill(255);
    noStroke();
    textSize(14);
    text( "Level 1 - 1 ", 920, 36);

    //Level complete
    if (flagPole.isReached == true) {
        // sound
        if(gameThemeSound) gameThemeSound.stop();

        verifySound(levelCompleteSound);
        if(levelCompleteSound) levelCompleteSound.setVolume(0.3);

        // text "level complete"
        fill(255);
        stroke(2);
        textSize(18);
        text("Level complete", 600, 300);
        noStroke();

        if(flagPole.isReached == true) { 
            if(gameChar_x < 2440 ) {
                gameChar_x += 2;
            }
            if(gameChar_x >= 2440) {
                noLoop();
            }
        }
    }

    //-------- coin score with bouncing animation -------//
    fill(255);
    noStroke();
    textSize(16);
    
    // Bouncing coin animation
    coinBounceOffset = sin(frameCount * 0.1) * 3;
    
    // Total coins collected / total coins
    text(totalCoinsCollected + "/" + totalCoins, 68, 36);
    
    fill(255, 223, 0);
    ellipse(50, 30 + coinBounceOffset, 17, 21);

    strokeWeight(1.5);
    stroke(196, 167, 53);
    ellipse(50, 30 + coinBounceOffset, 11, 15);
    noStroke();

    //-------- life score -------//
    fill(255);
    noStroke();
    textSize(16);
    text(lives, 140, 36);

    fill(255, 0, 0);
    triangle(111.5, 28.5, 120.3, 39, 129, 28.5);
    ellipse(116, 26, 10);
    ellipse(124.5, 26, 10);
    
    //----------------------- translate END -----------------------//
    pop();
    //----
    
    //-------- update and render particles with camera offset --------//
    for(let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].displayWithOffset(smoothCameraPosX);
        if(particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }
}

// ==================== INITIALIZATION ====================

function startGame() {
    cameraPosX = 0;
    smoothCameraPosX = 0;
    hitSoundPlayed = false;
	gameChar_x = floor.x_pos + 360;
	gameChar_y = floor.y_pos + 3;

    // boot movements 
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    onPlatform = false;

    //---- arrays
	trees_x = [
		550, 700, 1000, 1250, 1400, 1700, 
        1950, 2100, 2400, 2650, 2800, 3100,
	];
	treePos_y = height / 2;

    clouds = { 
        x_pos: [280, 310, 340, 440, 454, 464, 800, 817, 837],
        y_pos: [80, 80, 80, 140, 140, 140, 110, 110, 110],
        size_1: [50, 50, 45, 25, 28, 25, 40, 40, 35],
        size_2: [38, 50, 35, 22, 28, 22, 32, 38, 28]
    };

	moon = { x_pos: 100, y_pos: 100, size: 50 };

	collectable = [
        { x_pos: 380, y_pos: 242, size: 50, isFound: false},
        { x_pos: 510, y_pos: 242, size: 50, isFound: false},
        { x_pos: 400, y_pos: 485, size: 50, isFound: false},
        { x_pos: 550, y_pos: 485, size: 50, isFound: false},
        { x_pos: 990, y_pos: 485, size: 50, isFound: false},
        { x_pos: 1050, y_pos: 485, size: 50, isFound: false},
        { x_pos: 1600, y_pos: 485, size: 50, isFound: false},
        { x_pos: 1800, y_pos: 485, size: 50, isFound: false},
        { x_pos: 1840, y_pos: 330, size: 50, isFound: false},
        { x_pos: 1970, y_pos: 310, size: 50, isFound: false},
        { x_pos: 1970, y_pos: 350, size: 50, isFound: false},
        { x_pos: 2300, y_pos: 485, size: 50, isFound: false},
	];

    // Set total coins for HUD display
    totalCoins = collectable.length;
    totalCoinsCollected = 0;

	mountainsPos_x = [341, 1500, 2700];
	mountainPos_Y = height / 3;

	canyon = [
        { pos_x: 240, pos_y: 500, fill: [16, 40, 73], 
        sizeX: 85, sizeY: 100, isFound: false },

        { pos_x: 700, pos_y: 500, fill: [53, 71, 92], 
        sizeX: 85, sizeY: 100, isFound: false },

        { pos_x: 1380, pos_y: 500, fill: [16, 40, 73], 
        sizeX: 85, sizeY: 100, isFound: false },

        { pos_x: 2000, pos_y: 500, fill: [53, 71, 92], 
        sizeX: 85, sizeY: 100, isFound: false },
	];

    scoreCoin = 0;
    flagPole = {isReached: false, x_pos: 2350};

    enemies = [];
    enemies.push(new Enemy(110, 502, 120));
    enemies.push(new Enemy(860, 502, 120));
    enemies.push(new Enemy(1540, 502, 120));
    enemies.push(new Enemy(1730, 502, 120));
    enemies.push(new Enemy(1680, 345, 120));

    platform = [];
    platform.push(createPlatform(100, floor.y_pos - 120, 80));
    platform.push(createPlatform(260, floor.y_pos - 165, 20));
    platform.push(createPlatform(340, floor.y_pos - 240, 80));

    platform.push(createPlatform(1400, floor.y_pos - 110, 24));
    platform.push(createPlatform(1500, floor.y_pos - 155, 20));
    platform.push(createPlatform(1650, floor.y_pos - 155, 210));
}

// ==================== INPUT HANDLING ====================

function keyPressed() {
    // R key to restart (allow anytime)
    if (keyCode == 82) { // R key
        restartGame();
        return;
    }
    
    // Only allow input when actually playing the game (screen 2)
    if (screen != 2) return;
    
    // Block movement input if level is complete
    if (flagPole && flagPole.isReached) return;
    
    // left side --> leftArrow || A
	if (keyCode == 37 || keyCode == 65) {
        isLeft = true;
	}

    // right side --> rightArrow || D
    if (keyCode == 39 || keyCode == 68) {
        isRight = true;
	}

    if (keyCode == 38 || keyCode == 87 || keyCode == 32) {
        if(isFalling == false || onPlatform == true) {
            gameChar_y -= 140;
            if(jumpSound) {
                jumpSound.play();
                jumpSound.setVolume(0.3);
            }
        }
    }
}

function keyReleased() {
    // Only allow input when actually playing the game (screen 2)
    if (screen != 2) return;
    
    // Block input if level is complete
    if (flagPole && flagPole.isReached) return;
    
    // left side -- leftArrow || A
    if (keyCode == 37 || keyCode == 65) {
        isLeft = false;
	}

//right side --> rightArrow || D
    if (keyCode == 39 || keyCode == 68) {
        isRight = false;
    }
}

function mouseClicked() {
    if(screen == 3 && (mouseX > 454 && mouseX < 584 && 
    mouseY > 272 && mouseY < 320)) {
        lives = 3; // Reset lives
        if(deadSound) deadSound.stop();
        startGame(); // Reset all game state
        loop(); // Resume game loop
        screen = 0; // Go back to start screen
    }

    if(screen == 1 && (mouseX > 682 && mouseX < 853 && 
    mouseY > 259 && mouseY < 318)) {
        if(menuGameSound) menuGameSound.stop();
        startGame(); // Reset game state
        loop(); // Ensure game loop is running
        screen = 2; //game
    }

    if(screen == 0 && mouseX > 0 && mouseY > 0) {
        screen = 1; //menu
    }
}

// ==================== WORLD RENDERING ====================

function drawClouds() {
    // Clouds move at 15% of camera speed (parallax effect)
    let cloudOffset = smoothCameraPosX * 0.15;
    
    for (var i = 0; i < clouds.x_pos.length; i++) {
        let cloudX = clouds.x_pos[i] - cloudOffset;
        
        fill(204, 204, 204);
        noStroke();
        ellipse(cloudX, clouds.y_pos[i], clouds.size_1[i], clouds.size_2[i]);

        // Smooth continuous wrapping
        if (clouds.x_pos[i] < -150) {
            clouds.x_pos[i] = width + 150;
        } else {
            clouds.x_pos[i] = clouds.x_pos[i] - 0.1;
        }
    }
}

function drawMountains() {
	for (var i = 0; i < mountainsPos_x.length; i++) {
        fill(53, 71, 92);
        triangle(mountainsPos_x[i] - 20, mountainPos_Y + 400, mountainsPos_x[i] + 180, mountainPos_Y + 25, 
        mountainsPos_x[i] + 390, mountainPos_Y + 400);

        triangle(mountainsPos_x[i] + 70, mountainPos_Y + 400, mountainsPos_x[i] + 355, mountainPos_Y + 185,
        mountainsPos_x[i] + 710,mountainPos_Y + 400);

        triangle(mountainsPos_x[i] + 160, mountainPos_Y + 400, mountainsPos_x[i] + 640, mountainPos_Y + 185,
        mountainsPos_x[i] + 950, mountainPos_Y + 385);

        triangle(mountainsPos_x[i] + 180, mountainPos_Y + 400, mountainsPos_x[i] + 495, mountainPos_Y + 145,
        mountainsPos_x[i] + 820, mountainPos_Y + 400);
	}
}

function drawTrees() {
	for (var i = 0; i < trees_x.length; i++) {
        fill(71, 47, 23);
        rect(trees_x[i] - 155, treePos_y + 190, 20, 25);

        fill(54, 118, 42);
        triangle(trees_x[i] -200, treePos_y +197, trees_x[i] -148, treePos_y +125, trees_x[i] -90, treePos_y +197);
        triangle(trees_x[i] -195, treePos_y +150, trees_x[i] -148, treePos_y +85, trees_x[i] -100, treePos_y +150);
	}
}

// ==================== GAME LOGIC & COLLISIONS ====================

function drawCollectables(coinCollectable) {
	for (var i = 0; i < coinCollectable.length; i++) {
		if (coinCollectable[i].isFound == false) {
            // Bouncing animation for coins
            let coinBounce = sin(frameCount * 0.08 + i * 0.5) * 4;
            
            fill(255, 223, 0);
            ellipse(coinCollectable[i].x_pos, coinCollectable[i].y_pos + coinBounce, 
            coinCollectable[i].size - 31, coinCollectable[i].size - 27);
            
            strokeWeight(1.5);
            stroke(196, 167, 53);
            ellipse(coinCollectable[i].x_pos, coinCollectable[i].y_pos + coinBounce, 
            coinCollectable[i].size - 37, coinCollectable[i].size - 33);
            noStroke();
		}
	}
}

function checkCollectables(coinCollectable) {
	for (var i = 0; i < coinCollectable.length; i++) {
		if (dist(gameChar_x, gameChar_y, coinCollectable[i].x_pos, coinCollectable[i].y_pos) < 25) {
            if (coinCollectable[i].isFound == false) {
                coinCollectable[i].isFound = true
                scoreCoin += 1;
                totalCoinsCollected += 1;
                
                // Create particle effect at coin collection
                createCoinParticles(coinCollectable[i].x_pos, coinCollectable[i].y_pos);
                
                if(coinSound) {
                    coinSound.play();
                    coinSound.setVolume(0.5);
                }
            }
		}
    }   
}

function drawCanyons(r_canyon) {
	for (var i = 0; i < r_canyon.length; i++) {
        fill(r_canyon[i].fill);
        rect(r_canyon[i].pos_x, r_canyon[i].pos_y, r_canyon[i].sizeX, r_canyon[i].sizeY);
	}
}

function checkCanyons(r_canyon) {
	for(var i = 0; i < r_canyon.length; i++) {
		if ((gameChar_x >= r_canyon[i].pos_x && gameChar_x <= r_canyon[i].pos_x +85 || gameChar_x <= floor.x_pos) 
        && gameChar_y >= 489) {
            canyon.isFound = true; // Fixed: was r_canyon.isFound
		}
	}
}

function checkPoint() {
    // flag
    if( flagPole.isReached == true) {
        fill(255);
        rect(flagPole.x_pos, floor.y_pos - 96, 40, 72);
        fill(0, 0, 0);
        triangle(flagPole.x_pos +5, floor.y_pos - 70, flagPole.x_pos + 21, floor.y_pos - 40,
        flagPole.x_pos + 38, floor.y_pos - 70);

        fill(255);
        ellipse(flagPole.x_pos +21, floor.y_pos - 60, 26, 26);
        fill(0);
        triangle(flagPole.x_pos +5, floor.y_pos - 50, flagPole.x_pos + 21, floor.y_pos - 80, 
        flagPole.x_pos + 38, floor.y_pos - 50);

        fill(255);
        ellipse(flagPole.x_pos +21, floor.y_pos - 60, 12, 12);
    }

    // stem
    strokeWeight(4);
    stroke(210,105,30);
    line(flagPole.x_pos, floor.y_pos, flagPole.x_pos, floor.y_pos - 105);
    line(flagPole.x_pos +42, floor.y_pos, flagPole.x_pos +42, floor.y_pos - 105);
    noStroke();
    fill(210,105,30);
    ellipse(flagPole.x_pos, floor.y_pos - 105, 8, 8);
    ellipse(flagPole.x_pos +42, floor.y_pos - 105, 8, 8);
}

function checkFlagPole() {
    if(gameChar_x >= flagPole.x_pos) {
        flagPole.isReached = true;
    }
}

function checkIfDie() {
    if(isPlummeting == true) {
        lives = lives -1;

        if(lives >= 1) {
            startGame();
        }
    }
}

function restartGame() {
    window.location.reload();
}

function loadScreen() {
    // One of Google Chrome's privacy principles is that sounds can only be played when interacting with the screen.
    // The "loadScreen" function was designed to comply with this principle.
    // The following message appears on the screen: "Click to start the game." 
    // The game menu appears after the user interacts with the screen, activating the sound.

    background(16, 40, 73);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(30);
    text("Click to start the game", width/2, height/2);
    textAlign(LEFT, BASELINE); // Reset text alignment
    if(deadSound) deadSound.stop();
}

// ==================== SCREEN & STATE ====================

function createPlatform(x, y, length) {
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function() {
            // Base platform
            fill(36, 135, 55);
            rect(this.x, this.y, this.length, 8, 8);
            
            // Gradient highlight on top
            for(let i = 0; i < this.length; i += 4) {
                let gradientAlpha = 255 * (1 - i / this.length);
                fill(100, 200, 100, gradientAlpha * 0.4);
                rect(this.x + i, this.y, 4, 4, 2);
            }
        },
        checkPlatform: function(char_x, char_y) {
            if(char_x > this.x - 10 && char_x < this.x + this.length) {
                var d = this.y - char_y;
                if(d >= 0 && d < 2) {
                    return true;
                }
            }
            return false;
        }
    }
    return p;
}

function Enemy(x, y, range) {
    this.x = x;
    this.y = y;
    this.range = range;

    this.current_x = x;
    this.inc = 1.4;
    this.facingLeft = false; // Instance-specific direction

    this.update = function() {
        this.current_x += this.inc;
        if(this.current_x > this.x + this.range) {
            this.inc = -1.4;
            this.facingLeft = true;
        }
        if(this.current_x < this.x) {
            this.inc = 1.4;
            this.facingLeft = false;
        }
    }

    this.draw = function() {
        this.update();
        createEnemies(this.current_x, this.y, this.facingLeft);
    }
    this.checkEnemies = function(char_x, char_y) {
        var d = dist(char_x, char_y, this.current_x, this.y);
        if(d < 30) {
            return true;
        }
        return false;
    }
}

function createEnemies(current_x, current_y, facingLeft) {
    // left 
    if(facingLeft == true) {
        //Head and body
		fill(216, 31, 50); //color
		ellipse(current_x - 9, current_y - 47, 17.5, 19);
		stroke(216, 31, 50);//color
		strokeWeight(11);
		line(current_x - 4.8, current_y - 32, current_x + 1, current_y - 14);

		//legs and arms
		strokeWeight(4);
		line(current_x - 2, current_y - 33.2, current_x + 10.5, current_y - 27.7);
		line(current_x - 2, current_y - 31.2, current_x + 10.5, current_y - 24.7);

		line(current_x + 3, current_y - 11, current_x - 1, current_y - 4);
		line(current_x - 1, current_y - 4, current_x + 3, current_y );
		line(current_x - 1, current_y - 9, current_x - 3, current_y - 4);
		line(current_x - 3, current_y - 4, current_x , current_y );

		//Face and mask
		strokeWeight(1);
		fill(255);
		ellipse(current_x - 10.6, current_y - 49, 14, 7);
		noStroke();
		fill(0);
		ellipse(current_x - 11.2, current_y - 48.6, 2.3, 3.5);

		stroke(0);
		strokeWeight(0.7);
		line(current_x - 13, current_y - 49.5, current_x - 9, current_y - 50.5);
		strokeWeight(1);
        noStroke();
    } else { 
        //right 

        //Head and body
		fill(216, 31, 50); //color
		ellipse(current_x + 9, current_y - 47, 17.5, 19);
		stroke(216, 31, 50);//color
		strokeWeight(11);
		line(current_x + 4.8, current_y - 32, current_x - 1, current_y - 14);

		//legs and arms
		strokeWeight(4);
		line(current_x + 2, current_y - 33.2, current_x - 10.5, current_y - 27.7);
		line(current_x + 2, current_y - 31.2, current_x - 10.5, current_y - 24.7);

		line(current_x - 3, current_y - 11, current_x + 1, current_y - 4);
		line(current_x + 1, current_y - 4, current_x - 3, current_y);
		line(current_x + 1, current_y - 9, current_x + 3, current_y - 4);
		line(current_x + 3, current_y - 4, current_x , current_y);

		//Face and mask
		strokeWeight(1);
		fill(255); //color
		ellipse(current_x + 10.6, current_y - 49, 14, 7);
		noStroke();
		fill(0); //color
		ellipse(current_x + 11.2, current_y - 48.6, 2.3, 3.5);

		stroke(0);
		strokeWeight(0.7);
		line(current_x + 13, current_y - 49.5, current_x + 9, current_y - 50.5);
		strokeWeight(1);
        noStroke();
    }
}

function createCoinParticles(x, y) {
    for(let i = 0; i < 8; i++) {
        particles.push(new Particle(x, y));
    }
}

function createHitEffect(x, y) {
    particles.push(new HitEffect(x, y));
}