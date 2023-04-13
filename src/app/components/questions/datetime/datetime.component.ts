import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { DatePipe } from '@angular/common';
import {ControlContainer, NgForm} from '@angular/forms';


@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.scss'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class DatetimeComponent implements OnInit {
  @Input() key: string;
  @Input() title: string;
  @Input() value: any;
  @Input() range = false;
  @Input() category: string;
  @Input() min: number;
  @Input() max: number;
  @Input() required = false;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  datePipe = new DatePipe('en-US');

  minDatetime: Date;
  maxDatetime: Date;

  datetimeRange: Array<Number>;
  datetime: Number;

  dtRange: Array<Date>;
  dt: Date;

  placeholder: string;
  pickerType: string;
  name: string;

  constructor() { }

  ngOnInit() {
    this.name = 'datetime_' + this.key;
    if (this.required && this.required === true) {
      this.title = this.title + ' *';
    }

    if (this.min) {
      const minString = this.datePipe.transform(this.min, 'medium');
      this.minDatetime = new Date(minString);
    }
    if (this.max) {
      const maxString = this.datePipe.transform(this.max, 'medium')
      this.maxDatetime = new Date(maxString);
    }

    if (this.category === 'datetime') {
      this.placeholder = 'Date Time';
      this.pickerType = 'both';
    } else if (this.category === 'date') {
      this.placeholder = 'Date';
      this.pickerType = 'calendar';
    } else if (this.category === 'time') {
      this.placeholder = 'Time';
      this.pickerType = 'timer';
    }

    if (this.value) {
      this.valueChange.emit(this.value);
    }
  }

  onChange() {
    if (this.range === true) {
      this.datetimeRange = new Array<Number>();
      const d1 = new Date(this.dtRange[0]);
      this.datetimeRange.push(d1.getTime());
      const d2 = new Date(this.dtRange[1]);
      this.datetimeRange.push(d2.getTime());
      this.value = this.datetimeRange;
    } else {
      this.datetime = new Date(this.dt).getTime();
      this.value = this.datetime;
    }
    this.valueChange.emit(this.value);
  }
}
