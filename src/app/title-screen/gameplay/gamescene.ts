import Phaser from 'phaser';
import { GameplayPage } from './gameplay.page'; 

export class GameScene extends Phaser.Scene {

    gameplay: GameplayPage; 
    constructor() {
        super({
          key: "GameScene"
        });
      }
    init(params): void {
        // TODO
      }
    preload(): void {
      this.load.image('stars', '../../../assets/backgrounds/starmap.jpg'); 
      }
      
      create(): void {
        this.gameplay = (this.scene.scene.game as any).gameInstanceService;

        const starmap = this.add.tileSprite(0, 0, 800, 600, 'stars'); 
      }
    update(time): void {
        // TODO
      }
    }