import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TitleScreenPageRoutingModule } from './title-screen-routing.module';

import { TitleScreenPage } from './title-screen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TitleScreenPageRoutingModule
  ],
  declarations: [TitleScreenPage]
})
export class TitleScreenPageModule {}
