import Phaser from 'phaser';
import { GameplayPage } from './gameplay.page'; 

export class GameScene extends Phaser.Scene {

    gameplay: Phaser.Game; 
    starmap;
    ship; 
    healthBar;
    asteroids;  
      
    constructor() {
        super({
          key: "GameScene"
        });
    }
    init(params): void {
        // TODO
    }
    preload(): void {
        this.load.image('stars', '../../../assets/backgrounds/starmapBig.png'); 
        this.load.image('ship', '../../../assets/backgrounds/ship.png');
        this.load.image('asteroid', '../../../assets/backgrounds/asteroid.png'); 
        /*
        this.load.spritesheet('ship', '../../../assets/backgrounds/ship.png',{ 
          frameWidth: 32, 
          frameHeight: 48
         }); 
         */
    } // preload function
      
    create(): void {
        this.gameplay = (this.scene.scene.game as any).gameInstanceService;

        const width = this.scale.width;
        const height = this.scale.height; 
        // backgrounds
        this.starmap = this.add.tileSprite(0, 0, width, height, 'stars').setOrigin(0, 0); 

        // player
        this.ship = this.physics.add.sprite(350, 500, 'ship').setScale(0.2);
        this.ship.setCollideWorldBounds(true);
        this.ship.health = 100; 

        //healthBar
        this.healthBar = this.makeBar(20, 20, 0xFF0000);
        this.healthBar.scaleX = 1;
        
        // asteroids group (start's empty)
        this.asteroids = this.physics.add.group();
        this.physics.add.collider(this.ship, this.asteroids, function (player, asteroid) {
          this.healthBar.scaleX = this.healthBar.scaleX-0.2; 
          asteroid.destroy(); 
        }, null, this);

    }

    update(time): void {
        const cursors = this.input.keyboard.createCursorKeys();

        // scrollbackground
        this.starmap.tilePositionY -= 1; 
        //this.starmap.tilePosition
        // player controls
        if (cursors.left.isDown) {
          this.ship.setVelocityX(-160);
          
          //this.ship.anims.play('left', true);
        } else if (cursors.right.isDown) {
          this.ship.setVelocityX(160);

          //this.ship.anims.play('right', true);
        } else {
          this.ship.setVelocityX(0);
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
    const asteroid = this.asteroids.create(x, 16, 'asteroid').setScale(0.3); 
    asteroid.setVelocityY(160);
  } // makeAsteroid

  levelFailed() {
    this.scene.pause(); 
  }


  
} // gameScene class