import {Component, Input, NgZone, OnInit} from '@angular/core';
import {timer} from 'rxjs';
import {finalize, take} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {RestService} from '../../../services/rest.service';
import {ProfileKeysService} from '../../../services/profile-keys.service';
import {NotificationsService} from 'angular2-notifications';
import {DatetoolsService} from '../../../services/datetools.service';

@Component({
  selector: 'app-breathing-exercise-question',
  templateUrl: './breathing-exercise-question.component.html',
  styleUrls: ['./breathing-exercise-question.component.scss']
})
export class BreathingExerciseQuestionComponent implements OnInit {
  @Input() title: string;
  questionsSeries: any = [{}];
  seriesIndex = 0;
  answers: any = {};
  prompt: string;
  stream: any;
  breathing: any = false;
  randomBase: number;
  value = 0;

  constructor(private route: ActivatedRoute, private rest: RestService, private router: Router,
              private profileKey: ProfileKeysService, private notif: NotificationsService, private ngZone: NgZone,
              private datetools: DatetoolsService) { }

  ngOnInit() {
    const qid = this.route.snapshot.params['questionnaire'];
    this.prompt = this.route.snapshot.params['prompt'];
    this.randomBase = Math.random();
    this.rest.getRest().one('questionnaire', qid).get().subscribe(
        response => {
          this.questionsSeries = response.data;
        }, response => {
          this.notif.error('Fail to load questionnaire.', 'Check you Internet connectivity');
        }
    );
    this.answers['start_time'] = this.datetools.getTimestamp();
  }

  startExercise() {
    let breathing_time = 60;
    for (let i = 0; i < this.questionsSeries[this.seriesIndex].questions.length; i++) {
      if (this.questionsSeries[this.seriesIndex].questions[i].type === 'breathing_exercise' &&
          this.questionsSeries[this.seriesIndex].questions[i].time ) {
        breathing_time = this.questionsSeries[this.seriesIndex].questions[i].time;
      }
    }

    this.breathing = true;
    const timerObs = timer(0, 1000);
    timerObs.pipe(
        take(breathing_time),
        finalize(() => {
          this.breathing = false;
          for (let i = 0; i < this.questionsSeries[this.seriesIndex].questions.length; i++) {
            if (this.questionsSeries[this.seriesIndex].questions[i].key) {
              if (this.questionsSeries[this.seriesIndex].questions[i].type === 'breathing_exercise') {
                this.answers[this.questionsSeries[this.seriesIndex].questions[i].key] = true;
              }
            }
          }
        }))
        .subscribe(time => {
          this.value = breathing_time - time;
        })
  }

}
