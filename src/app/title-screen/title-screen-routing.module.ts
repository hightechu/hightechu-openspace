import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TitleScreenPage } from './title-screen.page';

const routes: Routes = [
  {
    path: '',
    component: TitleScreenPage
  },
  {
    path: 'gameplay',
    loadChildren: () => import('./gameplay/gameplay.module').then( m => m.GameplayPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TitleScreenPageRoutingModule {}
