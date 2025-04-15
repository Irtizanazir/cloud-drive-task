import { Subscription } from "rxjs";

export interface FileMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  path:string;
  createdAt: string;
  updatedAt: string;
  modifiedDate?: string;
  parentId?: string;
  files?: number;
  description?: string;
  tags?: string[];
  isDeleted?: boolean;
  deletedAt?: string;
  sharedWith?: string[];
}

export interface FileUploadResponse {
  success: boolean;
  file?: FileMetadata;
  error?: string;
}

export interface FileListResponse {
  files: FileMetadata[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
} 
export interface FileNode {
  id: string;
  name: string;
  type: string;
  size: number;
  modifiedDate: string;
  parentId?: string;
  children?: FileNode[];
} 
export interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  fileNode?: FileNode;
 
}

