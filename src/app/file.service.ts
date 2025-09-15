import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppFile {
  name: string;
  created: string;
  type:string;
  size: string;
}

@Injectable({
  providedIn: 'root'
})

export class FileService {

  private filesSubject = new BehaviorSubject<AppFile[]>([]);
  files$ = this.filesSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadFolder() {
    this.http.get<AppFile[]>('http://localhost:3000/files').subscribe({
      next: (files) => this.filesSubject.next(files),
      error: (err) => console.error('API error:', err)
    });
  }

  downloadFile(fileName: string) {
    return this.http.get(`http://localhost:3000/files/download/${fileName}`, {
      responseType: 'blob' // nhận về dạng nhị phân
    });
  }
}
