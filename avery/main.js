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
        if (is_pattern)
            this.pattern = Context.context.createPattern(this.image, 'repeat');
    } else
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

// mesure diestance to
function distanceto(x1, y1, x2, y2) {
    var sumx = (x2 - x1);
    sumx = sumx * sumx
    var sumy = (y2 - y1)
    sumy = sumy * sumy
    var dis = Math.sqrt(sumx + sumy)
    return dis;
};

function place_meeting_circle(r1, x1, y1, r2, x2, y2) {
    var circle1 = {
        radius: r1,
        x: x1,
        y: y2
    };
    var circle2 = {
        radius: r2,
        x: x2,
        y: y2
    };
    var dx = circle1.x - circle2.x;
    var dy = circle1.y - circle2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < circle1.radius + circle2.radius) {
        return 1;
    }
}

function place_meeting(x1,y1,w1,h1,x2,y2,w2,h2) {
var rect1 = {x: x1, y: y1, width: w1, height: h1}
var rect2 = {x: x2, y: y2, width: w2, height: h2}

if (rect1.x < rect2.x + rect2.width &&
   rect1.x + rect1.width > rect2.x &&
   rect1.y < rect2.y + rect2.height &&
   rect1.y + rect1.height > rect2.y) {
       return 1; 
}
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
    this.centx = this.x + this.w/2;
    this.centy = this.y + this.h/2;
    this.spd = 4;
    this.hsp = 0;
    this.vsp = 0;
    this.collision_radius = this.h / 2;
    this.sprite = "Ship_V2.png";

};

var asteroid = function () {
    this.id = null;
    this.x = 0;
    this.y = 0;
    this.h = 32;
    this.centx = this.x + this.w/2;
    this.centy = this.y + this.h/2;
    this.w = 32;
    this.hsp = 0;
    this.vsp = 0;
    this.angle = Math.floor(Math.random() * 360);

}

function create_astroid() {
    var id = asteroids.length + 1;
    var temp = new asteroid();
    temp.id = id;

    var image_number = Math.floor(Math.random() * 3);
    var spin = Math.floor(Math.random() * 3);
    asteroid_sprites = ["Asteroid_1.png", "Asteroid_2.png", "Asteroid_3.png"];
    temp.sprite = asteroid_sprites[image_number];


    var _x = Math.floor(Math.random() * canvas.width);
    var _y = -30;
    temp.x = _x
    temp.y = _y
    asteroids.push(temp);

};

Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

//jquery (wait for all assets to load)
$(document).ready(function () {


    //links the canvas tag to the javascript file
    Context.create("canvas");



    asteroids = [];
    create_astroid()

    //creates a new player object
    player = new player();

    // create sprite with that image
    var spr_player = new Sprite(player.sprite, false);
    var spr_asteroid_1 = new Sprite("Asteroid_1.png", false);
    var spr_asteroid_2 = new Sprite("Asteroid_2.png", false);
    var spr_asteroid_3 = new Sprite("Asteroid_3.png", false)
    //var spr_asteroid = new Sprite(gameobjects[0].sprite,false);

    setInterval(function () {
        create_astroid()

    }, 150);


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

        //draw player
        spr_player.draw(player.x, player.y, player.width, player.height);

       // player.x + player.h/2, " : player x", player.y + player.h/2, " : player y");

        //loop through asteroids
        for (var i = 1; i < asteroids.length; i++) {
            // if the asteroids exsit then
            if (asteroids[i] != undefined) {

                //move them downward
                asteroids[i].y += 4;
                
                // if they collide with the player
                if (place_meeting(player.centx,player.centy,player.w,player.h,asteroids[i].centx,asteroids[i].centy,asteroids[i].w,asteroids[i].h)) {
                    console.log("hit");
                }

                // draw the asteroids
                if (asteroids[i].sprite == "Asteroid_1.png") spr_asteroid_1.rotate(asteroids[i].x, asteroids[i].y, asteroids[i].angle);
                if (asteroids[i].sprite == "Asteroid_2.png") spr_asteroid_2.rotate(asteroids[i].x, asteroids[i].y, asteroids[i].angle);
                if (asteroids[i].sprite == "Asteroid_3.png") spr_asteroid_3.rotate(asteroids[i].x, asteroids[i].y, asteroids[i].angle);
                
                // if they fall ouside the map delete them form the array
                if (asteroids[i].y > 640) {
                    asteroids.remove(i);

            }
        }

        }// end of for loop

        // up date the center x and y values of the player.
        player.centx = 
        player.centy = 

        // call update when the browser is ready to draw again
        window.requestAnimationFrame(loop);
    } // end of game loop

    window.addEventListener("keydown", controller.keyListener)
    window.addEventListener("keyup", controller.keyListener);
    window.requestAnimationFrame(loop);


});