import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest.service';
import {DatetoolsService} from '../../services/datetools.service';
import {AppConfig} from '../../app.config';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.scss']
})
export class SensorsComponent implements OnInit {

  constructor(private rest: RestService, private datetool: DatetoolsService) { }

  ngOnInit() {
  }

  connectOura() {
  }
}
