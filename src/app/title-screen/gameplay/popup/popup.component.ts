import { Component, OnInit, Input } from '@angular/core';
import Phaser from 'phaser';

// local data/files
import { dataModel } from './data.model'; 
import { GameDataService } from 'src/app/game-data.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {
  @Input() popover; 
  @Input() data: dataModel;



  constructor(protected dataService: GameDataService) {
  }

  ngOnInit() {
    this.dataService.gameInstance.scene.pause('GameScene');
  }

  // start's the players game
  startGame() {
    this.dataService.gameInstance.scene.start('GameScene'); 
    this.resetGameScene(); 
    this.closePopup(); 
  }

  //continues the players game from where they left off
  continueGame() {
    this.closePopup(); 
  }

  resetGameScene() {

  }

  closePopup() {
    this.popover.dismiss().then(() => { this.popover = null; }); 
  }

}
