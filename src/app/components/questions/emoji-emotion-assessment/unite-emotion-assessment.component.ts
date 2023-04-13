import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-unite-emotion-assessment',
  templateUrl: './unite-emotion-assessment.component.html',
  styleUrls: ['./unite-emotion-assessment.component.scss']
})
export class UniteEmotionAssessmentComponent implements OnInit {
  @Input() title;
  @Input() secondTitle: string;
  @Input() thirdTitle: string;
  @Input() key: string;
  @Input() value: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() required = false;

  firstEmo: string;
  secondEmo: string;
  thirdEmo: string;

  constructor() { }

  ngOnInit() {
  }

  selectFirstEmo(emo: string) {
    this.firstEmo = emo;
    this.secondEmo = null;
    this.value = this.firstEmo;
    this.valueChange.emit(this.value);
  }

  selectSecondEmo(emo: string) {
    this.secondEmo = emo;
    this.thirdEmo = null;
    this.value = this.secondEmo;
    this.valueChange.emit(this.value);
  }

  selectThirdEmo(emo: string) {
    this.thirdEmo = emo;
    this.value = this.thirdEmo;
    this.valueChange.emit(this.value);
  }
}
