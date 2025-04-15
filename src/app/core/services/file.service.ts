import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface File {
  id: string;
  name: string;
  type: string;
  size: number;
  path?: string;
  createdAt: string;
  updatedAt: string;
  modifiedDate: string;
  parentId?: string;
  files?: number;
  description?: string;
  tags?: string[];
  isDeleted?: boolean;
  deletedAt?: string;
  sharedWith?: string[];
  progress?:number
}

export interface FileListResponse {
  items: File[];
  total: number;
}

export interface CreateFolderRequest {
  name: string;
  parentId?: string | null;
}

export interface UploadFileRequest {
  name: string;
  type: string;
  size: number;
  parentId?: string | null;
  tags?:string[]
}

export interface Breadcrumb {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = environment.apiUrl; 
  // JSON Server URL

  constructor(private http: HttpClient) {}

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  getFiles(): Observable<FileListResponse> {
    return this.http.get<File[]>(`${this.apiUrl}/files`, {
      observe: 'response'
    }).pipe(
      map(response => ({
        items: (response.body || []).filter(file => !file.parentId),
        total: Number(response.headers.get('X-Total-Count')) || 0
      }))
    );
  }

  getFolderContents(folderId: string): Observable<FileListResponse> {
    return this.http.get<File[]>(`${this.apiUrl}/files`, {
      observe: 'response'
    }).pipe(
      map(response => ({
        items: (response.body || []).filter(file => file.parentId === folderId),
        total: Number(response.headers.get('X-Total-Count')) || 0
      }))
    );
  }

  getFolderPath(folderId: string): Observable<Breadcrumb[]> {
    return this.http.get<File>(`${this.apiUrl}/files/${folderId}`).pipe(
      switchMap(folder => {
        if (folder.parentId) {
          return this.getFolderPath(folder.parentId).pipe(
            map(path => [...path, { id: folder.id, name: folder.name }])
          );
        }
        return of([{ id: folder.id, name: folder.name }]);
      })
    );
  }

  getFileDetails(id: string): Observable<File> {
    return this.http.get<File>(`${this.apiUrl}/files/${id}`);
  }

  createFolder(request: CreateFolderRequest): Observable<File> {
    const now = new Date().toISOString();
    const newFolder: File = {
      id: this.generateId(),
      name: request.name,
      type: 'application/folder',
      size: 0,
      files: 0,
      parentId: request.parentId || undefined,
      createdAt: now,
      updatedAt: now,
      modifiedDate: now,
    };
    return this.http.post<File>(`${this.apiUrl}/files/folder`, newFolder);
  }

  uploadFiles(formData: FormData, requests: UploadFileRequest[]): Observable<File[]> {
    console.log(formData)
    return new Observable(observer => {
      const uploadObservables = requests.map((request, index) => {
        const id = this.generateId();
        const singleFormData = new FormData();
        const file = formData.getAll('files')[index];
        console.log(file)
        if (file instanceof Blob) {
          singleFormData.append('file', file);
          singleFormData.append('id', id);
          singleFormData.append('name', request.name);
          singleFormData.append('parentId', request.parentId || '');
          return this.http.post<File>(`${this.apiUrl}/upload`, singleFormData);
        } else {
          throw new Error('Invalid file type');
        }
      });

      forkJoin(uploadObservables).subscribe({
        next: (files) => {
          observer.next(files);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  updateFileMetadata(id: string, metadata: Partial<File>): Observable<File> {
    return this.http.patch<File>(`${this.apiUrl}/files/${id}`, {
      ...metadata,
      updatedAt: new Date().toISOString(),
      modifiedDate: new Date().toISOString()
    });
  }

  downloadFile(fileId: string): Observable<Blob> {
    return this.getFileDetails(fileId).pipe(
      switchMap(file => {
        if (file.path) {
          // Download the actual file from the content path
          return this.http.get(`${this.apiUrl}${file.path}`, {
            responseType: 'blob'
          });
        } else {
          // Fallback for files without paths (legacy data)
          const content = 'This is a mock file content';
          const blob = new Blob([content], { type: 'text/plain' });
          return of(blob);
        }
      })
    );
  }

  deleteFile(fileId: string): Observable<void> {
    // Instead of permanent deletion, move to trash
    return this.getFileDetails(fileId).pipe(
      map(file => ({
        ...file,
        isDeleted: true,
        deletedAt: new Date().toISOString()
      })),
      switchMap(file => {
        // Remove from files and add to trash
        return this.http.delete<void>(`${this.apiUrl}/files/${fileId}`).pipe(
          switchMap(() => this.http.post<void>(`${this.apiUrl}/trash`, file))
        );
      })
    );
  }

  // shareFile(fileId: string, users: string[]): Observable<File> {
  //   return this.getFileDetails(fileId).pipe(
  //     map(file => ({
  //       ...file,
  //       sharedWith: [...(file.sharedWith || []), ...users]
  //     })),
  //     switchMap(updatedFile => this.updateFileMetadata(fileId, updatedFile))
  //   );
  // }

  getSharedFiles(): Observable<FileListResponse> {
    return this.http.get<File[]>(`${this.apiUrl}/files`, {
      params: new HttpParams().set('sharedWith_like', '.*'),
      observe: 'response'
    }).pipe(
      map(response => ({
        items: response.body || [],
        total: Number(response.headers.get('X-Total-Count')) || 0
      }))
    );
  }

 
} 