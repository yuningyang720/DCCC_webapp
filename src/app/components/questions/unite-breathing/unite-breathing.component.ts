import {Component, Input, OnInit} from '@angular/core';
import {timer} from 'rxjs';
import {finalize, first, skip, take} from 'rxjs/operators';

@Component({
  selector: 'app-unite-breathing',
  templateUrl: './unite-breathing.component.html',
  styleUrls: ['./unite-breathing.component.scss']
})
export class UniteBreathingComponent implements OnInit {
  @Input() title: string;
  @Input() soundUrl: string;
  @Input() player: any;
  @Input() breathingStartTime: number;
  @Input() breathingEndTime: number;
  breathing: boolean;
  countdown;

  constructor() { }

  ngOnInit() {
  }

  playAudio() {
    this.player.src = this.soundUrl;
    // this.player.load();
    this.player.play();
  }

  startExercise() {
    if (this.breathing) {
      return;
    }
    this.playAudio();
    const breathing_time = 60;

    const timerObs = timer(this.breathingStartTime * 1000, 1000);
    timerObs.pipe(
        take(this.breathingEndTime - this.breathingStartTime),
        finalize(() => {
          this.breathing = false;
        }))
        .subscribe(time => {
          this.breathing = true;
          this.countdown = breathing_time - time;
        })
  }
}
