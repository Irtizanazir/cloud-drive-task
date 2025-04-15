import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { File } from '../../../../core/services/file.service';

@Component({
  selector: 'app-file-delete-dialog',
  template: `
    <div class="delete-dialog-container">
      <div class="dialog-content">
        <div class="icon-container">
          <img src="assets/icons/delete-icon.svg" alt="Delete" class="delete-icon">
        </div>
        <h2 mat-dialog-title>Delete File?</h2>
        <mat-dialog-content>
          <p>Are you sure you want to delete this file from your storage?</p>
        </mat-dialog-content>
      </div>
      <mat-divider></mat-divider>
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-flat-button class="delete-button" (click)="onDelete()">
          Yes, Delete
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .delete-dialog-container {
      width: 400px;
      height: 352px;
      display: flex;
      flex-direction: column;
    }
    .dialog-content {
      flex-grow: 1;
      text-align: center;
      padding: 24px 24px 0;
    }
    .icon-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 16px;
    }
    .delete-icon {
      width: 70px;
      height: 70px;
    }
    :host ::ng-deep .mat-mdc-dialog-title {
      margin: 0;
      font-size: 24px !important;
      font-weight: 600 !important;
      color: #000;
      margin-bottom: 8px;
    }
    mat-dialog-content {
      margin-bottom: 24px;
      p {
        color: rgba(0, 0, 0, 0.87);
        font-size: 16px;
        line-height: 1.5;
        margin: 0;
      }
    }
    mat-dialog-actions {
      padding: 12px 24px;
      margin: 0;
      button {
        min-width: 100px;
        border-radius: 100px;
        &.delete-button {
          background-color: #f44336;
          color: white;
        }
      }
    }
  `]
})
export class FileDeleteDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<FileDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: File
  ) {
    // Set dialog dimensions
    dialogRef.updateSize('400px', '352px');
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onDelete(): void {
    this.dialogRef.close(true);
  }
}
 