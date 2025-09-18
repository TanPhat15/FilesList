import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { Observable } from 'rxjs';
import { FileService } from './file.service';

@Component({

  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule ,HttpClientModule,TreeModule,NgxPaginationModule],
  templateUrl:'./app.component.html',
  styleUrls: ['./app.component.css'] ,
  providers: [FileService]

})
export class AppComponent implements OnInit {

  files: TreeNode[] = [];
  files$!: Observable<TreeNode[]>;
  displayedFiles: TreeNode[] = [];
  keyword = '';
  selectedFile!: TreeNode;

  p: number = 1;

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

  gohome(){
    this.ngOnInit();
  }

  onPageChange(event: any) {
    this.p = Number(event); // ép kiểu sang number
  }

  download(file : any) {
    if (!file || !file.data) {
      console.error('File không hợp lệ:', file);
      return;
    }
    const filePath = file.data.fullPath;
    const confirmDownload = window.confirm(`Bạn có muốn tải file "${file.data.name}" không?`);
    if (!confirmDownload) return;
  
    this.fileService.downloadFile(filePath).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.data.name;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
  
  onNodeSelect(event: any) {
    const node = event.node;
  
    if (node.children && node.children.length > 0) {
      node.expanded = true;
      this.displayedFiles = node.children;
      // console.log(this.displayedFiles);
    }
    else if (node.leaf) {
      this.download(node)
    }
  }
  getAllNodes(nodes: any[]): any[] {
    let result: any[] = [];
    for (let node of nodes) {
      result.push(node);
      if (node.children && node.children.length > 0) {
        result = result.concat(this.getAllNodes(node.children));
      }
    }
    return result;
  }
  
  search() {
    if (!this.keyword) {
      this.displayedFiles = this.files;
      // console.log(this.displayedFiles);
    } else {
      const allNodes = this.getAllNodes(this.files);
      this.displayedFiles = allNodes.filter(f =>
        f.data.name.toLowerCase().includes(this.keyword.toLowerCase())
      );
      this.keyword = ''
    }
  }
}
