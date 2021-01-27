import { Injectable } from '@angular/core';
import { GameDataService } from './game-data.service';
import { PopupService } from './popup.service';

@Injectable({
  providedIn: 'root'
})
export class ColorsService {

  constructor(public popupService: PopupService, public dataService: GameDataService) {}

  colorChanged(newColor: string) {
    this.dataService.buttonPlay(); 
    document.documentElement.style.setProperty('--ion-color-theme', newColor);
    this.popupService.colorChanged(newColor); 
  }
}
