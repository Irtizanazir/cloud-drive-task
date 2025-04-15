import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService, UploadFileRequest } from '../../../../core/services/file.service';
import { UploadFile } from '../../../../core/models/file.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
type FileStatus = 'pending' | 'uploading' | 'completed' | 'error';
@Component({
  selector: 'app-file-upload',
  templateUrl: './files-upload-dialog.component.html',
  styleUrls: ['./files-upload-dialog.component.scss']
})
export class FilesUploadDialogComponent {
  @Output() uploadComplete = new EventEmitter<void>();
  totalSize = 0;
  isDragging = false;
  uploading = false;
  uploadFiles: UploadFile[] = [];
  noSizeError: boolean=true;
  constructor(
    private fileService: FileService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<FilesUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { parentId: string | null }
  ) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.addFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.addFiles(Array.from(input.files));
    }
  }

  private addFiles(files: File[]): void {
    const newFiles = files.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const,
      tags:["important"]
    }));
    this.uploadFiles.push(...newFiles);
   
    this.uploadFiles.forEach((uploadFile, index) => {
      const progressInterval = setInterval(() => {
        if (uploadFile.progress >= 100) {
          uploadFile.status = 'completed';
          this.updateTotalSize();
          clearInterval(progressInterval);
          this.uploading = false; 
        } else {
          uploadFile.progress += 10; // Increase progress
          this.uploading=true
        }
      
      }, 300);
      
    });
     
  }
async uploadAllFiles(): Promise<void> {
  try {
    const formData = new FormData();
    const uploadRequests: UploadFileRequest[] = [];

    this.uploadFiles.forEach((uploadFile, index) => {
      formData.append('files', uploadFile.file);
      
      const request: UploadFileRequest = {
        name: uploadFile.file.name,
        type: this.getFileType(uploadFile.file.type),
        size: uploadFile.file.size,
        parentId: this.data?.parentId || undefined,
        tags:["important",""]
      };
      uploadRequests.push(request);
    });

    const files = await this.fileService.uploadFiles(formData, uploadRequests).toPromise();
    this.uploadFiles.forEach(uploadFile => {
      uploadFile.status = 'completed';
      uploadFile.progress = 100;
    });
    this.uploadComplete.emit();
    this.dialogRef.close(true);
    this.snackBar.open('Files uploaded successfully', 'Close', { duration: 3000,  panelClass: ['snackbar-success'] });
  } catch (error) {
    this.uploadFiles.forEach(uploadFile => {
      uploadFile.status = 'error';
    });
    console.error('Error uploading files:', error);
    this.snackBar.open('Error uploading files', 'Close', { duration: 3000 });
  } finally {
    
  }
}
  private updateTotalSize(): void {
    this.totalSize =+ this.uploadFiles.reduce((total, file) => total + file.file.size, 0);
  }

  isReadyToSave(): boolean {
    const ready = this.uploadFiles.some(file => file.status === 'completed');
    return ready;
  }

  
  removeFile(file: UploadFile): void {
    const index = this.uploadFiles.indexOf(file);
    if (index > -1) {
      this.uploadFiles.splice(index, 1);
      this.updateTotalSize();
    }
    
  }

 
  getFileIcon(file: File): string {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'movie';
    if (file.type.startsWith('audio/')) return 'audiotrack';
    if (file.type === 'application/pdf') return 'picture_as_pdf';
    return 'insert_drive_file';
  }
  private getFileType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.includes('document') || mimeType.includes('text')) return 'document';
    return 'other';
  }
  isUploading(status: FileStatus): boolean {
    return status === 'uploading';
  }

  isCompleted(status: FileStatus): boolean {
    return status === 'completed';
  }

  isError(status: FileStatus): boolean {
    return status === 'error';
  }


  onFileTooLarge(files: File[]) {
    this.snackBar.open(
      `These files exceed 100 MB:\n${files.map(f => f.name).join(', ')}`,
      'Close',
      { duration: 3000 }
    );
    this.uploadFiles = this.uploadFiles.filter((uploadFile: UploadFile) =>
      !files.some(file =>
        file.name === uploadFile.file.name && file.size === uploadFile.file.size
      )
    );
    
  }
  
} 