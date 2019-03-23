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

function generateRenderMap( image, resolution ) {
    var pixelMap = [];
    //console.log(image.width,image.height);
	for( var y = 0; y < image.width; y=y+resolution ) {
		for( var x = 0; x < image.height; x=x+resolution ) {
            var data = Context.context.getImageData(x,y,1,1).data[1];
            if (data < 0) {

            pixelMap.push( { x:x, y:y } );
            }
            
			}
        }
        
	return {
		pixelMap
	};
}

function pixelHitTest( source, target ) {
	// Loop through all the pixels in the source image
	for( var s = 0; s < source.pixelMap.length; s++ ) {
		var sourcePixel = source.pixelMap[s];
		// Add positioning offset
		var sourceArea = {
			x: sourcePixel.x + source.x,
			y: sourcePixel.y + source.y,
			width: 1,
			height: 1
		};
 
		// Loop through all the pixels in the target image
		for( var t = 0; t < target.pixelMap.length; t++ ) {
			var targetPixel = target.pixelMap[t];
			// Add positioning offset
			var targetArea = {
				x: targetPixel.x + target.x,
				y: targetPixel.y + target.y,
				w: 1,
				h: 1
			};
 
			/* Use the earlier aforementioned hitbox function */
			if( hitBox( sourceArea, targetArea ) ) {
				return true;
			}
		}
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
    this.spd = 4;
    this.sprite;
    this.pixelMap;
};

var asteroid = function () {
    this.id = null;
    this.x = 0;
    this.y = 0;
    this.h = 32;
    this.w = 32;
    this.sprite;
    this.speed = 4;
    this.pixleMap;
}

function create_asteroid() {
    var id = asteroids.length + 1;
    var temp = new asteroid();
    temp.id = id;
    var image_number = Math.floor(Math.random() * 3);
    asteroid_sprites = ["assets/Asteroid_V1.png", "assets/Asteroid_V2.png", "assets/Asteroid_V3.png"];
    temp.sprite = new Sprite(asteroid_sprites[image_number],false);
    var pixleMap = generateRenderMap(temp.sprite.image,1);
    temp.x = Math.floor(Math.random() * canvas.width);
    temp.y = -30;
    temp.pixleMap = pixleMap;
   
    asteroids.push(temp);
};

function create_player() {
    player = new player();
    var spr = new Sprite("assets/Ship_V2.png", false);
    var psmap = generateRenderMap(spr,1);
    player.sprite = spr;
    player.pixleMap = psmap;
    //console.log(psmap.data);
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

    //creates a new asteroid
    create_asteroid();

    //creates a new player object
    create_player();

    // declare asteroidSpeed
       var asteroidSpeed = 3; 
    loop = function () {
        
        // if there isnt enough asteroids, create some 
        if  (asteroids.length < 20) {
            create_asteroid();
        }

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
        Context.context.fillStyle = "#FFFFFF";
        Context.context.fillRect(player.x,player.y,1,1);
       // player.x + player.h/2, " : player x", player.y + player.h/2, " : player y");



        //loop through asteroids
        for (var i = 1; i < asteroids.length; i++) {
            // if the asteroids exsit then
            if (asteroids[i] != undefined) {

        
                if (pixelHitTest(player,asteroids[i])){
                     window.alert("REE");
               };

                //move them downward
                asteroids[i].y += asteroidSpeed;
                Context.context.strokeStyle = "#FFFFFF";
                Context.context.fillRect(asteroids[i].x,asteroids[i].y,1,1);
                Context.context.clearRect(asteroids[i].x,asteroids[i].y,1,1);
                Context.context.strokeRect(asteroids[i].x,asteroids[i].y,1,1);
                asteroids[i].sprite.rotate(asteroids[i].x,asteroids[i].y);
               
                // if they fall ouside the map delete them form the array
                if (asteroids[i].y > 640) {
                    asteroids.remove(i);
            }
        }

        }// end of for loop

        // call update when the browser is ready to draw again
        window.requestAnimationFrame(loop);
    } // end of game loop

    window.addEventListener("keydown", controller.keyListener)
    window.addEventListener("keyup", controller.keyListener);
    window.requestAnimationFrame(loop);

      // scoring stuff
    



      var score = 0;
      // speeds up the asteroids when score is higher
     setInterval(function() {
       if (score>5000){
           score = score + 12;
           asteroidSpeed = 8.5;
       }else if (score>4000){
           score = score + 11;
           asteroidSpeed = 8;
       }else if (score>3000){
           score = score + 10;
          asteroidSpeed = 7.5;
       }else if (score>2500){
           score = score + 9;
          asteroidSpeed = 7;
       } else if (score>2000){
           score = score + 8;
            asteroidSpeed = 6.5;
       }else if (score>1500){
           score = score + 7;
           asteroidSpeed = 6;
       }else if (score>1000){
           score = score + 6;
           asteroidSpeed = 5.5;
       }else if (score>750){
           score = score + 5;
           asteroidSpeed =5;
       }else if (score>500){
           score = score + 4;
           asteroidSpeed = 4.5;
       }else if (score>300){
           score = score + 3;
           asteroidSpeed = 4;
       }else if (score>100){
           // banner showing you reached next level
           score = score + 2;
           asteroidSpeed = 3.5;
       }else{
        score = score + 1;
        
       }
      
   
       document.getElementById("score").innerHTML = score;
   
     }, 200);
});