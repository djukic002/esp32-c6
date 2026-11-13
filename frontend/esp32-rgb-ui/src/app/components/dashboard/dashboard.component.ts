import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

import {
  DeviceStatus,
  RGBColor,
  DeviceService
} from '../../services/device.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  selectedColor = '#7832FF';

  deviceStatus?: DeviceStatus;

  lastCommand = 'No command sent yet';
  lastCommandTime = '';
  lastStatusCheck = '';

  updatingFirmware = false;

  private statusSubscription?: Subscription;

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    this.checkDeviceStatus();

    this.statusSubscription = interval(5000).subscribe(() => {
      this.checkDeviceStatus();
    });
  }

  ngOnDestroy(): void {
    this.statusSubscription?.unsubscribe();
  }

  checkDeviceStatus(): void {
    this.deviceService.getStatus().subscribe({
      next: status => {
        this.deviceStatus = status;
        this.lastStatusCheck = new Date().toLocaleTimeString();
      },

      error: () => {
        this.deviceStatus = {
          device: this.deviceStatus?.device ?? 'ESP32-C6',
          online: false,
          ip: this.deviceStatus?.ip ?? ''
        };

        this.lastStatusCheck = new Date().toLocaleTimeString();
        this.lastCommand = 'ESP32 is offline';
      }
    });
  }

  applyColor(color: RGBColor): void {
    this.deviceService.setColor(color).subscribe({
      next: () => {
        this.lastCommand = 'Color applied successfully';
        this.lastCommandTime = new Date().toLocaleTimeString();

        this.checkDeviceStatus();
      },

      error: error => {
        console.error('Failed to set color:', error);

        this.lastCommand = 'Failed to communicate with ESP32';
        this.lastCommandTime = new Date().toLocaleTimeString();

        if (this.deviceStatus) {
          this.deviceStatus = {
            ...this.deviceStatus,
            online: false
          };
        }
      }
    });
  }

  onColorChange(color: string): void {
    this.selectedColor = color;
  }

  updateFirmware(): void {
    this.updatingFirmware = true;

    this.deviceService.updateFirmware().subscribe({
      next: () => {
        this.lastCommand = 'Firmware update started';
        this.lastCommandTime = new Date().toLocaleTimeString();

        this.updatingFirmware = false;
      },

      error: error => {
        console.error(
          'Failed to start firmware update:',
          error
        );

        this.lastCommand = 'Failed to start firmware update';
        this.lastCommandTime = new Date().toLocaleTimeString();

        this.updatingFirmware = false;
      }
    });
  }
}