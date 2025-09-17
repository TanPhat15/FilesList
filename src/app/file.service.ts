import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';

// export interface AppFile {
//   name: string;
//   created: string;
//   type:string;
//   size: string;
// }

@Injectable({
  providedIn: 'root'
})

export class FileService {

  private filesSubject = new BehaviorSubject<TreeNode[]>([]);
  files$ = this.filesSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadFolder() {
    this.http.get<TreeNode[]>('http://localhost:3000/files').subscribe({
      next: (files) => this.filesSubject.next(files),
      error: (err) => console.error('API error:', err)
    });
  }

  downloadFile(filePath: string): Observable<Blob> {
    return this.http.get(`http://localhost:3000/files/download/${encodeURIComponent(filePath)}`, {
      responseType: 'blob'
    });
  }

  // downloadFile(fileName: string) {
  //   return this.http.get(`http://localhost:3000/files/download/${fileName}`, {
  //     responseType: 'blob' // nhận về dạng nhị phân
  //   });
  // }
}
