import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameDataService {
  
  alive: boolean = true; 
  constructor() { }
}
