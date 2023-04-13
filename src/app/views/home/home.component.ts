import {Component, OnInit} from '@angular/core';
import {NotificationsService} from 'angular2-notifications';
import {RestService} from '../../services/rest.service';
import {Prompt, PromptType} from '../../Models/prompt';
import {PromptService} from '../../services/prompt.service';
import {Submission} from '../../Models/submission';
import {ProfileKeysService} from '../../services/profile-keys.service';
import {GroupCategory} from '../../Models/group';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    viewDate = new Date();
    // events: CalendarEvent[] = [];
    helloMessage = 'Hello [name]{}!';
    categories: Array<GroupCategory>;

    prompts: Array<Prompt> = [];

    constructor(private notif: NotificationsService, private rest: RestService, private promptService: PromptService,
                private profileKey: ProfileKeysService) { }

    loadCategories() {
        this.rest.getRestNoSpinner().one('group/mygroup').get().subscribe( response => {
                this.categories = response.categories;
                localStorage.setItem('categories', JSON.stringify(response.categories));
            }
        );
    }
    ngOnInit() {
        this.helloMessage = this.profileKey.replaceText(this.helloMessage);
        this.categories = JSON.parse(localStorage.getItem('categories'));

        this.loadCategories();

        this.rest.getRest().one('prompt/myprompts').get().subscribe(response => {
            this.prompts = response.plain();
            // this.rest.getRestNoSpinner().one('prompt/mysubmissions').get().subscribe(result => {
            //     for (const submission of result.plain()) {
            //         const prompt: Prompt  = this.getPrompt(submission);
            //
            //         // let color = '#ffffff';
            //         // const title = prompt.name;
            //         // if (prompt.category === PromptCategory.training) {
            //         //     color = '#f28a0c'
            //         // } else {
            //         //     color = '#39ed10';
            //         // }
            //         // const start = new Date(submission.time.$date)
            //         //
            //         // this.events.push({
            //         //     start: startOfDay(start),
            //         //     // allDay: true,
            //         //     color: {
            //         //         primary: color,
            //         //         secondary: color
            //         //     },
            //         //     title: title
            //         // })
            //
            //     }
            //     this.events = [...this.events];
            // })

        });
        // this.promptService.setPromptNotifications();
    }

    getPrompt (submission: Submission): Prompt {
        for (const prompt of this.prompts) {
            if (submission.prompt.$oid === prompt._id.$oid) {
                return prompt
            }
        }
        return null;
    }

    getReflectionAvailableCount() {
        let ret = 0;
        this.prompts.forEach(prompt => {
            if (prompt.category === 'Reflection' && prompt.is_available) {
                ret += 1;
            }
        });

        return ret;
    }

    getPromptsAvailable(category: string) {
        let ret = 0;
        this.prompts.forEach(prompt => {
            if (prompt.category === category && prompt.is_available) {
                ret += 1;
            }
        });

        return ret;
    }

    getNotificationAvailableCount() {
        let ret = 0;
        this.prompts.forEach(prompt => {
            if (prompt.category === 'Notifications' && prompt.is_available) {
                ret += 1;
            } else if (prompt.category === 'Notifications' && prompt.prompt_type === PromptType.random) {
                const promptOpenStr = localStorage.getItem('promptOpen');
                if (promptOpenStr) {
                    const promptOpen = JSON.parse(promptOpenStr);
                    const dateNow = new Date();
                    const timeNowInMinute = dateNow.getHours() * 60 + dateNow.getMinutes();
                    for (const openTime of promptOpen) {
                        const timeInMinute: number = Math.floor( (Math.floor(openTime[0]) * 60) + openTime[1]);
                        if ((timeNowInMinute - timeInMinute < 30) && (timeNowInMinute - timeInMinute >= 0)) {
                            ret += 1;
                        }
                    }
                }
            }
        });

        return ret;
    }

    test() {
        this.promptService.setPromptNotifications();
    }

}
