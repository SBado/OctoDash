import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RoundProgressModule, ROUND_PROGRESS_DEFAULTS } from 'angular-svg-round-progressbar';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BottomBarComponent } from './bottom-bar/bottom-bar.component';
import { PrinterStatusComponent } from './printer-status/printer-status.component';
import { JobStatusComponent } from './job-status/job-status.component';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';
import { LayerProgressComponent } from './layer-progress/layer-progress.component';
import { InvalidConfigComponent } from './config/invalid-config/invalid-config.component';
import { NoConfigComponent } from './config/no-config/no-config.component';

@NgModule({
  declarations: [
    AppComponent,
    BottomBarComponent,
    PrinterStatusComponent,
    JobStatusComponent,
    LayerProgressComponent,
    InvalidConfigComponent,
    NoConfigComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RoundProgressModule,
    FormsModule
  ],
  providers: [AppService, ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }