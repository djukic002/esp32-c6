import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { DeviceStatusComponent } from './components/device-status/device-status.component';
import { RgbControlComponent } from './components/rgb-control/rgb-control.component';
import { LastCommandComponent } from './components/last-command/last-command.component';
import { HistoryComponent } from './components/history/history.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    DeviceStatusComponent,
    RgbControlComponent,
    LastCommandComponent,
    HistoryComponent,
    DashboardComponent
  ],

  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,

    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    NgChartsModule
  ],

  providers: [],

  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}