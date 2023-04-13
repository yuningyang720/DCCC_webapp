import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CountdownComponent, CountdownConfig, CountdownEvent} from 'ngx-countdown';
import {ProfileKeysService} from '../../../services/profile-keys.service';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss']
})
export class ExerciseComponent implements OnInit {
  @ViewChild('cd', {static:false}) private counter: CountdownComponent;

  counterConfig: CountdownConfig = {
    demand: true,
    notify: [4, 3, 2, 1],
    format: 'mm:ss'
  };

  @Input() title: string;
  @Input() src: string;
  @Input() repeat: any;
  @Input() timer: any;
  @Input() player: any;
  @Input() set: any;

  countdown: number;
  counting = false;

  constructor(private profile: ProfileKeysService) { }

  ngOnInit() {
    if (this.timer) {
      this.counterConfig.leftTime = this.timer;
    }

    if (typeof(this.repeat) === typeof({}) && 'profile_key' in this.repeat) {
      this.repeat = this.profile.get(this.repeat.profile_key, this.repeat.default);
    }

    if (typeof(this.timer) === typeof({}) && 'profile_key' in this.timer) {
      this.timer = this.profile.get(this.timer.profile_key, this.timer.default);
      this.counterConfig.leftTime = this.timer;
    }

    if (typeof(this.set) === typeof({}) && 'profile_key' in this.set) {
      this.set = this.profile.get(this.set.profile_key, this.set.default);
    }

    if (!this.set) {
      this.set = 1;
    }
  }

  startCountDown() {
    this.counting = true;
    this.counter.begin();
  }

  counterEvent($event: CountdownEvent) {
    if ($event.action === 'start') {
      this.player.src = 'assets/audio/beep1.mp3';
      this.player.play();
    } else if ($event.action === 'notify') {
      this.player.src = 'assets/audio/beep1.mp3';
      this.player.play();
    } else if ($event.action === 'done') {
      this.player.src = 'assets/audio/beep2.mp3';
      this.player.play();
    }
  }

  restartCountDown() {
    this.counter.restart();
    this.counting = false;
  }
}
