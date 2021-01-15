import Phaser from 'phaser';
import { GameplayPage } from './gameplay.page'; 

export class GameScene extends Phaser.Scene {

    gameplay: Phaser.Game; 
    starmap;
    ship; 
    healthBar; 
      
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


  
} // gameScene class