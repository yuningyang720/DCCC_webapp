import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProfileKeysService} from '../../../services/profile-keys.service';
import {ControlContainer, NgForm} from '@angular/forms';


@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class NumberComponent implements OnInit {

  @Input() title: string;
  @Input() value: number;
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();
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
