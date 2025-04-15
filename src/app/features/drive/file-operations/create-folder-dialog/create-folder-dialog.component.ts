import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-folder-dialog',
  template: `
    <h2 mat-dialog-title>Create New Folder</h2>
    <mat-divider></mat-divider>

      <form [formGroup]="folderForm">
        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Folder Name</mat-label>
          <input matInput formControlName="folderName" placeholder="My works">
          <mat-error *ngIf="folderForm.get('folderName')?.hasError('required')">
            Folder name is required
          </mat-error>
        </mat-form-field>
      </form>

    <mat-divider></mat-divider>
    <mat-dialog-actions align="end">
      <button mat-button  [mat-dialog-close]="undefined">Cancel</button>
      <button mat-raised-button 
             class="create-button"
              [disabled]="!folderForm.valid"
              (click)="onSubmit()">
        Create
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .w-100 {
      width: 100%;
      padding:10px 25px;
      padding-top:30px
    }
    .create-button{
    background-color: var(--primary-color);
    color:white;
    border-radius:100px;
    font-weight:300;
    font-size: 14px;
    height: 30px;
    }
   mat-dialog-actions{
   padding:10px 20px
   }
  `]
})
export class CreateFolderDialogComponent implements OnInit {
  folderForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateFolderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { parentId: string | null }
  ) {
    this.folderForm = this.fb.group({
      folderName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
console.log(this.data)
  }

  onSubmit(): void {
    if (this.folderForm.valid) {
      this.dialogRef.close(this.folderForm.get('folderName')?.value);
    }
  }
} 