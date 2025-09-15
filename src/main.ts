import { provideHttpClient, withFetch } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
// import { appConfig } from './app/app.config';  appConfig

bootstrapApplication(AppComponent , {providers:[
    provideHttpClient(withFetch()) ,
  ]})
  .catch((err) => console.error(err));
