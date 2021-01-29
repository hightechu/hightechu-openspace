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
  }, 
  {
    path: 'credits',
    loadChildren: () => import('./credits/credits.module').then( m => m.CreditsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TitleScreenPageRoutingModule {}
