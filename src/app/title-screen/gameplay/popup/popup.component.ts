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
    this.dataService.gameInstance.scene.pause('GameScene');
  }

  // start's the players game
  startGame() {
    this.dataService.gameInstance.scene.start('GameScene', this.popoverService); 
    this.closePopup(); 
  }

  //continues the players game from where they left off
  continueGame() {
    this.closePopup(); 
    this.dataService.gameInstance.scene.resume('GameScene');

  }


  closePopup() {
    this.popover.dismiss().then(() => { this.popover = null; }); 
  }

}
