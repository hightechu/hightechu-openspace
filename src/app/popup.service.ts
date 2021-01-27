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
  checkpointPopover = null;
  instructionsPopover = null;
  
  r = 38;
  g = 64;
  b = 90;

  constructor(public popoverController: PopoverController, public dataService: GameDataService) { }

    colorChanged(hex: string) {
      switch(hex) {
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
        this.checkpointPopover = await this.popoverController.create({
          component: PopupComponent,
          componentProps: {
            popover: this.checkpointPopover,
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
        return await this.checkpointPopover.present();
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
