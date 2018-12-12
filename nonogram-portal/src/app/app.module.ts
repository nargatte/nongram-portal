import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TokenInterceptorService } from 'src/services/token-interceptor.service';
import { FormsModule } from '@angular/forms';
import { Nonogram2dComponent } from 'src/components/nonograms/nonogram2d/nonogram2d.component';

@NgModule({
  declarations: [
    AppComponent,
    Nonogram2dComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
