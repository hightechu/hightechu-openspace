import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { GameDataService } from './game-data.service';


import { PopupComponent } from './title-screen/gameplay/popup/popup.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  message: string = "";

  instructions = true; 

  deathPopover = null; 
  cpPopover = null;
  instructionsPopover = null;
  pausePopover = null; 
  
  r = 38;
  g = 64;
  b = 90;

  constructor(public popoverController: PopoverController, public dataService: GameDataService) { }

    colorChanged(newColor: string) {
      this.dataService.buttonPlay(); 
      document.documentElement.style.setProperty('--ion-color-theme', newColor);
      
      switch(newColor) {
        case "#dfca86": this.r = 125; this.g = 100; this.b = 28; break;
        case "#D5AAA4": this.r = 140; this.g = 73; this.b = 64; break;
        case "#9ebd6f": this.r = 55; this.g = 70; this.b = 32; break;
        default: this.r = 38; this.g = 64; this.b = 90; break; 
      } 
    }

    // async function to control the potential popups for the game. This includes a deathscreen, instructions, and checkpoints
    popover = async function presentPopover(type: string) { 
       
      if (type == "death") {
        this.deathPopover = await this.popoverController.create({
          component: PopupComponent,
          componentProps: {
            popover: this.deathPopover, 
            data: {
              title: "Start again?",
              text: await this.newMessage(), 
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
        this.cpPopover = await this.popoverController.create({
          component: PopupComponent,
          componentProps: {
            popover: this.cpPopover, 
            data: {
              title: "Checkpoint",
              text: await this.newMessage(), 
              button1: "Keep Playing", 
              button2: "titleScreen"
            }
          },  
          cssClass: 'my-custom-popup',
          translucent: true, 
          backdropDismiss: false
        });
        return await this.cpPopover.present();
      } else if (type == "instructions") {
        this.instructionsPopover = await this.popoverController.create({
          component: PopupComponent,
          componentProps: {
            popover: this.instructionsPopover,
            data: {
              title: "Instructions",
              text: "Welcome to Open Space! In this game, you take on the role of a space pilot flying through an asteroid field, eliminating any enemies you encounter along the way. Use the arrow keys to move your ship around the screen, and press the spacebar to fire your ship's lasers. Good luck!", 
              button1: "Start Game", 
              button2: "null"
            }
          },  
          cssClass: 'my-custom-popup',
          translucent: true, 
          backdropDismiss: false
        });
        return await this.instructionsPopover.present();
      } else if (type == "pause") {
        this.pausePopover = await this.popoverController.create({
          component: PopupComponent,
          componentProps: {
            popover: this.pausePopover,
            data: {
              title: "Game Paused",
              text: "Take a deep breath...", 
              button1: "Keep Playing", 
              button2: "titleScreen"
            }
          },  
          cssClass: 'my-custom-popup',
          translucent: true, 
          backdropDismiss: false
        });
        return await this.pausePopover.present();
      }
  
    } // presentPopover

   async newMessage() {
      let random: number; 
      let message; 

      await fetch("https://type.fit/api/quotes")
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        random = Math.floor(Math.random() * data.length); 
        message = `"${data[random].text}" - ${data[random].author}`;  
      });

      return message; 
    } // newMessage(); 

}
