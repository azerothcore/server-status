import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { SERVER_NAME } from 'config';
import { map } from './utils/zone';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public service: AppService) { }

  readonly SERVER_NAME = SERVER_NAME;
  readonly map = map;

  ngOnInit(): void {
    this.service.init();
  }

}
