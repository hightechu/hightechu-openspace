// Angular/ionic featres
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

// external libraries
import Phaser from 'phaser';

// local classes/files
import { GameDataService } from '../../game-data.service';
import { GameScene } from './gamescene';
import { PopupComponent } from './popup/popup.component';  

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

  constructor(protected dataService: GameDataService, 
    public popoverController: PopoverController, 
    private alertCtrl: AlertController) {}

  ngOnInit() {
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
      scene: [ GameScene ],
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
    } // if

    this.presentPopover("instructions"); 
  } // ngOnInit

  // async function to control the potential popups for the game. This includes a deathscreen, instructions, and checkpoints
  async presentPopover(type: string) {
    if (type == "death") {
      this.deathPopover = await this.popoverController.create({
        component: PopupComponent,
        componentProps: {
          popover: this.deathPopover, 
          data: {
            title: "Start again?",
            text: "Message about failure", 
            button1: "Restart", 
            button2: "titleScreen"
          }
        },  
        cssClass: 'my-custom-popup',
        translucent: true, 
        backdropDismiss: false
      });
      return await this.deathPopover.present();
    } else if (type == "checkpoint") {
      this.checkpointPopover = await this.popoverController.create({
        component: PopupComponent,
        componentProps: {
          popover: this.checkpointPopover,
          data: {
            title: "Checkpoint",
            text: "Here is a encouraging message", 
            button1: "Keep Playing", 
            button2: "titleScreen"
          }
        },  
        cssClass: 'my-custom-popup',
        translucent: true, 
        backdropDismiss: false
      });
      return await this.instructionsPopover.present();
    } else if (type == "instructions") {
      this.instructionsPopover = await this.popoverController.create({
        component: PopupComponent,
        componentProps: {
          popover: this.instructionsPopover,
          data: {
            title: "Instructions",
            text: "Here are the instructions", 
            button1: "Start Game", 
            button2: "null"
          }
        },  
        cssClass: 'my-custom-popup',
        translucent: true, 
        backdropDismiss: false
      });
      return await this.instructionsPopover.present();
    }

  } // presentPopover

} // end of class "GameplayPage"

