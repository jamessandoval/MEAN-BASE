import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ResultComponent } from './result/result.component';

const appRoutes: Routes = [
  {
    path: 'results',
    component: ResultComponent,
    data: { title: 'Result List' }
  },{ path: '',
    redirectTo: '/books',
    pathMatch: 'full'
  }
];
@NgModule({
  declarations: [
    AppComponent,
    ResultComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }