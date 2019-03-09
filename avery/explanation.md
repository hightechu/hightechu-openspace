## This document is for more in-depth explanations that are too long to comment... 

# 1) What does beginPath() do ???

beginPath() is a function that is used what drawing lines or shapes in js. it basically tells us that we are done drawing something so we can begin drawing something else. that way not everything is connected in one big drawing instead of separate ones. For more info on drawing on canvas visit 

https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes


# 2) Handling rotation in canvas

This is the code block here 

~~~~
Context.context.save();
Context.context.translate(x,y);
Context.context.rotate(angle * this.TO_RADIANS);
Context.context.drawImage(this.image,-(this.image.width/2),-(this.image.height/2));
Context.context.restore();
~~~~

First, of We grab the current state of the canvas with the save() function.


To rotate the image itself. we do this by using the built-in variable angle. This is also where our helper variable TO_RADIANS comes in handy. The "angle" variable is in radians, but we can change that to degrees with the TO_RADIANS. There is a bunch of complicated math that goes along with that but I don't really understand it.

To make sure it rotates around the center we pass 
~~~~
-(this.image.width/2)
~~~~
into the x and y respectively

The last but not least we use .restore() to make sure we only rotate the one sprite and not everything on the canvas
~~~~
Context.context.restore() 
~~~~

![diagram](https://i.stack.imgur.com/j2R0B.png)

# 3) time interval tick
 
 This is the main gameplay loop and everything within it will be updated every 'x' times a second.

~~~~
 loop = function() {
    //main game loop goes here.
 }
~~~~

This function asks the browser when the next update is and runs loop() 
window.requestAnimationFrame(loop);
 

# 4 ) How to keep track of the asteroids
In the game there are multiple asteroids but they all behave the same. So instead of creating multiple objects for each asteroid, I just created one object and made multiple instances of that object. I stored each instance in the array called asteroids[]. Then to create a new asteroid I use the function create_asteroid(). Which basicly does the following...
~~~~
function create_asteroid {

   //create temporary variable to store the new object.
   var asteroid = new asteroid();

   //set some of the local variables within the object.

   // then add the new asteroid to the asteroids array.
   asteroids.push(asteroid);
}
~~~~
This way we can manuplulate the data inside asteroids by using

~~~~
asteroids[id].variable
~~~~

This comes in handy later when we want to do something to all asteroids. all we have to do now is loop through all of them.
```
// for every asteroid
For(var i = 0; i < asteroids.length; i++) {

   //move every asteroid down at 4 pixels/frame;
   asteroids[i].y += 4; 
}
```
# 5) Collision 
https://orion.math.iastate.edu/dept/links/formulas/form2.pdf
