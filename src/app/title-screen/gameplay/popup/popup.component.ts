import { Component, OnInit, Input } from '@angular/core';

// local data/files
import { dataModel } from './data.model'; 
import { GameScene } from '../gamescene';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {
  @Input() popover; 
  @Input() data: dataModel;

  game = new GameScene

  constructor() { }

  ngOnInit() {
     
  }

  // start's the players game
  startGame() {
    this.resetGameScene(); 
    this.popover.dismiss().then(() => { this.popover = null; });
  }

  //continues the players game from where they left off
  continueGame() {
    this.popover.dismiss().then(() => { this.popover = null; });
  }

  resetGameScene() {

  }

}
