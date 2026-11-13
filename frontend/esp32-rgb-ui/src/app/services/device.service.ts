import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface SensorData {
  temperature: number;
  humidity: number;
  pressure: number;
}

export interface DeviceStatus {
  device: string;
  online: boolean;
  ip: string;
  uptime?: number;
  wifiSignal?: number;
  firmwareVersion?: string;
  color?: RGBColor;
  sensor?: SensorData;
}

export interface SensorReading {
  id: number;
  timestamp: string;
  temperature: number;
  humidity: number;
  pressure: number;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  setColor(color: RGBColor): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/color`,
      color
    );
  }

  getStatus(): Observable<DeviceStatus> {
    return this.http.get<DeviceStatus>(
      `${this.apiUrl}/status`
    );
  }

  getHistory(): Observable<SensorReading[]> {
    return this.http.get<SensorReading[]>(
      `${this.apiUrl}/history`
    );
  }

  updateFirmware() {
  return this.http.post(
    `${this.apiUrl}/update`,
    {}
  );
}
}