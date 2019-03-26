
// Declare variables (they are up here becuase they need to be global)
var asteroidspeed = 4;
var score = 0;
var asteroids = [];  //array to store all the asteroids and thier variables
var asteroidrate = 200;
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
var Sprite = function (filename) {
    // create image variable
    this.image = null;
    // converts radians to degrees
    this.TO_RADIANS = Math.PI / 180;
    // this function is to test if the file exists and has a name
    if (filename != undefined && filename != "" && filename != null) {
        //Creates the image object
        this.image = new Image();
        // Variable stores the image file path
        this.image.src = filename;
        // if the sprite is a pattern then
        } else {
        // if the file has no name or doesnt exist print unable to load image
        console.log("IMAGE UNABLE TO LOAD");
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
    };
};

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
    down : false,

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
            case 40 :
                controller.down = key_state;
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
    this.hsp;
    this.vsp;
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

function create_asteroid() {
    var id = asteroids.length + 1;
    var temp = new asteroid();
    temp.id = id;
    var image_number = Math.floor(Math.random() * 3);
    asteroid_sprites = ["assets/Asteroid_V1.png", "assets/Asteroid_V2.png", "assets/Asteroid_V3.png"];
    temp.sprite = new Sprite(asteroid_sprites[image_number]);
    temp.h = temp.sprite.image.height;
    temp.w = temp.sprite.image.width;
    temp.x = Math.floor(Math.random() * canvas.width);
    temp.y = -30;
    temp.spd = asteroidspeed;
    asteroids.push(temp);
};

function create_player() {
    player = new player();
    player.sprite = new Sprite("assets/Ship_V2.png");;
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
            player.hsp = player.spd;
        }

        // if key left is pressed
        if (controller.left) {
            player.hsp = -player.spd;
        }

          // if key left is pressed
          if (controller.up) {
            player.vsp = -player.spd;
        }
          // if key left is pressed
          if (controller.down) {
            player.vsp = player.spd;
        }

        if (controller.down == false && controller.up == false) {
            player.vsp = 0;
        } 
        
        if (controller.left == false && controller.right == false) {
            player.hsp = 0;
        }

        player.y += player.vsp;
        player.x += player.hsp; 
        

        // if the player goes out of the room loop backin
        if (player.x < (0 - player.w / 2)) {
            player.x = (canvas.width + player.w / 2)
        } else if (player.x > (canvas.width + player.w / 2)) {
            player.x = (0 - player.w / 2)
        }


        // prevent the player from exiting the canvas
       
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