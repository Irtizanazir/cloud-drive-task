import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkInProgressComponent } from './shared/components/work-in-progress/work-in-progress.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/drive/drive.module').then(m => m.DriveModule)
  },
  {
    path: 'drive',
    loadChildren: () => import('./features/drive/drive.module').then(m => m.DriveModule)
  },
  {
    path: 'shared',
    component: WorkInProgressComponent,
    data: { featureName: 'Shared with Me' }
  },
  {
    path: 'file-request',
    component: WorkInProgressComponent,
    data: { featureName: 'File Request' }
  },
  {
    path: 'team-folder',
    component: WorkInProgressComponent,
    data: { featureName: 'Team Folder' }
  },
  {
    path: 'data-templates',
    component: WorkInProgressComponent,
    data: { featureName: 'Data Templates' }
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 