import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService, File as FileModel } from '../../../core/services/file.service';
import { CreateFolderDialogComponent, FileDeleteDialogComponent, FileDetailComponent, FileDetailsDialogComponent } from '../file-operations';
import { saveAs } from 'file-saver';
import { switchMap } from 'rxjs/operators';
import { FilesUploadDialogComponent } from '../file-operations/files-upload-dialog/files-upload-dialog.component';

type ViewType = 'files' | 'shared' | 'recent' | 'trash';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('folderInput') folderInput!: ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isSearchExpanded = false;
  files: FileModel[] = [];
  folders: FileModel[] = [];
  loading = false;
  searchQuery = '';
  viewMode: 'grid' | 'list' = 'grid';
  sortField: 'name' | 'modifiedDate' | 'size' = 'modifiedDate';
  sortDirection: 'asc' | 'desc' = 'desc';
  currentFolder: string | null = null;
  breadcrumbs: { id: string; name: string }[] = [];
  totalItems = 0;
  currentView: ViewType = 'files';
  readonly apiUrl = 'http://localhost:3000';
  // Pagination properties
  pageSize = 5;
  pageSizeOptions = [5, 10, 25];
  currentPage = 0;
  displayedFiles: FileModel[] = [];

  constructor(
    private fileService: FileService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private paginatorIntl: MatPaginatorIntl
  ) {
    // Customize paginator labels
    this.paginatorIntl.itemsPerPageLabel = 'Items per page:';
    this.paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0) {
        return '0 of 0';
      }
      const start = page * pageSize + 1;
      const end = Math.min((page + 1) * pageSize, length);
      return `${start} – ${end} of ${length}`;
    };
  }

  ngOnInit(): void {
    // Subscribe to route params to get the current view and folder
    this.route.params.pipe(
      switchMap(params => {
        this.currentView = params['view'] as ViewType;
        this.currentFolder = params['folderId'] || null;
        this.loading = true;
        return this.loadFiles();
      })
    ).subscribe({
      next: (response) => {
        this.files = response.items.filter(item => item.type && !item.type.includes('folder'));
        this.folders = response.items.filter(item => item.type && item.type.includes('folder'));
        this.totalItems = response.total;
        this.loading = false;
        this.updateBreadcrumbs();
        this.updateDisplayedFiles();
      },
      error: (error) => {
        console.error('Error loading files:', error);
        this.loading = false;
        this.snackBar.open('Error loading files', 'Close', { duration: 3000 });
      }
    });
  }

  private loadFiles() {
    if (this.currentFolder) {
      return this.fileService.getFolderContents(this.currentFolder);
    }
    
     return this.fileService.getFiles();
  }

  private updateBreadcrumbs(): void {
    if (this.currentFolder) {
      this.fileService.getFolderPath(this.currentFolder).subscribe({
        next: (path) => {
        this.breadcrumbs = path;
        },
        error: (error) => {
          console.error('Error loading breadcrumbs:', error);
        }
      });
    } else {
      this.breadcrumbs = [];
    }
  }

  navigateToFolder(folder: FileModel): void {
    if (this.currentView) {
      this.router.navigate([this.currentView, folder.id]);
    } else {
      this.router.navigate(['drive/folder', folder.id]);
    }
  }

  navigateToBreadcrumb(folderId: string | null): void {
    if (this.currentView) {
      if (folderId) {
        this.router.navigate([this.currentView, folderId]);
      } else {
        this.router.navigate([this.currentView]);
      }
    } else {
      if (folderId) {
        this.router.navigate(['files', folderId]);
      } else {
        this.router.navigate(['files']);
      }
    }
  }


  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  sort(field: 'name' | 'modifiedDate' | 'size'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    
    const allItems = [...this.folders, ...this.files];
    allItems.sort((a, b) => this.compareItems(a, b));

    this.folders = allItems.filter(item => item.type.includes('folder'));
    this.files = allItems.filter(item => !item.type.includes('folder'));
    this.updateDisplayedFiles();
  }

  private compareItems(a: FileModel, b: FileModel): number {
    const direction = this.sortDirection === 'asc' ? 1 : -1;
    
    switch (this.sortField) {
      case 'name':
        return direction * a.name.localeCompare(b.name);
      case 'modifiedDate':
        return direction * (new Date(a.modifiedDate).getTime() - new Date(b.modifiedDate).getTime());
      case 'size':
        return direction * (a.size - b.size);
      default:
        return 0;
    }
  }

  // applyFilter(): void {
  //   const filterValue = this.searchQuery.toLowerCase().trim();
    
  //   if (!filterValue) {
  //     this.loadCurrentFolder();
  //     return;
  //   }

  //   const allItems = [...this.folders, ...this.files];
  //   const filteredItems = allItems.filter(item => 
  //     item.name.toLowerCase().includes(filterValue)
  //   );

  //   this.folders = filteredItems.filter(item => item.type.includes('folder'));
  //   this.files = filteredItems.filter(item => !item.type.includes('folder'));
  // }

  // private convertFileListToArray(fileList: FileList | null): File[] {
  //   return fileList ? Array.from(fileList) : [];
  // }

  uploadFile(): void {
    const dialogRef = this.dialog.open(FilesUploadDialogComponent, {
      width: '450px',
      data: { parentId: this.currentFolder }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result === true) {
        this.loadCurrentFolder();
      }
    });
  }

  uploadFolder(): void {
    if (this.folderInput) {
      this.folderInput.nativeElement.click();
    }
  }

  // handleFileUpload(files: File[]): void {
  //   if (!files || files.length === 0) return;

  //   const formData = new FormData();
  //   const uploadRequests: UploadFileRequest[] = [];

  //   files.forEach((file, index) => {
  //     formData.append(`file${index}`, file);
      
  //     // Create upload request for each file
  //     const request: UploadFileRequest = {
  //       name: file.name,
  //       type: file.type,
  //       size: file.size,
  //       parentId: this.currentFolder || undefined
  //     };
  //     uploadRequests.push(request);
  //   });

  //   // Upload files with progress tracking
  //   this.fileService.uploadFiles(formData, uploadRequests).subscribe({
  //     next: (response) => {
  //           this.snackBar.open('Files uploaded successfully', 'Close', { duration: 3000 });
  //           this.loadCurrentFolder();
  //     },
  //     error: (error) => {
  //       console.error('Error uploading files:', error);
  //       this.snackBar.open('Error uploading files', 'Close', { duration: 3000 });
  //     }
  //   });
  // }

  private loadCurrentFolder(): void {
    this.loading = true;
    const request = this.currentFolder ? 
      this.fileService.getFolderContents(this.currentFolder) : 
      this.fileService.getFiles();

    request.subscribe({
      next: (response) => {
        console.log( this.files )
        this.files = response.items.filter(item => item.type && !item.type.includes('folder'));
        this.folders = response.items.filter(item => item.type && item.type.includes('folder'));
        this.totalItems = response.total;
        this.updateDisplayedFiles()
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading files:', error);
        this.loading = false;
        this.snackBar.open('Error loading files', 'Close', { duration: 3000 });
      }
    });
  }

  openCreateFolderDialog(): void {
    console.log('Opening create folder dialog with parentId:', this.currentFolder);
    const dialogRef = this.dialog.open(CreateFolderDialogComponent, {
      width: '400px',
      data: { parentId: this.currentFolder }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      if (result) {
        console.log('Creating folder with name:', result, 'and parentId:', this.currentFolder);
        this.fileService.createFolder({
          name: result,
          parentId: this.currentFolder
        }).subscribe({
          next: (response) => {
            console.log('Folder created successfully:', response);
            this.snackBar.open('Folder created successfully', 'Close', { duration: 3000 });
            this.loadCurrentFolder();
          },
          error: (error) => {
            console.error('Error creating folder:', error);
            this.snackBar.open('Error creating folder', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  downloadFile(file: FileModel): void {
    this.loading = true;
    this.fileService.downloadFile(file.id).subscribe({
      next: (blob) => {
        saveAs(blob, file.name);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error downloading file:', error);
        this.snackBar.open('Error downloading file', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  shareFile(file: FileModel): void {
    const dialogRef = this.dialog.open(FileDetailsDialogComponent, {
      width: '400px',
      data: file
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.users) {
        // this.fileService.shareFile(file.id, result.users).subscribe({
        //   next: () => {
        //     this.snackBar.open('File shared successfully', 'Close', { duration: 3000 });
        //   },
        //   error: (error) => {
        //     console.error('Error sharing file:', error);
        //     this.snackBar.open('Error sharing file', 'Close', { duration: 3000 });
        //   }
        // });
      }
    });
  }
  
  updateFileMetaData(file: FileModel): void {
    const dialogRef = this.dialog.open(FileDetailComponent, {
      width: '400px',
      data: file
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        file.name=result.name,
        file.tags=result.tags
      }
    });
  }

  deleteFile(file: FileModel): void {
    const dialogRef = this.dialog.open(FileDeleteDialogComponent, {
      width: '400px',
      data: { 
        title: 'Delete File',
        message: `Are you sure you want to delete "${file.name}"?`,
        confirmButton: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fileService.deleteFile(file.id).subscribe({
          next: () => {
            this.snackBar.open('File deleted successfully', 'Close', { duration: 3000 });
            this.loadCurrentFolder();
          },
          error: (error) => {
            console.error('Error deleting file:', error);
            this.snackBar.open('Error deleting file', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  private getFileType(file: { type: string }): string {
    if (!file.type) return 'file';
    
    const type = file.type.toLowerCase();
    if (type.includes('folder')) return 'folder';
    if (type.includes('image')) return 'image';
    if (type.includes('video')) return 'video';
    if (type.includes('audio')) return 'audio';
    if (type.includes('text')) return 'text';
    if (type.includes('pdf')) return 'pdf';
    if (type.includes('word') || type.includes('doc')) return 'word';
    if (type.includes('excel') || type.includes('sheet') || type.includes('xls')) return 'excel';
    if (type.includes('powerpoint') || type.includes('presentation') || type.includes('ppt')) return 'powerpoint';
    if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return 'archive';
    if (type.includes('code') || type.includes('script')) return 'code';
    
    return 'file';
  }

  getFileIcon(file: FileModel): string {
    if (file.type.includes('folder')) {
        return 'folder';
    }
    
    const fileType = this.getFileType(file);
    switch (fileType) {
      case 'image':
        return 'image';
      case 'video':
        return 'videocam';
      case 'audio':
        return 'audiotrack';
      case 'text':
        return 'description';
      case 'pdf':
        return 'picture_as_pdf';
      case 'word':
        return 'article';
      case 'excel':
        return 'table_chart';
      case 'powerpoint':
        return 'slideshow';
      case 'archive':
        return 'folder_zip';
      case 'code':
        return 'code';
      case 'application':
        return 'insert_drive_file';
      default:
        return 'insert_drive_file';
    }
  }

  // toggleSearch(): void {
  //   this.isSearchExpanded = !this.isSearchExpanded;
  //   if (this.isSearchExpanded) {
  //     setTimeout(() => {
  //       this.searchInput.nativeElement.focus();
  //     });
  //   } else {
  //     this.searchQuery = '';
  //     this.loadCurrentFolder();
  //   }
  // }

  // clearSearch(): void {
  //   this.searchQuery = '';
  //   this.loadCurrentFolder();
  // }

  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     const files = Array.from(input.files);
  //     this.handleFileUpload(files);
  //     if (input) {
  //       input.value = '';
  //     }
  //   }
  // }

  // onFolderSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     const files = Array.from(input.files);
  //     this.handleFileUpload(files);
  //   }
  // }


  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedFiles();
  }

  private updateDisplayedFiles(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.displayedFiles = this.files.slice(start, end);
  }
}
