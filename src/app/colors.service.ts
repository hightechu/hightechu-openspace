import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorsService {

  constructor() {}

  colorChanged(newColor: string) {
    console.log("Color test")
    document.documentElement.style.setProperty('--ion-color-theme', newColor);
  }
}
