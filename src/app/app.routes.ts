import { Routes } from '@angular/router';
import { FileListComponent } from './features/drive/file-list/file-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'drive', pathMatch: 'full' },
  { path: 'drive', component: FileListComponent }
]; 