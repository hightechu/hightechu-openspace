import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GameplayPage } from './gameplay.page';

describe('GameplayPage', () => {
  let component: GameplayPage;
  let fixture: ComponentFixture<GameplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameplayPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GameplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
