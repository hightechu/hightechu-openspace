import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TitleScreenPage } from './title-screen.page';

describe('TitleScreenPage', () => {
  let component: TitleScreenPage;
  let fixture: ComponentFixture<TitleScreenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleScreenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TitleScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
