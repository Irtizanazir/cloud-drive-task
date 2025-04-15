import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FileService } from './file.service';
import { environment } from '../../../environments/environment';

describe('FileService', () => {
  let service: FileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FileService]
    });

    service = TestBed.inject(FileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get files with pagination', () => {
    const mockResponse = {
      items: [
        { id: '1', name: 'test.pdf', type: 'application/pdf', size: 1000, createdAt: new Date() }
      ],
      total: 1
    };

    service.getFiles(0, 10).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/files?page=0&pageSize=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a folder', () => {
    const folderName = 'New Folder';
    const mockResponse = {
      id: '1',
      name: folderName,
      type: 'folder',
      size: 0,
      createdAt: new Date()
    };

    service.createFolder(folderName).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/files/folders`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: folderName });
    req.flush(mockResponse);
  });

  it('should delete a file', () => {
    const fileId = '1';

    service.deleteFile(fileId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/files/${fileId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
}); 