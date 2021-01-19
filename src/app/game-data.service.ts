import { Injectable} from '@angular/core';
import Phaser from 'phaser';
//import { GameplayPage } from './gameplay.page'; 
//import { GameDataService } from '../../game-data.service'; 
//import { title } from 'process';

@Injectable({
  providedIn: 'root'
})

export class GameDataService extends Phaser.Scene {

  gameplay: Phaser.Game; 
  starmap1;
  starmap2;
  ship; 
  healthBar;
  asteroids;
  shipLaser;  
  alive: boolean; 
  started: boolean; 

  constructor() {
      super({
        key: "GameScene"
      });
  }

  init(params): void {
     
  }

  preload(): void {
      this.load.image('stars1', '../../../assets/sprites/stars1.png'); 
      this.load.image('stars2', '../../../assets/sprites/stars2.gif');
      this.load.image('bigAsteroid', '../../../assets/sprites/asteroid1.png'); 
      //this.load.image('smallAsteroid', '../../../assets/sprites/asteroid2.png');
      this.load.image('shipLaser', '../../../assets/sprites/shipLaser.png');  
      
      this.load.spritesheet('ship', '../../../assets/sprites/shipSheet3.png',{ 
        frameWidth: 64, 
        frameHeight: 80
       }); 

       // health bar
       //this.load.image('health', '../../../assets/backgrounds/healthBar.png'); 
       
  } // preload function
    
  create(): void {
      this.gameplay = (this.scene.scene.game as any).gameInstanceService;

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
      
      
      //healthBar
      this.healthBar = this.makeBar(20, 20, 0xFF0000);
      this.healthBar.scaleX = 1;
      
      // asteroids group (start's empty)
      this.asteroids = this.physics.add.group();
      this.physics.add.collider(this.ship, this.asteroids, function (player, asteroid) {
        this.healthBar.scaleX = this.healthBar.scaleX-0.2; 
        asteroid.destroy(); 
      }, null, this);

      // ship laser group (start's empty)
      this.shipLaser = this.physics.add.group();
      this.physics.add.collider(this.shipLaser, this.asteroids, function (shipLaser, asteroid) {
        asteroid.destroy();
        shipLaser.destroy(); 
      }, null, this);


  }

  update(time): void {
      const cursors = this.input.keyboard.createCursorKeys();

      // scrollbackground
      this.starmap1.tilePositionY -= 1;
      this.starmap2.tilePositionY -= 3;

      //acceleration
      //this.ship.setAccelerationX(150);

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


      if (cursors.space.isDown) {
        this.makeShipLaser();
        
      }

      if (time % 1000 <= 10 || (time % 1000 >= 495 && time % 1000 <= 505)) {
          this.makeBigAsteroid();
      }

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
    bar.fillRect(0, 0, 200, 20);
    
    //position the bar
    bar.x = x;
    bar.y = y;

    //return the bar
    return bar;
} // makeBar

// creates and asteroid in the group "asteroids" at a random x, and set it falling toward the bottom of the screen. 
makeBigAsteroid() {
    let x = Math.floor(Math.random() * this.scale.width) + 1; 
    let scale = (Math.floor(Math.random() * 100) + 40) /100;
    let speed = (Math.floor(Math.random() * 250) + 120);
    const asteroid = this.asteroids.create(x, -16, 'bigAsteroid').setScale(scale); 
    asteroid.setVelocityY(speed);
} // makeBigAsteroid

// creates ship lasers at ship's x coordinate, moving upwards.
makeShipLaser() {
  let x = this.ship.x;
  let y = this.ship.y - 54;
  let scale = 1;
  const shipLaser = this.shipLaser.create(x, y, 'shipLaser').setScale(scale); 
  shipLaser.setVelocityY(-600);
} // makeShipLaser

levelFailed() {
  this.scene.pause();
  this.alive = false; 
}




} // gameScene class
