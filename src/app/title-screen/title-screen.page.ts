import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { GameDataService } from '../game-data.service';
import { PopupService } from '../popup.service';

@Component({
  selector: 'app-title-screen',
  templateUrl: './title-screen.page.html',
  styleUrls: ['./title-screen.page.scss'],
})
export class TitleScreenPage implements OnInit {

  constructor(public dataService: GameDataService, public popupService: PopupService) {}

  ngOnInit() {
    
  }

  startGameAgain() {
    if (this.dataService.gameInstance) {
      this.dataService.gameInstance.scene.start('GameScene', this.popupService); 
    }
  }


}
