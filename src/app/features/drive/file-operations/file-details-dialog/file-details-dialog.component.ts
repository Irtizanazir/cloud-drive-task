import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { File } from '../../../../core/services/file.service';

@Component({
  selector: 'app-file-details-dialog',
  template: `
    <h3 mat-dialog-title><strong>File Details</strong></h3>
    <mat-dialog-content>
        <p><strong>Name:</strong> {{data.name}}</p>
        <p><strong>Size:</strong> {{data.size | fileSize}}</p>
        <p><strong>Modified:</strong> {{data.modifiedDate | date}}</p>
        <p><strong>Type:</strong> {{data.type}}</p>
     
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `
})
export class FileDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FileDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: File 
  ) {
  }
} 