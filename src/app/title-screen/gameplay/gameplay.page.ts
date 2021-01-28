// Angular/ionic featres
import { Component, OnInit } from '@angular/core';
// external libraries
import Phaser from 'phaser';
import { PopupService } from '../../popup.service';

// local classes/files
import { GameDataService } from '../../game-data.service'; 

@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.page.html',
  styleUrls: ['./gameplay.page.scss'],
})
export class GameplayPage implements OnInit {

  gameInstance: any;
  config: Phaser.Types.Core.GameConfig; // phaser configuration object

  constructor(public dataService: GameDataService, public popupService: PopupService) {}

  ngOnInit() {

    this.config = {
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
      scene: [ GameDataService ],
      fps: {
        forceSetTimeOut: true
      },
      physics: {
        default: 'arcade',
        arcade: {
            //gravity: { y: 300 },
            debug: false
        }
      }, 
      backgroundColor: `rgb(${this.popupService.r}, ${this.popupService.g}, ${this.popupService.b})` 
    }

    if (!this.gameInstance) {
      this.gameInstance = new Phaser.Game(this.config);
      this.dataService.gameInstance = this.gameInstance;
    }
     
    if (this.dataService.game2 == false) {
      this.popupService.popover('instructions');  
    } else {
      this.dataService.gameInstance.scene.start("GameScene", this.popupService); 
    }

  } // ngOnInit

  pause() {
    this.dataService.buttonPlay(); 
    this.popupService.popover('pause')
  }



} // end of class "GameplayPage"

