import {Component, Input, OnInit} from '@angular/core';
@Component({
  selector: 'app-indicator-question',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit {
  @Input() indicator?: Array<string>;
  constructor() { }

  ngOnInit() {
  }

}
