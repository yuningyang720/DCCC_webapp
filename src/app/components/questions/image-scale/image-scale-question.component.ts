import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-image-scale-question',
  templateUrl: './image-scale-question.component.html',
  styleUrls: ['./image-scale-question.component.scss']
})
export class ImageScaleQuestionComponent implements OnInit {
  @Input() title: string;
  @Input() indicator?: Array<string>;
  @Input() value: number;
  @Input() min?: number;
  @Input() max?: number;
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() required: boolean;

  constructor() { }

  ngOnInit() {
    if (!this.max) {
      this.max = 100;
    }
    if (!this.min) {
      this.min = 0;
    }
    if (this.value === undefined || this.value === null) {
      this.value = Math.floor( (this.min + this.max) / 2);
    }
  }

  onChange() {
    this.valueChange.emit(this.value);
  }

}
