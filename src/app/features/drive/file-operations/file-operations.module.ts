import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FileDetailsDialogComponent } from './file-details-dialog/file-details-dialog.component';
import { FileDeleteDialogComponent } from './file-delete-dialog/file-delete-dialog.component';
import { FileDetailComponent } from './file-detail/file-detail.component';
import { CreateFolderDialogComponent } from './create-folder-dialog/create-folder-dialog.component';
import { FilesUploadDialogComponent } from './files-upload-dialog/files-upload-dialog.component';

@NgModule({
  declarations: [
    FileDetailsDialogComponent,
    FileDeleteDialogComponent,
    FileDetailComponent,
    CreateFolderDialogComponent,
    FilesUploadDialogComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    FileDetailsDialogComponent,
    FileDeleteDialogComponent,
    FileDetailComponent,
    CreateFolderDialogComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FileOperationsModule { } 