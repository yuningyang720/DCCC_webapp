import {Component, OnInit} from '@angular/core';
import {RestService} from '../../services/rest.service';
import {Prompt, PromptType, Repeat, WeekDay} from '../../Models/prompt';
import {ActivatedRoute, Router} from '@angular/router';
import {DatetoolsService} from '../../services/datetools.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Submission} from '../../Models/submission';
import {ProfileKeysService} from '../../services/profile-keys.service';

@Component({
    selector: 'app-surveys',
    templateUrl: './surveys.component.html',
    styleUrls: ['./surveys.component.scss']
})
export class SurveysComponent implements OnInit {

    prompts: Array<Prompt> = [];
    isLoaded = false;
    category: string;
    submissions: Array<Submission> = [];

    constructor(private rest: RestService, private route: Router, private activatedRoute: ActivatedRoute,
                private datetool: DatetoolsService, private modalService: NgbModal, private profile: ProfileKeysService) {
    }

    ngOnInit() {
        this.category = this.activatedRoute.snapshot.params['category'];
        this.activatedRoute.params.subscribe(params => {
            this.category = params['category'];
            this.prompts = [];
            this.isLoaded = false;
            this.loadPrompts(); // reset and set based on new parameter this time
        });
    }

    private loadPrompts() {
        this.rest.getRest().one('prompt/myprompts').get().subscribe(response => {
            this.prompts = [];
            for (let i = 0; i < response.plain().length; i++) {
                if (response.plain()[i].category === this.category) {
                    this.prompts.push(response.plain()[i]);
                }
            }
            this.isLoaded = true;
        }, response => {

        });
    }

    getBadge(prompt: Prompt) {
        if (prompt.prompt_type === PromptType.repeat) {
            return prompt.repeat;
        } else {
            return 'random'
        }
    }

    isAvailable(prompt: Prompt) {
        return prompt.is_available;
    }

    getWaitDescription(prompt: Prompt) {
        const MINUTE = 60;
        const HOUR: number = MINUTE * 60;

        if (prompt.repeat === Repeat.weekly) {
            if (prompt.daysOfWeek.length > 0) {
                const availDay = this.datetool.getClosestDayOfWeek(prompt.daysOfWeek);
                if (prompt.startTimeInMinutes) {
                    return 'Your survey will be available on ' + WeekDay[availDay] + ' at ' +
                        Math.floor(prompt.startTimeInMinutes / 60) + ':' + prompt.startTimeInMinutes % 60;
                } else {
                    return 'Your survey will be available on ' + WeekDay[availDay];
                }
            }
        }
        return 'Your survey is not available right now. Please wait for ' +
            this.datetool.formatDuration(prompt.wait_time) + '.';
    }

    takeSurvey(prompt: Prompt) {
        // if(prompt.is_available){
            const promptId = prompt._id.$oid;
            this.route.navigate(['survey', {questionnaire: prompt.questionnaire['$oid'], prompt: promptId}]);
        // }
    }
}
