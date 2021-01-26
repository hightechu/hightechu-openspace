import { Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs'; 

import Phaser from 'phaser';

@Injectable({
  providedIn: 'root'
})

export class GameDataService extends Phaser.Scene {

  gameInstance: Phaser.Game;
  game2: boolean = false;  
 
  starmap1;
  starmap2;
  ship; 
  healthBar;

  score;
  checkpoint = 1; 
  scoreText;
  asteroids;
  shipLasers; 
  enemyShips;

  rank;

  enemyZoneBoxLeft;
  enemyZoneBoxRight;
  spawnDetector;

  enemyGoingLeft = null; 
  enemyGoingRight = null;

  enemyLasers; 

  currentAsteroid = null;
  asteroidHitShip = null;
  currentShipLaser = null; 
  currentEnemyLaser = null;
  currentEnemy = null;
  currentLaserEnemy = null;

  // asteroid spawning timers
  timeSinceAsteroid = 0;
  asteroidSpawnMultiplyer = 100; 
  randomAsteroidSpawnTime = Math.floor(Math.random() * 50) + this.asteroidSpawnMultiplyer; 

  // player lasers managment
  canShoot = true;
  timeSinceShot = 0;


  timeSincePoints = 0;
  timeSinceEnemyShot = 0;

  timeSinceEnemySpawned = 0;
  timeSinceEnemyDestroyed = 0;
  enemyDestroyed = true;

  popoverService; 

  colorCounter = 0; 

  constructor() {
      super({
        key: "GameScene"
      });
  }


  init(params): void {
    this.popoverService = params; 
    this.score = 0; 
    this.asteroidSpawnMultiplyer = 100;
    this.timeSinceEnemySpawned = 0;
  }

  preload(): void {
      this.load.image('stars1', '../../../assets/sprites/stars1.png'); 
      this.load.image('stars2', '../../../assets/sprites/stars2.gif');
      this.load.image('HUD', '../../../assets/sprites/hud.png');
      this.load.image('screenBorder', '../../../assets/sprites/screenBorder.png');
      this.load.image('enemyCollisionBox', '../../../assets/sprites/collideBox.png');
      this.load.image('enemyCollisionBox', '../../../assets/sprites/spawnDetectorField.png');

      this.load.spritesheet('enemyShip', '../../../assets/sprites/enemyShipSheet.png',{
        frameWidth: 68, 
        frameHeight: 80
       });       

      this.load.spritesheet('ship', '../../../assets/sprites/shipSheet3.png',{ 
        frameWidth: 68, 
        frameHeight: 80
       }); 

      this.load.spritesheet('asteroid', '../../../assets/sprites/asteroid1.png',{ 
        frameWidth: 68, 
        frameHeight: 68
       }); 

       this.load.spritesheet('shipLaser', '../../../assets/sprites/shipLaser.png',{
        frameWidth: 36, 
        frameHeight: 32
       });

       this.load.spritesheet('enemyLaser', '../../../assets/sprites/enemyLaser.png',{
        frameWidth: 48, 
        frameHeight: 32
       });
       
  } // preload function
    
  create(): void {


      const width = this.scale.width;
      const height = this.scale.height; 
      // backgrounds
      this.starmap1 = this.add.tileSprite(0, 0, width, height, 'stars1').setOrigin(0, 0);
      this.starmap2 = this.add.tileSprite(0, 0, width*2, height*2, 'stars2').setOrigin(0, 0).setScale(0.5);
      

      // player
      this.ship = this.physics.add.sprite(400, 550, 'ship').setScale(1);
      this.ship.setCollideWorldBounds(true);
      this.ship.health = 6;
      // player animations
      this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 1 }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'straightDown',
        frames: this.anims.generateFrameNumbers('ship', { start: 2, end: 3 }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'straightUp',
        frames: this.anims.generateFrameNumbers('ship', { start: 4, end: 5 }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'straightLeft',
        frames: this.anims.generateFrameNumbers('ship', { start: 6, end: 7 }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'downLeft',
        frames: this.anims.generateFrameNumbers('ship', { start: 8, end: 9 }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'upLeft',
        frames: this.anims.generateFrameNumbers('ship', { start: 10, end: 11 }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'straightRight',
        frames: this.anims.generateFrameNumbers('ship', { start: 12, end: 13 }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'downRight',
        frames: this.anims.generateFrameNumbers('ship', { start: 14, end: 15 }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'upRight',
        frames: this.anims.generateFrameNumbers('ship', { start: 16, end: 17 }),
        frameRate: 10,
        repeat: -1
      });

        // asteroid animation
        this.anims.create({
          key: 'asteroidFly', 
          frames: [ { key: 'asteroid', frame: 0 } ],
          frameRate: 10,
        });
        this.anims.create({
          key: 'asteroidExplode',
          frames: this.anims.generateFrameNumbers('asteroid', { start: 1, end: 5 }),
          frameRate: 15,
          repeat: 1
        });

        //ship laser animation
        this.anims.create({
          key: 'shipLaserFly', 
          frames: [ { key: 'shipLaser', frame: 0 } ],
          frameRate: 10,
        });
        this.anims.create({
          key: 'shipLaserExplode',
          frames: this.anims.generateFrameNumbers('shipLaser', { start: 1, end: 5 }),
          frameRate: 25,
          repeat: 1
        });

        //enemy laser animation
        this.anims.create({
          key: 'enemyLaserFly', 
          frames: [ { key: 'enemyLaser', frame: 0 } ],
          frameRate: 10,
        });
        this.anims.create({
          key: 'enemyLaserExplode',
          frames: this.anims.generateFrameNumbers('enemyLaser', { start: 1, end: 5 }),
          frameRate: 25,
          repeat: 1
        });

        //enemy ship animations
        this.anims.create({
          key: 'enemyMoveLeft', 
          frames: this.anims.generateFrameNumbers('enemyShip', { start: 4, end: 5 }),
          frameRate: 10,
          repeat: -1
        });
        this.anims.create({
          key: 'enemyMoveRight',
          frames: this.anims.generateFrameNumbers('enemyShip', { start: 2, end: 3 }),
          frameRate: 10,
          repeat: -1
        });
        this.anims.create({
          key: 'enemyShipDestroyed',
          frames: this.anims.generateFrameNumbers('enemyShip', { start: 6, end: 8 }),
          frameRate: 25,
          repeat: 1
        });
      
      // asteroids group (start's empty)
      this.asteroids = this.physics.add.group();
      this.physics.add.collider(this.ship, this.asteroids, function (player, asteroid) {
        this.asteroidHitShip = asteroid;
      }, null, this);


      // ship laser group (start's empty)
      this.shipLasers = this.physics.add.group();
      this.physics.add.collider(this.shipLasers, this.asteroids, function (shipLaser, asteroid) {
        this.currentAsteroid = asteroid;
        this.currentShipLaser = shipLaser; 
      }, null, this);
      

      // enemy ship group (start's empty)
      this.enemyShips = this.physics.add.group();
      this.physics.add.collider(this.shipLasers, this.enemyShips, function (shipLaser, enemyShip) {
        this.currentEnemy = enemyShip;
        this.currentShipLaser = shipLaser; 
      }, null, this);
      

      // enemy laser group (start's empty)
      this.enemyLasers = this.physics.add.group();
      this.physics.add.collider(this.ship, this.enemyLasers, function (player, enemyLaser) {
        this.currentEnemyLaser = enemyLaser; 
      }, null, this);

      // invisible collision box groups 
      this.enemyZoneBoxLeft = this.physics.add.group();
      this.physics.add.collider(this.enemyShips, this.enemyZoneBoxLeft, function (enemyShip, leftBox) {
        this.enemyGoingRight = enemyShip;
      }, null, this);

      this.enemyZoneBoxRight = this.physics.add.group();
      this.physics.add.collider(this.enemyShips, this.enemyZoneBoxRight, function (enemyShip, rightBox) {
        this.enemyGoingLeft = enemyShip;
      }, null, this);

      this.spawnDetector = this.physics.add.group();
      this.physics.add.collider(this.enemyShips, this.spawnDetector, function (enemyShip, topBox) {
        //console.log("contact");
        this.currentLaserEnemy = enemyShip;
      }, null, this);

      this.enemyZoneBoxLeft = this.makeEnemyZoneBoxLeft();
      this.enemyZoneBoxRight = this.makeEnemyZoneBoxRight();
      this.spawnDetector = this.makeSpawnDetector();

      //healthBar
      this.add.image(0, 0, 'HUD').setOrigin(0, 0).setScale(1); 
      this.healthBar = this.makeBar(114, 18, 0x2FF875);
      this.healthBar.scaleX = 1;

      //score counter number
      this.scoreText = this.add.text(384, 12, ' 0', {fontSize: '24px', color: 'white'});

      //rank display
      this.rank = this.add.text(580, 12, ' ', {fontSize: '24px', color: 'white'});

      //white border around the game area
      this.add.image(0, 0, 'screenBorder').setOrigin(0, 0).setScale(1); 

  } // phaser create

  /**
   * UPDATE FUNCTION
   * 
   */

  update(time): void {

    // background color change
    if (this.colorCounter > 20) {
      //this.startColor++; 
      this.cameras.main.setBackgroundColor(`rgb(${this.popoverService.r}, ${this.popoverService.g}, ${this.popoverService.b})`);
      this.colorCounter = 0; 
    } 
    this.colorCounter++; 

    // checkpoint popup every 1000 points gained
    if (this.score > 500*this.checkpoint) {
      this.popoverService.popover("checkpoint"); 
      this.checkpoint++; 
    }

    //if asteroid is shot by player
    if (this.currentAsteroid != null) {
      this.currentAsteroid.anims.play('asteroidExplode', true);
      this.currentAsteroid.once("animationrepeat", () => {
        if (this.currentAsteroid != null) {
          this.currentAsteroid.destroy();
          this.score += 50;
          this.scoreText.setText(' ' + this.score);
          this.currentAsteroid = null;  
        }
      });
    }

    //if enemy ship is shot by player
    if (this.currentEnemy != null) {
      this.currentEnemy.anims.play('enemyShipDestroyed', true);
      this.currentEnemy.once("animationrepeat", () => {
        if (this.currentEnemy != null) {
          this.currentEnemy.destroy();
          this.score += 200;
          this.scoreText.setText(' ' + this.score);
          this.enemyDestroyed = true;
          this.currentEnemy = null;
          this.currentLaserEnemy = null; 
        }
      });
    }

    //if asteroid hits player ship
    if (this.asteroidHitShip != null) {
      this.asteroidHitShip.anims.play('asteroidExplode', true);
      this.asteroidHitShip.once("animationrepeat", () => {
        if (this.asteroidHitShip != null) {
          this.asteroidHitShip.destroy();
          this.healthBar.scaleX = this.healthBar.scaleX-0.1;
          this.asteroidHitShip = null;  
        }
      });
    }

    //ship laser explosion animation
    if (this.currentShipLaser != null) {
      this.currentShipLaser.anims.play('shipLaserExplode', true);
      this.currentShipLaser.once("animationrepeat", () => {
        if (this.currentShipLaser != null) {
          this.currentShipLaser.destroy();
          this.currentShipLaser = null;  
        }
      });
    }

    //if enemy laser hits player ship
    if (this.currentEnemyLaser != null) {
      this.currentEnemyLaser.anims.play('enemyLaserExplode', true);
      this.currentEnemyLaser.once("animationrepeat", () => {
        if (this.currentEnemyLaser != null) {
          this.currentEnemyLaser.destroy();
          this.healthBar.scaleX = this.healthBar.scaleX-0.1;
          this.currentEnemyLaser = null;  
        }
      });
    }

    //basic enemy movement logic
    if (this.enemyGoingLeft != null) {
      this.enemyGoingLeft.anims.play('enemyMoveLeft', true);
      this.enemyGoingLeft.setVelocityX(-200).setVelocityY(0);
      this.enemyGoingLeft = null;  
    }

    if (this.enemyGoingRight != null) {
      this.enemyGoingRight.anims.play('enemyMoveRight', true);
      this.enemyGoingRight.setVelocityX(200).setVelocityY(0);
      this.enemyGoingRight = null;  
    }

      const cursors = this.input.keyboard.createCursorKeys();  
      // scrollbackground
      this.starmap1.tilePositionY -= 1;
      this.starmap2.tilePositionY -= 3;

      // player controls
      if (cursors.left.isDown) {
        this.ship.setVelocityX(-275);

        //animation
        this.ship.anims.play('straightLeft', true);
        
        //this.ship.anims.play('left', true);
      } 
      if (cursors.right.isDown) {
        this.ship.setVelocityX(275);

        //animation
        this.ship.anims.play('straightRight', true);

        //this.ship.anims.play('right', true);
      } 
       if (cursors.up.isDown) {
        this.ship.setVelocityY(-275);

        //animation
        this.ship.anims.play('straightUp', true);

        //this.ship.anims.play('straight', true);
      } 
       if (cursors.down.isDown) {
        this.ship.setVelocityY(275);

        //animation
        this.ship.anims.play('straightDown', true);

        //this.ship.anims.play('straight', true);
      } if (!cursors.down.isDown && !cursors.up.isDown && !cursors.right.isDown && !cursors.left.isDown) {
        this.ship.setVelocityY(0);  
        this.ship.setVelocityX(0);

        //animation
        this.ship.anims.play('idle', true);
      } // if/else if

      // shooting 
      if (cursors.space.isDown && this.canShoot == true) {
        this.makeShipLaser();
        this.canShoot = false;  
      }
      if (this.timeSinceShot > 30) {
        this.canShoot = true;
        this.timeSinceShot = 0; 
      }
      this.timeSinceShot++;

      //passive points
      if (this.timeSincePoints > 60) {
        this.score += 1;
        this.scoreText.setText(' ' + this.score);
        this.timeSincePoints = 0; 
      }
      this.timeSincePoints++;

      //enemy spawn conditions
      if (this.timeSinceEnemySpawned > 500 && /*this.timeSinceEnemyDestroyed > 600 &&*/ this.enemyDestroyed == true) {
        this.makeEnemyShip();
        this.timeSinceEnemySpawned = 0;
        this.enemyDestroyed = false;
      }
      this.timeSinceEnemySpawned++;

      //laser generation conditions
      if (this.currentLaserEnemy != null && this.timeSinceEnemyShot > 90) {
        this.makeEnemyLaser();
        this.timeSinceEnemyShot = 0; 
      }
      this.timeSinceEnemyShot++;

      // asteroids spawning
      if (this.timeSinceAsteroid > this.randomAsteroidSpawnTime) {
          this.makeBigAsteroid();
          this.timeSinceAsteroid = 0;
          this.randomAsteroidSpawnTime = Math.floor(Math.random() * 50) + this.asteroidSpawnMultiplyer; 
          if (this.asteroidSpawnMultiplyer > 20) {
            this.asteroidSpawnMultiplyer -= 5; 
          }
          
      }
      this.timeSinceAsteroid++; 

      // health bar changes color as it gets smaller
      if (this.healthBar.scaleX <= 0.6 && this.healthBar.scaleX > 0.3) {
        this.healthBar.fillStyle("0xE56F0D", 1);
      }

      if (this.healthBar.scaleX <= 0.3) {
        this.healthBar.fillStyle("0xAE0303", 1);
      }

      // level is failed if healthbar is gone
      if (this.healthBar.scaleX <= 0.1) {
        this.levelFailed(); 
      }

      //rank system
      if (this.score >= 0 && this.score < 100) {
        this.rank.setText(' None');
      }

      if (this.score >= 100 && this.score < 2500) {
        this.rank.setText(' Rookie Pilot');
      }

      if (this.score >= 2500 && this.score < 5000) {
        this.rank.setText(' Skilled Pilot');
      }

      if (this.score >= 5000 && this.score < 10000) {
        this.rank.setText(' Ace Pilot');
      }

      if (this.score >= 10000) {
        this.rank.setText(' Master Pilot');
      }

 
  } // update function

  // helping functions
  
  makeBar(x, y,color) {
    //draw the bar
    let bar = this.add.graphics();

    //color the bar
    bar.fillStyle(color, 1);

    //fill the bar with a rectangle
    bar.fillRect(0, 0, 124, 12);
    
    //position the bar
    bar.x = x;
    bar.y = y;

    //return the bar
    return bar;
} // makeBar

/*makeEnemyZoneBoxLeft(x, y,color) {
  //draw the bar
  let bar = this.add.graphics();

  //color the bar
  bar.fillStyle(color, 1);

  //fill the bar with a rectangle
  bar.fillRect(0, 0, 25, 150);
  
  //position the bar
  bar.x = x;
  bar.y = y;

  //return the bar
  return bar;
} // makeBar

makeEnemyZoneBoxRight(x, y,color) {
  //draw the bar
  let bar = this.add.graphics();

  //color the bar
  bar.fillStyle(color, 1);

  //fill the bar with a rectangle
  bar.fillRect(0, 0, 25, 150);
  
  //position the bar
  bar.x = x;
  bar.y = y;

  //return the bar
  return bar;
} // makeBar*/

// creates and asteroid in the group "asteroids" at a random x, and set it falling toward the bottom of the screen. 
makeBigAsteroid() {
    let x = Math.floor(Math.random() * this.scale.width) + 1;
    let y = -20; 
    let scale = (Math.floor(Math.random() * 100) + 40) / 100;
    let speed = (Math.floor(Math.random() * 250) + 200);
    const asteroid = this.asteroids.create(x, y, 'asteroid').setScale(scale);
    asteroid.setVelocityY(speed);
} // makeBigAsteroid

// creates ship lasers at ship's x coordinate, moving upwards.
makeShipLaser() {
  let x = this.ship.x;
  let y = this.ship.y - 54;
  let scale = 1;
  const shipLaser = this.shipLasers.create(x, y, 'shipLaser').setScale(scale); 
  shipLaser.setVelocityY(-600);
} // makeShipLaser

//creates enemy ships
makeEnemyShip() {
  let x = 500;
  let y = -300;
  let scale = 1;
  const enemyShip = this.enemyShips.create(x, y, 'enemyShip').setScale(scale);
  enemyShip.setVelocityX(-300||300).setVelocityY(265);
} // makeEnemyShip

//generates enemy lasers, currently at the ship's x value
makeEnemyLaser() {
  let x = this.currentLaserEnemy.x;
  let y = this.currentLaserEnemy.y + 54;
  let scale = 1;
  const enemyLaser = this.enemyLasers.create(x, y, 'enemyLaser').setScale(scale); 
  enemyLaser.setVelocityY(400);
} // makeEnemyLaser

//invisible collision boxes for enemies
makeEnemyZoneBoxLeft() {
  let x = 0;
  let y = 75;
  let scale = 1;
  const leftBox = this.enemyZoneBoxLeft.create(x, y, 'enemyCollisionBox').setScale(scale).setImmovable(true); 
} // makeEnemyCollideBox (Left)

makeEnemyZoneBoxRight() {
  let x = 800;
  let y = 75;
  let scale = 1;
  const rightBox = this.enemyZoneBoxRight.create(x, y, 'enemyCollisionBox').setScale(scale).setImmovable(true);
} // makeEnemyCollideBox (Right)

makeSpawnDetector() {
  let x = 500;
  let y = -300;
  let scale = 50;
  const topBox = this.spawnDetector.create(x, y, 'enemyCollisionBox').setScale(scale).setImmovable(true); 
}

/*makeSpawnDetector() {
  let x = -100;
  let y = -500;
  let scale = 1;
  const topBox = this.spawnDetector.create(x, y, 'spawnDetectorField').setScale(scale).setImmovable(true); 
}*/

//if HP = 0
levelFailed() {
  this.popoverService.popover('death'); 
}

} // gameScene class