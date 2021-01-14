import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';

import { GameScene } from './gamescene'; 

@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.page.html',
  styleUrls: ['./gameplay.page.scss'],
})
export class GameplayPage implements OnInit {

  public gameInstance: any;

  game: Phaser.Game; // phaser game instance
  config: Phaser.Types.Core.GameConfig; // phaser configuration object

  constructor() {
}

  ngOnInit() {
    if (!this.gameInstance) {
      this.gameInstance = new Phaser.Game({
        width: 800,
        height: 600,
        type: Phaser.AUTO,
        scale: {
          /*mode: Phaser.Scale.RESIZE,*/
          autoCenter: Phaser.Scale.CENTER_BOTH
        },
        parent: 'phaser',
        /*dom: {
          createContainer: true
        },*/
        scene: [ GameScene ],
        fps: {
          forceSetTimeOut: true
        },
        physics: {
          default: 'arcade',
          arcade: {
              gravity: { y: 300 },
              debug: false
          }
      }
      });
      this.gameInstance.gameInstanceService = this;
    } // if
  } // ngOnInit

} // end of class "GameplayPage"

