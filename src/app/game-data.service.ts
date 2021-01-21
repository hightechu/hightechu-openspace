import { Injectable} from '@angular/core';

import Phaser from 'phaser';

import { PopupService } from './popup.service';


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
  scoreText;
  asteroids;
  shipLasers; 
  enemyShips;
  enemyLasers;
 
  alive: boolean; 

  canShoot = true;
  timeSinceShot = 0;

  timeSincePoints = 0;
  timeSinceEnemyShot = 0;

  timeSinceEnemySpawned = 0;
  timeSinceEnemyDestroyed = 0;
  enemyDestroyed = true;

  currentEnemy;

  constructor(protected popupService: PopupService) {
      super({
        key: "GameScene"
      });
  }

  init(params): void {
     
  }

  preload(): void {
      this.load.image('stars1', '../../../assets/sprites/stars1.png'); 
      this.load.image('stars2', '../../../assets/sprites/stars2.gif');
      this.load.image('HUD', '../../../assets/sprites/hud.png');
      this.load.image('screenBorder', '../../../assets/sprites/screenBorder.png');

      this.load.image('shipLaser', '../../../assets/sprites/shipLaser.png');
      this.load.image('enemyShip', '../../../assets/sprites/testEnemy.png');
      this.load.image('enemyLaser', '../../../assets/sprites/enemyLaser.png');        

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
          frameRate: 10,
          repeat: 0
        });
      
      // asteroids group (start's empty)
      this.asteroids = this.physics.add.group();
      this.physics.add.collider(this.ship, this.asteroids, function (player, asteroid) {
        this.healthBar.scaleX = this.healthBar.scaleX-0.1; 
        asteroid.destroy(); 
      }, null, this);


      // ship laser group (start's empty)
      this.shipLasers = this.physics.add.group();
      this.physics.add.collider(this.shipLasers, this.asteroids, function (shipLaser, asteroid) {
        this.score += 50;
        this.scoreText.setText(' ' + this.score);
        asteroid.destroy();
        shipLaser.destroy();
      }, null, this);
      

      // enemy ship group (start's empty)
      this.enemyShips = this.physics.add.group();
      this.physics.add.collider(this.shipLasers, this.enemyShips, function (shipLaser, enemyShip) {
        this.score += 200;
        this.scoreText.setText(' ' + this.score);
        this.enemyDestroyed = true;
        enemyShip.destroy();
        shipLaser.destroy();
      }, null, this);
      

      // enemy laser group (start's empty)
      this.enemyLasers = this.physics.add.group();
      this.physics.add.collider(this.ship, this.enemyLasers, function (player, enemyLaser) {
        this.healthBar.scaleX = this.healthBar.scaleX-0.1; 
        enemyLaser.destroy(); 
      }, null, this);

      //healthBar
      this.add.image(0, 0, 'HUD').setOrigin(0, 0).setScale(1); 
      this.healthBar = this.makeBar(114, 18, 0x2FF485);
      this.healthBar.scaleX = 1;

      this.scoreText = this.add.text(400, 12, ' 0', {fontSize: '24px', color: 'white'});

      this.add.image(0, 0, 'screenBorder').setOrigin(0, 0).setScale(1); 

  }

  update(time): void {
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
      } else if (cursors.right.isDown) {
        this.ship.setVelocityX(275);

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

      //enemy firing rate
      if (this.timeSinceEnemyShot > 90) {
        this.makeEnemyLaser();
        this.timeSinceEnemyShot = 0; 
      }
      this.timeSinceEnemyShot++;

      //enemy spawn conditions
      if (this.timeSinceEnemySpawned > 1800 && /*this.timeSinceEnemyDestroyed > 600 &&*/ this.enemyDestroyed == true) {
        this.makeEnemyShip();
        this.timeSinceEnemySpawned = 0;
        this.enemyDestroyed = false;
      }
      this.timeSinceEnemySpawned++;
/*
      //enemy movement conditions
         for (let i = 0; i < this.enemyShips.getLength(); i++) {
          console.log("Test for loop" + this.enemyShips.getLength());

        if(this.enemyShips[i].x > 400) {
          console.log("Test for if x");
          this.enemyShips[i].setVelocityX(-200);
        } else if(this.enemyShips[i].x < 50) {
          this.enemyShips[i].setVelocityX(200);
        }
      }*/

      // asteroids
      if (time % 1000 <= 10 || (time % 1000 >= 495 && time % 1000 <= 505)) {
          this.makeBigAsteroid();
      }

      if (this.healthBar.scaleX <= 0.6 && this.healthBar.scaleX > 0.3) {
        this.healthBar.fillStyle("0xE56F0D", 1);
      }

      if (this.healthBar.scaleX <= 0.3) {
        this.healthBar.fillStyle("0xAE0303", 1);
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
    bar.fillRect(0, 0, 124, 12);
    
    //position the bar
    bar.x = x;
    bar.y = y;

    //return the bar
    return bar;
} // makeBar

// creates and asteroid in the group "asteroids" at a random x, and set it falling toward the bottom of the screen. 
makeBigAsteroid() {
    let x = Math.floor(Math.random() * this.scale.width) + 1;
    let y = -20; 
    let scale = (Math.floor(Math.random() * 100) + 40) / 100;
    let speed = (Math.floor(Math.random() * 250) + 120);
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

makeEnemyShip() {
  let x = 760;
  let y = 100;
  let scale = 1;
  const enemyShip = this.enemyShips.create(x, y, 'enemyShip').setScale(scale);
} // makeEnemyShip

makeEnemyLaser() {
  let x = this.ship.x;
  let y = -20;
  let scale = 1;
  const enemyLaser = this.enemyLasers.create(x, y, 'enemyLaser').setScale(scale); 
  enemyLaser.setVelocityY(400);
} // makeEnemyLaser

levelFailed() {
  this.scene.pause();
  this.alive = false; 
  this.popupService.popover('death'); 
}




} // gameScene class
