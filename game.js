var asteroidspeed = 4;

var score = 0;

//create context object to make using canvas easier
var Context = {
    //create some variables within the context object
    canvas: null,
    Context: null,
    //create function that grabs the canvas's context
    create: function (canvas_id_tag) {
        this.canvas = document.getElementById(canvas_id_tag);
        this.context = this.canvas.getContext("2d");
        return this.context;
    }

}

// create sprite object and give is some draw functions
var Sprite = function (filename, is_pattern) {

    // create image variable
    this.image = null;

    // this variable is if the sprite is tile or background (yes/no)
    this.pattern = null;

    // converts radians to degrees
    this.TO_RADIANS = Math.PI / 180;

    // this function is to test if the file exists and has a name
    if (filename != undefined && filename != "" && filename != null) {
        //Creates the image object
        this.image = new Image();
        // Variable stores the image file path
        this.image.src = filename;

        //check if the image loaded     
        this.image.onload = function (e) {
            console.log("img loaded");
        }

        // if the sprite is a pattern then
        if (is_pattern) {
            this.pattern = Context.context.createPattern(this.image, 'repeat');
        }
    } else {
        // if the file has no name or doesnt exist print unable to load image
        console.log("Unable to load sprite.");

    // create a draw function for the sprite object
    this.draw = function (x, y, w, h) {

        // check if the sprite is a pattern 
        if (this.pattern) {
            //create fill style with image
            Context.context.fillStyle = this.pattern;
            //fill area (w,h) with the tiled image
            Context.context.fillRect(x, y, w, h);

        } else {

            // if its not a pattern then draw sprite normaly

            // if the width is value is not give, then use the sprites regular dimentions
            if (!w) {
                Context.context.drawImage(this.image, x, y,
                    this.image.width,
                    this.image.height);
            } else {

                // if a w is set then strech the image to that value
                Context.context.drawImage(this.image, x, y, w, h);

            }
        }
    };
}



    // create a rotation function for the sprite
    this.rotate = function (x, y, angle) {
        // the next few lines are explained in explanation.md
        Context.context.save();
        Context.context.translate(x, y);
        Context.context.rotate(angle * this.TO_RADIANS);
        Context.context.drawImage(this.image,
            -(this.image.width / 2),
            -(this.image.height / 2));

        Context.context.restore();
        // ---------------------------------------------------
    };


};

function hitBox( source, target ) {
	/* Source and target objects contain x, y and width, height */
	return !(
		( ( source.y + source.h) < ( target.y ) ) ||
		( source.y > ( target.y + target.h) ) ||
		( ( source.x + source.w ) < target.x ) ||
		( source.x > ( target.x + target.w) )
	);
}

function hitCicle (source, target){ 
    var d = source.h/2 + target.h/2;
    var x = source.x - target.x;
    var y = source.y - target.y;
    if (d > Math.sqrt((x * x) + (y * y))) return 1;
}

// Keyboard setup
controller = {

    left: false,
    right: false,
    up: false,
    keyListener: function (event) {

        var key_state = (event.type == "keydown") ? true : false;

        switch (event.keyCode) {

            case 37: // left key
                controller.left = key_state;
                break;
            case 38: // up key
                controller.up = key_state;
                break;
            case 39: // right key
                controller.right = key_state;
                break;
            case 82 :
            location.reload();
            break;

        }

    }

};

//create player object
var player = function () {
    this.id = 0;
    this.x = 320;
    this.y = 400;
    this.h = 32;
    this.w = 32;
    this.spd = 3.4;
    this.sprite;
};

var asteroid = function () {
    this.id = null;
    this.x = 0;
    this.y = 0;
    this.h;
    this.w;
    this.sprite;
    this.speed = 2;
}

var explosion = function () {
    this.x = player.x
    this.y = player.y
    this.sprite; 
}

function create_explosion() {
    explosion = new explosion();
    explosion.sprite = new Sprite("assets/explosion.gif", false);
}

function create_asteroid() {
    var id = asteroids.length + 1;
    var temp = new asteroid();
    temp.id = id;
    var image_number = Math.floor(Math.random() * 3);
    asteroid_sprites = ["assets/Asteroid_V1.png", "assets/Asteroid_V2.png", "assets/Asteroid_V3.png"];
    temp.sprite = new Sprite(asteroid_sprites[image_number],false);
    temp.h = temp.sprite.image.height;
    temp.w = temp.sprite.image.width;
    temp.x = Math.floor(Math.random() * canvas.width);
    temp.y = -30;
    temp.spd = asteroidspeed;
    asteroids.push(temp);
};

function create_player() {
    player = new player();
    var spr = new Sprite("assets/Ship_V2.png", false);
    player.sprite = spr;
}

//remove script
Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

//jquery (wait for all assets to load)
$(document).ready(function () {

    

    //links the canvas tag to the javascript file
    Context.create("canvas");

    //array to store all the asteroids and thier variables
    asteroids = [];

    
    var asteroidrate = 200;

    //creates a new asteroid
    create_asteroid();

    //creates a new player object
    create_player();

    
    setInterval(function(){ 
        create_asteroid();
    }, asteroidrate);

    loop = function () {
        // if key right is pressed
        if (controller.right) {
            player.x += player.spd;

        }

        // if key left is pressed
        if (controller.left) {
            player.x -= player.spd;
        }

        // if the player goes out of the room loop backin
        if (player.x < (0 - player.w / 2)) {
            player.x = (canvas.width + player.w / 2)
        } else if (player.x > (canvas.width + player.w / 2)) {
            player.x = (0 + player.w / 2)
        }

        //paint the background black
        Context.context.fillStyle = "#000000";
        Context.context.fillRect(0, 0, 800, 800);
        Context.context.restore();

        //draw player
        player.sprite.rotate(player.x, player.y,);

        //loop through asteroids
        for (var i = 1; i < asteroids.length; i++) {
            // if the asteroids exsit then
            if (asteroids[i] != undefined) {

                if (hitCicle(asteroids[i],player)) {
                    player.spd = 0;
                    player.sprite = new Sprite("assets/whitecircle.png",false);
                    window.location.href = "Highscore.html";
                }
                
                //move them downward
                asteroids[i].y += asteroidspeed;
                asteroids[i].sprite.rotate(asteroids[i].x,asteroids[i].y);
               
                // if they fall ouside the map delete them form the array
                if (asteroids[i].y > 640) {
                    asteroids.remove(i);
                    score = score + 1;
                    //console.log(score);
                    // speeds up the asteroids when score is higher
                     document.getElementById("score").innerHTML = score;
                
                     if (score % 50 == 0) {
                         asteroidspeed += 0.4
                     }

                     if (score % 100 == 0) {
                         asteroidrate += 1;
                     }
                
            }
        }

        
        }// end of for loop

        // call update when the browser is ready to draw again
        window.requestAnimationFrame(loop);
    } // end of game loop

    window.addEventListener("keydown", controller.keyListener)
    window.addEventListener("keyup", controller.keyListener);
    window.requestAnimationFrame(loop);
});