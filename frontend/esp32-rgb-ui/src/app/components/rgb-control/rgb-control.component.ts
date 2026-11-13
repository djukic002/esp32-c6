import { Component, EventEmitter, Input, Output } from '@angular/core';

import { RGBColor } from '../../services/device.service';

@Component({
  selector: 'app-rgb-control',
  templateUrl: './rgb-control.component.html',
  styleUrls: ['./rgb-control.component.css']
})
export class RgbControlComponent {

  @Input() selectedColor = '#7832FF';

  @Input() deviceColor?: RGBColor;

  @Output() colorChange = new EventEmitter<string>();

  @Output() apply = new EventEmitter<RGBColor>();

  onColorChange(): void {
    this.colorChange.emit(this.selectedColor);
  }

  applyColor(): void {
    const rgb = this.hexToRgb(this.selectedColor);

    if (!rgb) {
      return;
    }

    this.apply.emit(rgb);
  }

  getSelectedRgbValue(): string {
    const rgb = this.hexToRgb(this.selectedColor);

    if (!rgb) {
      return 'Invalid';
    }

    return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  }

  getDeviceColorHex(): string {

    if (!this.deviceColor) {
      return '#000000';
    }

    return this.rgbToHex(
      this.deviceColor.r,
      this.deviceColor.g,
      this.deviceColor.b
    );
  }

  getDeviceRgbValue(): string {

    if (!this.deviceColor) {
      return 'N/A';
    }

    return `${this.deviceColor.r}, ` +
           `${this.deviceColor.g}, ` +
           `${this.deviceColor.b}`;
  }

  private hexToRgb(hex: string): RGBColor | null {

    const value = hex.replace('#', '');

    if (value.length !== 6) {
      return null;
    }

    return {
      r: parseInt(value.substring(0, 2), 16),
      g: parseInt(value.substring(2, 4), 16),
      b: parseInt(value.substring(4, 6), 16)
    };
  }

  private rgbToHex(
    r: number,
    g: number,
    b: number
  ): string {

    return '#' +
      [r, g, b]
        .map(value =>
          value.toString(16).padStart(2, '0')
        )
        .join('')
        .toUpperCase();
  }
}