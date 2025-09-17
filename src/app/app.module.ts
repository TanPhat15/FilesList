import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { TreeModule } from 'primeng/tree';

@NgModule({
    declarations: [
        AppComponent,
        // FilesListComponent,
        // DownloadComponent,
],
    imports: [
        BrowserModule ,
        RouterModule.forRoot(routes),
        BrowserAnimationsModule,
        MatDialogModule,
        MatButtonModule , 
        TreeModule,
        TableModule
],
    providers: [],
    bootstrap: [AppComponent]
    })
    export class AppModule { }