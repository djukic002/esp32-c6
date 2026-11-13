import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DeviceStatus } from '../../services/device.service';

@Component({
  selector: 'app-device-status',
  templateUrl: './device-status.component.html',
  styleUrls: ['./device-status.component.css']
})
export class DeviceStatusComponent {

  @Input() status?: DeviceStatus;
  @Input() lastUpdated = '';

  @Output() refresh = new EventEmitter<void>();

  get uptime(): string {

    const totalSeconds = this.status?.uptime;

    if (totalSeconds === undefined) {
      return 'N/A';
    }

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }

    return `${seconds}s`;
  }
}