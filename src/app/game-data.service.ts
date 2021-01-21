import { Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs'; 

import Phaser from 'phaser';



@Injectable({
  providedIn: 'root'
})

export class GameDataService extends Phaser.Scene {

  gameInstance: Phaser.Game; 
 
  starmap1;
  starmap2;
  ship; 
  healthBar;
  score = 0;
  barColor = 0x00FF00;
  scoreText;
  asteroids;
  shipLasers; 
  enemyShips;
  enemyLasers; 

  currentAsteroid = null; 

  popupChanged: BehaviorSubject<string> = new BehaviorSubject<string>("instructions"); 

  canShoot = true;
  timeSinceShot = 0;

  constructor() {
      super({
        key: "GameScene"
      });
  }


  init(params): void {
    this.popupChanged.next("instructions"); 
  }

  preload(): void {
      this.load.image('stars1', '../../../assets/sprites/stars1.png'); 
      this.load.image('stars2', '../../../assets/sprites/stars2.gif');

      //this.load.image('smallAsteroid', '../../../assets/sprites/asteroid2.png');
      this.load.image('shipLaser', '../../../assets/sprites/shipLaser.png');
      this.load.image('enemyShip', '../../../assets/sprites/testEnemy.png');
      this.load.image('enemyLaser', '../../../assets/sprites/enemyLaser.png');        

      //this.load.image('bigAsteroid', '../../../assets/sprites/asteroid1.png'); 
      this.load.image('healthBar', '../../../assets/sprites/healthBar.png');

      
      this.load.spritesheet('ship', '../../../assets/sprites/shipSheet3.png',{ 
        frameWidth: 68, 
        frameHeight: 80
       }); 

      this.load.spritesheet('asteroid', '../../../assets/sprites/asteroid1.png',{ 
        frameWidth: 68, 
        frameHeight: 68
       }); 
       
  } // preload function
    
  create(): void {

      const width = this.scale.width;
      const height = this.scale.height; 
      // backgrounds
      this.starmap1 = this.add.tileSprite(0, 0, width, height, 'stars1').setOrigin(0, 0);
      this.starmap2 = this.add.tileSprite(0, 0, width*2, height*2, 'stars2').setOrigin(0, 0).setScale(0.5);
      
      

      // player
      this.ship = this.physics.add.sprite(350, 550, 'ship').setScale(1);
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
/*
      //Big asteroid animation
      this.anims.create({
        key: 'asteroidDestroyed',
        frames: this.anims.generateFrameNumbers('asteroid', { start: 1, end: 5 }),
        frameRate: 10,
        repeat: 0
      });
      */
      
      //healthBar
      this.add.image(20, 20, 'healthBar').setOrigin(0, 0).setScale(1.4); 
      this.healthBar = this.makeBar(157, 23, 0x2FF485);
      this.healthBar.scaleX = 1;

        // asteroid animation
        this.anims.create({
          key: 'fly', 
          frames: [ { key: 'asteroid', frame: 0 } ],
          frameRate: 10,
        });
        this.anims.create({
          key: 'explode',
          frames: this.anims.generateFrameNumbers('asteroid', { start: 1, end: 5 }),
          frameRate: 10,
          repeat: 1
        });
      
      // asteroids group (start's empty)
      this.asteroids = this.physics.add.group();
      this.physics.add.collider(this.ship, this.asteroids, function (player, asteroid) {
        this.healthBar.scaleX = this.healthBar.scaleX-0.2;
        if (this.currentAsteroid == null) {
          asteroid.destroy(); 
        } 
      }, null, this);


      // ship laser group (start's empty)
      this.shipLasers = this.physics.add.group();
      this.physics.add.collider(this.shipLasers, this.asteroids, function (shipLaser, asteroid) {
        this.currentAsteroid = asteroid; 
        this.score += 50;
        this.scoreText.setText('Points: ' + this.score);
  
        shipLaser.destroy(); 
      }, null, this);

      // enemy laser group (start's empty)
      this.enemyLasers = this.physics.add.group();
      this.physics.add.collider(this.ship, this.enemyLasers, function (player, enemyLaser) {
        this.healthBar.scaleX = this.healthBar.scaleX-0.2; 
        enemyLaser.destroy(); 
      }, null, this);

      this.scoreText = this.add.text(250, 18, 'Points: 0', {fontSize: '28px', color: 'white'});

  } // phaser create

  update(time): void {

    if (this.currentAsteroid != null) {
      this.currentAsteroid.anims.play('explode', true);
      this.currentAsteroid.once("animationrepeat", () => {
        if (this.currentAsteroid != null) {
          this.currentAsteroid.destroy();
          this.currentAsteroid = null;  
        }
      });
    }

      const cursors = this.input.keyboard.createCursorKeys();  
      // scrollbackground
      this.starmap1.tilePositionY -= 1;
      this.starmap2.tilePositionY -= 3;

      // player controls
      if (cursors.left.isDown) {
        this.ship.setVelocityX(-275);
        this.ship.setAccelerationX(-5000);

        //animation
        this.ship.anims.play('straightLeft', true);
        
        //this.ship.anims.play('left', true);
      } else if (cursors.right.isDown) {
        this.ship.setVelocityX(275);
        this.ship.setAccelerationX(5000);

        //animation
        this.ship.anims.play('straightRight', true);

        //this.ship.anims.play('right', true);
      } else if (cursors.up.isDown) {
        this.ship.setVelocityY(-275);

        //animation
        this.ship.anims.play('straightUp', true);

        //this.ship.anims.play('straight', true);
      } else if (cursors.down.isDown) {
        this.ship.setVelocityY(275);

        //animation
        this.ship.anims.play('straightDown', true);

        //this.ship.anims.play('straight', true);
      } else {
        this.ship.setVelocityY(0);  
        this.ship.setVelocityX(0);
        this.ship.setAccelerationX(0);

        //animation
        this.ship.anims.play('idle', true);
      } // if/else if

      // shooting 
      if (cursors.space.isDown && this.canShoot == true) {
        this.makeShipLaser();
        this.canShoot = false;  
      }
      if (this.timeSinceShot > 40) {
        this.canShoot = true;
        this.timeSinceShot = 0; 
      }
      this.timeSinceShot++;

      // asteroids
      if (time % 1000 <= 10 || (time % 1000 >= 495 && time % 1000 <= 505)) {
          this.makeBigAsteroid();
          this.makeEnemyLaser();
      }

      if (this.healthBar.scaleX <= 0.5) {
        this.barColor =  0xFF0000;
      }

      // health bar
      if (this.healthBar.scaleX <= 0.1) {
        this.levelFailed(); 
      }

 
  } // update function

  // helping functions
  
  makeBar(x, y,color) {
    //draw the bar
    let bar = this.add.graphics();

    //color the bar
    bar.fillStyle(color, 1);

    //fill the bar with a rectangle
    bar.fillRect(0, 0, 168, 17);
    
    //position the bar
    bar.x = x;
    bar.y = y;

    //return the bar
    return bar;
} // makeBar

// creates and asteroid in the group "asteroids" at a random x, and set it falling toward the bottom of the screen. 
makeBigAsteroid() {
    let x = Math.floor(Math.random() * this.scale.width) + 1; 
    let scale = (Math.floor(Math.random() * 100) + 40) /50;
    let speed = (Math.floor(Math.random() * 250) + 120);
    const asteroid = this.asteroids.create(x, -16, 'asteroid').setScale(scale);
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

makeEnemyLaser() {
  let x = this.ship.x;
  let y = 20;
  let scale = 1;
  const enemyLaser = this.enemyLasers.create(x, y, 'enemyLaser').setScale(scale); 
  enemyLaser.setVelocityY(400);
} // makeEnemyLaser

levelFailed() {
  console.log("new popup incoming"); 
  this.popupChanged.next('death'); 
  this.scene.pause();
}





} // gameScene class
