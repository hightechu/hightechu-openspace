import { Component, OnInit, Input } from '@angular/core';
import Phaser from 'phaser';

// local data/files
import { dataModel } from './data.model'; 
import { GameDataService } from 'src/app/game-data.service';
import { PopupService } from 'src/app/popup.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {
  @Input() popover; 
  @Input() data: dataModel;

  constructor(public dataService: GameDataService, public popoverService: PopupService) {}

  ngOnInit() {
    this.dataService.gameInstance.scene.pause('GameScene', this.popoverService);
  }

  // start's the players game
  startGame() {
    this.dataService.gameInstance.scene.start('GameScene', this.popoverService); 
    this.closePopup(); 
  }

  //continues the players game from where they left off
  continueGame() {
    this.closePopup(); 
    this.dataService.gameInstance.scene.resume('GameScene', this.popoverService);
  }

  titleScreen() {
    this.dataService.gameInstance.destroy(true); 
    this.dataService.game2 = true; 
    this.closePopup();
  }


  closePopup() {
    this.popover.dismiss().then(() => { this.popover = null; }); 
  }

}
