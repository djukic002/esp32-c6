import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-last-command',
  templateUrl: './last-command.component.html',
  styleUrls: ['./last-command.component.css']
})
export class LastCommandComponent {

  @Input() status = '';

  @Input() updated = '';

}