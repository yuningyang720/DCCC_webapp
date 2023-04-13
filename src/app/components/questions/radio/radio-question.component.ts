import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlContainer, NgForm, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-radio-question',
  templateUrl: './radio-question.component.html',
  styleUrls: ['./radio-question.component.scss'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class RadioQuestionComponent implements OnInit {
  @Input() title: string;
  @Input() options: Array<any>;
  @Input() key: string;
  @Input() value: string;
  @Input() required = false;
  @Input() other_bar: any;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() hideLabel: boolean;
  inline: boolean;
  indicator: boolean;
  @Input() alignment: string;
  @Input() parent: FormGroup;
  name: string;

  constructor() { }

  ngOnInit() {
    this.name = 'radio_' + this.key;
    if (this.required && this.required === true) {
      this.title = this.title + ' *';
    }

    if (this.alignment === 'vertical') {
      this.inline = false;
      this.indicator = false;
    } else if (this.alignment === 'horizontal') {
      this.inline = true;
      this.indicator = false;
    } else if (this.alignment === 'matrix') {
      this.inline = true;
      this.indicator = true;
    }
  }

  onChange() {
    this.valueChange.emit(this.value);
  }

}
