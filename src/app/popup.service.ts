import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';


import { PopupComponent } from './title-screen/gameplay/popup/popup.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  deathPopover = null; 
  checkpointPopover = null;
  instructionsPopover = null; 

  testSubject: BehaviorSubject<string> = new BehaviorSubject<string>("null");                                                         

  constructor(public popoverController: PopoverController) { }

    // async function to control the potential popups for the game. This includes a deathscreen, instructions, and checkpoints
    popover = async function presentPopover(type: string) {
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

    testSubjectFunction() {
      this.testSubject.next('death'); 
    }
}
