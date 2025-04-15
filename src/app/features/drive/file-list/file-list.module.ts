import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FileListComponent } from './file-list.component';
import { FileOperationsModule } from '../file-operations/file-operations.module';
import { SharedModule } from '../../../shared/shared.module';
import { FileService } from '../../../core/services/file.service';
import { EmptyDriveComponent } from './empty-drive/empty-drive.component';

const routes: Routes = [
  {
    path: '',
    component: FileListComponent
  },
  {
    path: 'folder/:folderId',
    component: FileListComponent
  }
];

const materialModules = [
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatChipsModule,
  MatSelectModule,
  MatCheckboxModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatListModule,
  MatRippleModule,
  MatAutocompleteModule,
  MatStepperModule,
  MatExpansionModule,
  MatGridListModule,
  MatSidenavModule,
  MatToolbarModule,
  MatBottomSheetModule,
  MatButtonToggleModule,
  MatDatepickerModule,
  MatNativeDateModule
 
];

@NgModule({
  declarations: [
    FileListComponent,
    EmptyDriveComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ...materialModules,
    FileOperationsModule,
    SharedModule
  ],
  exports: [
    FileListComponent,
    EmptyDriveComponent
  ],
  providers: [
    FileService
  ]
})
export class FileListModule { } 