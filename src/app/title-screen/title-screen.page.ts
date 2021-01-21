import { Component, OnInit } from '@angular/core';
import { GameDataService } from '../game-data.service';

@Component({
  selector: 'app-title-screen',
  templateUrl: './title-screen.page.html',
  styleUrls: ['./title-screen.page.scss'],
})
export class TitleScreenPage implements OnInit {

  constructor(protected dataService: GameDataService) { }

  ngOnInit() {
  }

  startGame() {
    this.dataService.gameInstance.scene.start('GameScene');
  }

}
