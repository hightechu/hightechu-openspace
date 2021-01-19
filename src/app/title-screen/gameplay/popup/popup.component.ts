import { Component, OnInit, Input } from '@angular/core';

// local data/files
import { dataModel } from './data.model'; 
import { GameScene } from '../gamescene';
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
     this.dataService.scene.pause(); 
  }

  // start's the players game
  startGame() {
    this.resetGameScene(); 
    this.popover.dismiss().then(() => { this.popover = null; });
    this.dataService.scene.start(); 
  }

  //continues the players game from where they left off
  continueGame() {
    this.popover.dismiss().then(() => { this.popover = null; });
    this.dataService.scene.start()
  }

  resetGameScene() {

  }

}
