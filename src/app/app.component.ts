import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { SERVER_NAME, PULSE_DAYS } from 'config';
import { map } from './utils/zone';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public service: AppService) { }

  readonly SERVER_NAME = SERVER_NAME;
  readonly PULSE = PULSE_DAYS;
  readonly map = map;

}
