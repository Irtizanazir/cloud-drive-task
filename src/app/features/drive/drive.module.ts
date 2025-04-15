import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: 'drive',
    loadChildren: () => import('./file-list/file-list.module').then(m => m.FileListModule),
  },
  {
    path: '',
    redirectTo: 'drive',
    pathMatch: 'full'
  }
  
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class DriveModule { } 