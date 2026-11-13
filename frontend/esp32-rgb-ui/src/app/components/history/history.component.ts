import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';

import {
  DeviceService,
  SensorReading
} from '../../services/device.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  readings: SensorReading[] = [];

  loading = false;
  error = '';

  showTable = false;

  temperatureChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        tension: 0.3,
        fill: false
      }
    ]
  };

  humidityChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Humidity (%)',
        data: [],
        tension: 0.3,
        fill: false
      }
    ]
  };

  pressureChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Pressure (hPa)',
        data: [],
        tension: 0.3,
        fill: false
      }
    ]
  };

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false
      }
    },

    scales: {
      x: {
        ticks: {
          maxTicksLimit: 8
        }
      }
    }
  };

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.error = '';

    this.deviceService.getHistory().subscribe({
      next: readings => {
        this.readings = readings;

        this.updateCharts();

        this.loading = false;
      },

      error: error => {
        console.error('Failed to load history:', error);

        this.error = 'Failed to load sensor history.';
        this.loading = false;
      }
    });
  }

  updateCharts(): void {
    const chartReadings = [...this.readings].reverse();

    const labels = chartReadings.map(reading =>
      new Date(reading.timestamp).toLocaleTimeString()
    );

    this.temperatureChartData = {
      labels,

      datasets: [
        {
          label: 'Temperature (°C)',
          data: chartReadings.map(reading => reading.temperature),
          tension: 0.3,
          fill: false
        }
      ]
    };

    this.humidityChartData = {
      labels,

      datasets: [
        {
          label: 'Humidity (%)',
          data: chartReadings.map(reading => reading.humidity),
          tension: 0.3,
          fill: false
        }
      ]
    };

    this.pressureChartData = {
      labels,

      datasets: [
        {
          label: 'Pressure (hPa)',
          data: chartReadings.map(reading => reading.pressure),
          tension: 0.3,
          fill: false
        }
      ]
    };
  }

  toggleTable(): void {
    this.showTable = !this.showTable;
  }
}