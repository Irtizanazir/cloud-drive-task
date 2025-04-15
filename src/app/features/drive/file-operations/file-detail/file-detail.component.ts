import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileService } from '../../../../core/services/file.service';
import { FileMetadata } from '../../../../core/models/file.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-file-detail',
  template: `
    <h2 mat-dialog-title>File Details</h2>
    <mat-dialog-content>
      <form [formGroup]="fileForm"  class="mt-3">
        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter file name">
          <mat-error *ngIf="fileForm.get('name')?.hasError('required')">
            File name is required
          </mat-error>
        </mat-form-field>
    
        
        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Tags</mat-label>
          <input matInput formControlName="tags" placeholder="Enter tags (comma-separated)">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-divider></mat-divider>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button 
             class="save-button"
              [disabled]="!fileForm.valid || loading"
              (click)="onSubmit()">
        Save
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .w-100 {
      width: 100%;
    }
    mat-dialog-content{
    padding-bottom:0px
    }  
    mat-form-field {
      margin-bottom: 16px;
    }
    .save-button{
    background-color: var(--primary-color);
    color:white;
    border-radius:100px;
    font-weight:300;
    font-size: 14px;
    height: 30px;
    }
  `]
})
export class FileDetailComponent {
  fileForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private fileService: FileService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<FileDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public file: FileMetadata
  ) {
    this.fileForm = this.fb.group({
      name: [file.name, Validators.required],
      description: [file.description || ''],
      tags: [file.tags ? file.tags.join(', ') : '']
    });
  }

  onSubmit(): void {
    if (this.fileForm.valid) {
      this.loading = true;
      const formValue = this.fileForm.value;
      const metadata: Partial<FileMetadata> = {
        name: formValue.name,
        // description: formValue.description,
        tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : []
      };

      this.fileService.updateFileMetadata(this.file.id, metadata)
        .subscribe({
          next: (updatedFile) => {
            this.snackBar.open('File metadata updated successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(updatedFile);
          },
          error: (error) => {
            console.error('Error updating file metadata:', error);
            this.snackBar.open('Error updating file metadata', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 