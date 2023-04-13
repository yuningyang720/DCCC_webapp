import {Injectable} from '@angular/core';
import {RestService} from './rest.service';
import {Prompt, PromptType} from '../Models/prompt';
import {Setting} from '../Models/setting';
import {AppConfig} from '../app.config';

declare var cordova;

interface NotificationData {
    promptId: string,
    questionnaireId: string,
    promptType: PromptType
}

@Injectable({
    providedIn: 'root'
})
export class PromptService {

    notifs: any;
    setting: Setting = AppConfig.default_setting;
    prompts: Prompt[];

    constructor(private rest: RestService) {
        this.loadSetting();
    }

    private loadSetting() {
        const storedSetting = localStorage.getItem('setting');
        if (storedSetting) {
            this.setting = JSON.parse(storedSetting);
        }
    }

    private createNotifObject(prompt: Prompt, notifId: number, notifData?: any) {
        if ( prompt.prompt_type === PromptType.repeat ) {

            let title = AppConfig.reflection_notification_title;
            if (prompt.category === 'Reflection') {
                title = AppConfig.reflection_notification_title
            } else if (prompt.category === 'Notifications') {
                title = AppConfig.survey_notification_title
            }

            return {
                id: notifId,
                title: title,
                trigger: {
                    every: {hour: this.setting.preferredTime, minute: 1},
                    count: 1
                },
                data: {
                    promptId: prompt._id.$oid,
                    questionnaireId: prompt.questionnaire.$oid,
                    promptType: prompt.prompt_type
                }
            }
        } else if (prompt.prompt_type === PromptType.random) {
            const randTime = Math.random() * (this.setting.goodTimes[1] - this.setting.goodTimes[0]) + this.setting.goodTimes[0];
            let randTimeHour = Math.floor(randTime);
            let randTimeMinute = Math.floor((randTime % 1) * 60);

            if (notifData) {
                randTimeHour = notifData.hour;
                randTimeMinute = notifData.minute;
                return {
                    id: notifId,
                    title: AppConfig.survey_notification_title,
                    trigger: {
                        every: {hour: randTimeHour, minute: randTimeMinute},
                        count: 1
                    },
                    timeOutAfter: 30 * 60 * 1000,
                    data: notifData
                }
            } else {
                return {
                    id: notifId,
                    title: AppConfig.survey_notification_title,
                    trigger: {
                        every: {hour: randTimeHour, minute: randTimeMinute},
                        count: 1
                    },
                    timeOutAfter: 30 * 60 * 1000 ,
                    data: {
                        promptId: prompt._id.$oid,
                        questionnaireId: prompt.questionnaire.$oid,
                        promptType: prompt.prompt_type,
                        hour: randTimeHour,
                        minute: randTimeMinute
                    }
                }
            }
        }

    }

    setPromptNotifications(reset?: boolean, callback?: () => void) {
        this.loadSetting();
        document.addEventListener('deviceready', () => {
            this.rest.getRest().one('prompt', 'myprompts').get().subscribe(
                response => {
                    this.prompts = response.plain();
                    for (const prompt of this.prompts) {
                        cordova.plugins.notification.local.getScheduled(notifications => {
                            let found = 0;
                            for (const notification of notifications) {
                                const notifData = JSON.parse(notification.data);
                                if (notifData.promptId === prompt._id.$oid) {
                                    let notifObj = {};
                                    if (reset) {
                                        notifObj = this.createNotifObject(prompt, notification.id);
                                    } else {
                                        notifObj = this.createNotifObject(prompt, notification.id, notifData);
                                    }
                                    cordova.plugins.notification.local.update(notifObj);
                                    found += 1;
                                }
                            }
                            if ( prompt.prompt_type ===  PromptType.repeat && found <= 0 ) {
                                const notifObj = this.createNotifObject(prompt,
                                    Math.floor(Math.random() * 99999));
                                cordova.plugins.notification.local.schedule(notifObj);
                            } else if (prompt.prompt_type ===  PromptType.random && found < prompt.times) {
                                for (let i = found; i <= prompt.times; i += 1) {
                                    const notifObj = this.createNotifObject(prompt,
                                        Math.floor(Math.random() * 99999));
                                    cordova.plugins.notification.local.schedule(notifObj);
                                }
                            }
                        });
                    }
                    cordova.plugins.notification.local.getScheduled(notifications => {
                        const notifAvailTimes = [];
                        for (const notification of notifications) {
                            let found = false;
                            console.log(notification.data);
                            for (const prompt of this.prompts) {
                                const notifData = JSON.parse(notification.data);
                                if (notifData.promptId === prompt._id.$oid) {
                                    if (prompt.prompt_type === PromptType.random) {
                                        notifAvailTimes.push([notifData['hour'], notifData['minute']]);
                                    }
                                    found = true;
                                }
                            }
                            if (!found) {
                                cordova.plugins.notification.local.cancel(notification.id, () => {
                                })
                            }
                        }
                        localStorage.setItem('promptOpen', JSON.stringify(notifAvailTimes))
                        if (callback) {
                            callback()
                        }
                    });
                }, error => {

                }
            );
            cordova.plugins.notification.local.on('click', notification => {

                let notifData: NotificationData;
                if (notification.data instanceof Object) {
                    notifData = notification.data;
                } else {
                    try {
                        notifData = JSON.parse(notification.data);
                    } catch (e) {
                        return;
                    }
                }
                // this.ngZone.run(() => {
                //     this.router.navigate(['survey', {questionnaire: notifData.questionnaireId,
                //         prompt: notifData.promptId}]);
                // });

                window.location.assign('#/survey;questionnaire=' + notifData.questionnaireId + ';prompt=' +
                    notifData.promptId);
            });
        }, false);
    }
}
