import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { AppFile, FileService } from './file.service';

@Component({

  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule ,HttpClientModule],
  templateUrl:'./app.component.html',
  styleUrls: ['./app.component.css'] ,
  providers: [FileService]

})
export class AppComponent implements OnInit {

  files: AppFile[] = [];
  files$!: Observable<AppFile[]>;
  displayedFiles: AppFile[] = [];
  keyword = '';

  constructor(private fileService: FileService) {
  }

  ngOnInit(): void {
      this.files$ = this.fileService.files$;
      this.fileService.files$.subscribe(files => {
        this.files = files;
        this.displayedFiles = files;
      });

     this.fileService.loadFolder();
  }
  search() {
    if (!this.keyword) {
      this.displayedFiles = this.files;
      console.log(this.displayedFiles);
    } else {
      this.displayedFiles = this.files.filter(f =>
        f.name.toLowerCase().includes(this.keyword.toLowerCase())
      );
    }
  }

  download(fileName: string) {
    const confirmDownload = window.confirm(`Bạn có muốn tải file "${fileName}" không?`);
    if (!confirmDownload) {
      return;
    }

    this.fileService.downloadFile(fileName).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName; 
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
