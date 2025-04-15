import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService, UploadFileRequest } from '../../../../core/services/file.service';
import { UploadFile } from '../../../../core/models/file.model';
import { catchError, finalize, interval, tap, throwError } from 'rxjs';
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
      // this.uploadFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    console.log(event)
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      console.log(Array.from(input.files))
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
  getStatusText(upload: UploadFile): string {
    switch (upload.status) {
      case 'pending': return 'Waiting to upload...';
      case 'uploading': return `${upload.progress}%`;
      case 'completed': return 'Upload complete';
      case 'error': return upload.error || 'Upload failed';
      default: return '';
    }
  }
  // private startUpload(upload: UploadFile): void {
  //   upload.status = 'uploading';
    
  //   this.uploadService.uploadFile(upload.file,  undefined).subscribe({
  //     // this.data.parentId ||
  //     next: (event) => {
  //       if (event.type === HttpEventType.UploadProgress && event.total) {
  //         upload.progress = Math.round(100 * event.loaded / event.total);
  //       } else if (event.type === HttpEventType.Response) {
  //         upload.status = 'completed';
  //         upload.progress = 100;
  //         upload.fileNode = event.body ?? undefined;
  //         if (event.body) {
  //           this.completedUploads.push(event.body);
  //         }
  //         console.log('Upload completed:', upload); // Debug log
  //       }
  //     },
  //     error: (error) => {
  //       upload.status = 'error';
  //       upload.error = error.message || 'Upload failed';
  //       console.error('Upload error:', error);
  //     }
  //   });
  // }
  isReadyToSave(): boolean {
    const ready = this.uploadFiles.some(file => file.status === 'completed');
    console.log('Ready to save:', ready, this.uploadFiles); // Debug log
    return ready;
  }

  isPreviewable(file: File): boolean {
    return file.type.startsWith('image/') || file.type === 'application/pdf';
  }
  
  // addMoreFiles(): void {
  //   this.fileInput.click();
  //   this.fileInput.onchange = () => {
  //     if (this.fileInput.files) {
  //       this.addFiles(Array.from(this.fileInput.files));
  //       this.fileInput.value = ''; // Reset input
  //     }
  //   };
  // }

  removeFile(file: UploadFile): void {
    const index = this.uploadFiles.indexOf(file);
    if (index > -1) {
      this.uploadFiles.splice(index, 1);
      this.updateTotalSize();
    }
    
  }

  // isAllCompleted(): boolean {
  //   return this.uploadFiles.length > 0 && 
  //          this.uploadFiles.every(f => f.status === 'completed');
  // }

  // hasCompletedUploads(): boolean {
  //   // return this.completedUploads.length > 0;
  //   return true;
  // }

  // onCancel(): void {
  //   this.dialogRef.close();
  // }

  onSave(): void {
    // this.dialogRef.close(this.completedUploads);
  }
  // previewFile(upload: UploadFile): void {
  //   if (!this.isPreviewable(upload.file)) return;

  //   // this.dialog.open(FilePreviewComponent, {
  //   //   data: {
  //   //     file: upload.file,
  //   //     title: upload.file.name
  //   //   },
  //   //   maxWidth: '100vw',
  //   //   maxHeight: '100vh',
  //   //   height: '90vh',
  //   //   width: '90vw',
  //   //   panelClass: 'file-preview-dialog'
  //   // });
  // }
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

  getProgressBarColor(status: FileStatus): 'warn' | 'primary' {
    return this.isError(status) ? 'warn' : 'primary';
  }

  getProgressBarMode(status: FileStatus): 'determinate' | 'indeterminate' {
    return this.isUploading(status) ? 'determinate' : 'indeterminate';
  }
  // formatFileSize(bytes: number): string {
  //   if (bytes === 0) return '0 B';
  //   const k = 1024;
  //   const sizes = ['B', 'KB', 'MB', 'GB'];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  // }

} 