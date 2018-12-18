import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TokenInterceptorService } from 'src/services/token-interceptor.service';
import { FormsModule } from '@angular/forms';
import { Nonogram2dComponent } from "src/app/nonograms/nonogram2d/Nonogram2dComponent";
import { NonogramMinimapComponent } from './nonograms/nonogram-minimap/nonogram-minimap.component';
import { PaletteComponent } from './nonograms/palette/palette.component';
import { NavigatorComponent } from './nonograms/navigator/navigator.component';
import { Nonogram3dViewComponent } from './nonograms/nonogram3d-view/nonogram3d-view.component';
import { RulesListComponent } from './nonograms/rules-list/rules-list.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { NonogramFullComponent } from './nonograms/nonogram-full/nonogram-full.component';
import { TextboxDialogComponent } from './nonograms/textbox-dialog/textbox-dialog.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    Nonogram2dComponent,
    NonogramMinimapComponent,
    NonogramFullComponent,
    PaletteComponent,
    NavigatorComponent,
    Nonogram3dViewComponent,
    RulesListComponent,
    TextboxDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ColorPickerModule,
    BrowserAnimationsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
