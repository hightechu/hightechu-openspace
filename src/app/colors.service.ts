import { Injectable } from '@angular/core';
import { PopupService } from './popup.service';

@Injectable({
  providedIn: 'root'
})
export class ColorsService {

  constructor(public popupService: PopupService) {}

  colorChanged(newColor: string) {
    document.documentElement.style.setProperty('--ion-color-theme', newColor);
    this.popupService.colorChanged(newColor); 
  }
}
