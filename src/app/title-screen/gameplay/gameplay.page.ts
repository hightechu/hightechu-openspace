// Angular/ionic featres
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs'; 
// external libraries
import Phaser from 'phaser';
import { PopupService } from '../../popup.service';

// local classes/files
import { GameDataService } from '../../game-data.service'; 
import { ColorsService } from 'src/app/colors.service';

@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.page.html',
  styleUrls: ['./gameplay.page.scss'],
})
export class GameplayPage implements OnInit {

  gameInstance: any;
  config: Phaser.Types.Core.GameConfig; // phaser configuration object

  constructor(public dataService: GameDataService, public popupService: PopupService, public colorService: ColorsService) {}

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
      }
    }

    if (!this.gameInstance) {
      this.gameInstance = new Phaser.Game(this.config);
      this.dataService.gameInstance = this.gameInstance; 
    } // if

    this.popupService.popover("instructions"); 

  } // ngOnInit

} // end of class "GameplayPage"

