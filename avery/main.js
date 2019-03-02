
//create context object to make using canvas easier
var Context = {
    //create some variables within the context object
    canvas : null,
    Context : null,
    //create function that grabs the canvas's context
    create : function(canvas_id_tag) {
        this.canvas = document.getElementById(canvas_id_tag);
        this.context = this.canvas.getContext("2d");
        return this.context;
    }

}


// create sprite object and give is some draw functions
var Sprite = function(filename, is_pattern) {
  
    // create image variable
    this.image = null;

     // this variable is if the sprite is tile or background (yes/no)
    this.pattern = null;

    // converts radians to degrees
    this.TO_RADIANS = Math.PI/180;
    
    // this function is to test if the file exists and has a name
    if (filename != undefined && filename != "" && filename != null)
    {
          //Creates the image object
        this.image = new Image();

        // Variable stores the image file path
        this.image.src = filename;

        //check if the image loaded     
        this.image.onload = function(e) {
            console.log("img loaded"); 
        }
        
        // if the sprite is a pattern then
        if (is_pattern)
            this.pattern = Context.context.createPattern(this.image, 'repeat');
    }
    else
        // if the file has no name or doesnt exist print unable to load image
        console.log("Unable to load sprite.");
    
    // create a draw function for the sprite object
    this.draw = function(x, y, w, h)
    {
        
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
    this.rotate = function(x, y, angle)
    {
        // the next few lines are explained in explanation.md
        Context.context.save();
        Context.context.translate(x, y);
        Context.context.rotate(angle * this.TO_RADIANS);
        Context.context.drawImage(this.image,
                                -(this.image.width/2),
                                -(this.image.height/2));
        
        Context.context.restore();
        // ---------------------------------------------------
    };
        
    
};

controller = {

    left:false,
    right:false,
    up:false,
    keyListener:function(event) {
  
      var key_state = (event.type == "keydown")?true:false;
  
      switch(event.keyCode) {
  
        case 37:// left key
          controller.left = key_state;
        break;
        case 38:// up key
          controller.up = key_state;
        break;
        case 39:// right key
          controller.right = key_state;
        break;
  
      }
  
    }
  
  };

//create player object
var player = function() { 
    this.x = 320;
    this.y = 400;
    this.h = 32;
    this.w = 32;
    this.spd = 4;
    this.hsp = 0;
    this.vsp = 0;
};


//jquery (wait for all assets to load)
$(document).ready(function() {

    //intialize
    //links the canvas tag to the javascript file
    Context.create("canvas");    

  
    // create variable for the player's sprite image
    var player_sprite = "Ship_V1.png";

    // create sprite with that image
    var spr_player = new Sprite(player_sprite,false);

    player = new player();

    loop = function() {

        console.log("tick");

        if (controller.right) {
           player.x += player.spd;

        }

        if (controller.left) {
            player.x -= player.spd;
        }
        
        // if the player goes out of the room loop backin
        if (player.x < (0 - player.w/2)) {
            player.x = (canvas.width + player.w/2)
        } else if (player.x > (canvas.width + player.w/2)) {
            player.x = (0 + player.w/2)
        }
        

           //paint the background black
           Context.context.fillStyle = "#000000";
           Context.context.fillRect(0,0,800,800);
   
           //draw player
           spr_player.draw(player.x,player.y,player.width,player.height);

          // call update when the browser is ready to draw again
        window.requestAnimationFrame(loop);
    }

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);

    
});