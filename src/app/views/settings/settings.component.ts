import { Component, OnInit } from '@angular/core';
import {Setting} from '../../Models/setting';
import { NotificationsService } from 'angular2-notifications';
import {AppConfig} from '../../app.config';
import {PromptService} from '../../services/prompt.service';
import {Router} from '@angular/router';


@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    setting: Setting = AppConfig.default_setting;

    formatter: {
        to(value: number): string;
        from(value: string): number;
    };


    constructor(private notif: NotificationsService, private promptService: PromptService, private router: Router ) { }

    ngOnInit() {
        const storedSetting = localStorage.getItem('setting');
        if (storedSetting) {
            this.setting = JSON.parse(storedSetting);
        } else {
            this.notif.warn('Please, save your setting to use the app.', null, {
                timeOut: 5000
            })
        }

        this.formatter = {
            to(value: number): string {
                if (value === 12) {
                    return '12:00pm'
                }
                return '' + Math.round(value % 12 ) + ':00' + ((value >= 12) ? 'pm' : 'am');
            },
            from(value: string): number {
                const period = value.slice(-2);
                const hour = value.split(':')[0];
                if (period === 'pm') {
                    if (hour === '12') {
                        return +hour;
                    } else {
                        return + hour + 12;
                    }
                } else {
                    return +hour;
                }

            }
        }
    }

    save() {
        if (this.setting.goodTimes[1] - this.setting.goodTimes[0] < 8) {
            this.notif.error('Available times must be more than 8 hours');
            return;
        }
        localStorage.setItem('setting', JSON.stringify(this.setting));
        this.notif.success('Settings updated');
        this.promptService.setPromptNotifications(true, () => {this.router.navigate([''])});
    }
}
