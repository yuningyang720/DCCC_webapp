import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-big-text-question',
  templateUrl: './big-text-question.component.html',
  styleUrls: ['./big-text-question.component.scss']
})
export class BigTextQuestionComponent implements OnInit {
  @Input() title: string;
  @Input() value: number;
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() required: boolean;
  @Input() soundUrl: string;
  @Input() player;

  constructor() { }

  ngOnInit() {
  }

  onChange() {
    this.valueChange.emit(this.value);
  }

  playAudio() {
    this.player.src = this.soundUrl;
    this.player.play();
  }

}
