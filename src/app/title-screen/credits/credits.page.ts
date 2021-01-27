import { Component, OnInit } from '@angular/core';
import { GameDataService } from 'src/app/game-data.service';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.page.html',
  styleUrls: ['./credits.page.scss'],
})
export class CreditsPage implements OnInit {

  constructor(public dataService: GameDataService) { }

  ngOnInit() {
  }

}
