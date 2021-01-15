import Phaser from 'phaser';
//import { GameplayPage } from './gameplay.page'; 
import { GameDataService } from '../../game-data.service'; 
//import { title } from 'process';

export class GameScene extends Phaser.Scene {

    gameplay: Phaser.Game; 
    starmap;
    ship; 
    healthBar;
    asteroids;  
      
    constructor(protected dataService: GameDataService) {
        super({
          key: "GameScene"
        });
    }
    init(params): void {
       
    }
    preload(): void {
        this.load.image('stars', '../../../assets/backgrounds/starmapBig.png'); 
        //this.load.image('ship', '../../../assets/backgrounds/ship.png');
        this.load.image('asteroid', '../../../assets/backgrounds/asteroid2.png'); 
        
        this.load.spritesheet('ship', '../../../assets/backgrounds/shipSheet2.png',{ 
          frameWidth: 64, 
          frameHeight: 96
         }); 
         
    } // preload function
      
    create(): void {
        this.gameplay = (this.scene.scene.game as any).gameInstanceService;

        const width = this.scale.width;
        const height = this.scale.height; 
        // backgrounds
        this.starmap = this.add.tileSprite(0, 0, width, height, 'stars').setOrigin(0, 0); 

        // player
        this.ship = this.physics.add.sprite(350, 550, 'ship').setScale(1);
        this.ship.setCollideWorldBounds(true);
        this.ship.health = 100;
        // player animations
        this.anims.create({
          key: 'straight',
          frames: this.anims.generateFrameNumbers('ship', { start: 3, end: 5 }),
          frameRate: 10,
          repeat: -1
        });
        this.anims.create({
          key: 'move',
          frames: this.anims.generateFrameNumbers('ship', { start: 2, end: 5 }),
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


        console.log(this.dataService.alive); 
    }

    update(time): void {
        const cursors = this.input.keyboard.createCursorKeys();

        // scrollbackground
        this.starmap.tilePositionY -= 1; 
        //this.starmap.tilePosition
        // player controls
        if (cursors.left.isDown) {
          this.ship.setVelocityX(-160);
          this.ship.setAccelerationX(-150);

          //animation
          this.ship.anims.play('move', true);
          
          //this.ship.anims.play('left', true);
        } else if (cursors.right.isDown) {
          this.ship.setVelocityX(160);
          this.ship.setAccelerationX(150);

          //animation
          this.ship.anims.play('move', true);

          //this.ship.anims.play('right', true);
        } else {
          this.ship.setVelocityX(0);
          this.ship.setAccelerationX(0);

          //animation
          this.ship.anims.play('straight', true);
        } // if/else if

        if (time % 1000 <= 10) {
          this.makeAsteroid();  
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
  makeAsteroid() {
    let x = Math.floor(Math.random() * this.scale.width) + 1 
    let scale = (Math.floor(Math.random() * 100) + 50) / 100; 
    const asteroid = this.asteroids.create(x, 16, 'asteroid').setScale(scale); 
    asteroid.setVelocityY(160);
  } // makeAsteroid

  levelFailed() {
    this.scene.pause();
    //this.dataService.alive = false; 
  }


  
} // gameScene class