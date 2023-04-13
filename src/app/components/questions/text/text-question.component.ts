import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProfileKeysService} from '../../../services/profile-keys.service';
import {ControlContainer, NgForm} from '@angular/forms';

@Component({
  selector: 'app-text-question',
  templateUrl: './text-question.component.html',
  styleUrls: ['./text-question.component.scss'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class TextQuestionComponent implements OnInit {
  @Input() title: string;
  @Input() value: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() required = false;
  @Input() key: string;
  @Input() autoComplete: string;
  @Input() edit = true;
  name: string;

  constructor(private profileKey: ProfileKeysService) { }

  ngOnInit() {
    this.name = 'text_' + this.key;
    if (this.required && this.required === true) {
      this.title = this.title + ' *'
    }
  }

  onChange() {
    this.valueChange.emit(this.value);
  }

}
