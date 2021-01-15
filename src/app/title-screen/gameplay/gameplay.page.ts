import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';

@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.page.html',
  styleUrls: ['./gameplay.page.scss'],
})
export class GameplayPage implements OnInit {

  phaserGame: Phaser.Game; // phaser game instance
  config: Phaser.Types.Core.GameConfig; // phaser configuration object

  constructor() {
    this.config = {
    type: Phaser.AUTO,
    height: 600,
    width: 800,
    scene: [ GameScene ], // this scene is the class we've outline below
    parent: 'phaser',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 100 }
      }
    }
  };
}

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }

} // end of class "GameplayPage"

class GameScene extends Phaser.Scene {
  constructor() {
      super({
        key: "GameScene"
      });
    }
  init(params): void {
      // TODO
    }
  preload(): void {
      // TODO
    }
    
    create(): void {
      // TODO
    }
  update(time): void {
      // TODO
    }
  }
