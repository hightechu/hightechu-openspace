// Angular/ionic featres
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs'; 
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

  public gameInstance: any;

  game: Phaser.Game; // phaser game instance
  config: Phaser.Types.Core.GameConfig; // phaser configuration object

  // popovers
  deathPopover = null; 
  checkpointPopover = null;
  instructionsPopover = null; 

  subscription: Subscription = new Subscription(); 
  testSubscription: Subscription = new Subscription(); 

  constructor(protected dataService: GameDataService, protected popupService: PopupService) {
  }

  ngOnInit() {
    this.subscription = this.dataService.popupChanged.subscribe((popup) => { 
      console.log("new Popup is: " + popup); 
      this.popupService.popover(popup); 
    });

    this.testSubscription = this.popupService.testSubject.subscribe((test) => { 
      console.log("Test phrase is: " + test); 
      this.popupService.popover(test); 
    });

    this.config = {
      width: 800,
      height: 600,
      type: Phaser.AUTO,
      scale: {
        /*mode: Phaser.Scale.RESIZE,*/
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
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
      this.gameInstance.gameInstanceService = this;
      this.dataService.gameInstance = this.gameInstance; 
    } // if
    
  } // ngOnInit

} // end of class "GameplayPage"

