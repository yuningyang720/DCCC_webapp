import { Component, OnDestroy, OnInit } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { NotificationsService } from 'angular2-notifications';
import { DatetoolsService } from '../../services/datetools.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
    data: Date = new Date();
    focus;
    profile: any = {};
    profileKeys: any;

    constructor(private rest: RestService, private notif: NotificationsService, private datetools: DatetoolsService) { }

    ngOnInit() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('profile-page');
        const navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');

        this.rest.getRest().one('group', 'mygroup').get().subscribe(
            response => {
                this.profileKeys = response.profile_keys;

                if (localStorage['profile']) {
                    this.profile = JSON.parse(localStorage['profile']);
                } else {
                    this.profile = {};
                }
                this.rest.getRest().one('group', response._id.$oid).one('user_profile').get().subscribe(
                    res => {
                        this.profile = {...this.profile, ...res.plain()}
                        console.log(this.profile)
                    }, error => {
                        this.notif.error('unable to load online profile');
                    }
                )

            }, response => {
                this.notif.error('unable to load profile keys');

            }
        )
    }

    ngOnDestroy() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('profile-page');
        const navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.remove('navbar-transparent');
    }


    save() {
        const uploadProfile = {};
        const localProfile = {};
        for (const page of this.profileKeys) {
            for (const field of page.fields) {
                if (field.upload === 'local' || field.upload === 'both') {
                    localProfile[field.key] = this.profile[field.key]
                }
                if (field.upload === 'server' || field.upload === 'both') {
                    uploadProfile[field.key] = this.profile[field.key]
                }
            }
        }

        const localProfileStr = JSON.stringify(localProfile);
        localStorage.setItem('profile', localProfileStr);

        this.rest.getRest().one('group', localStorage.getItem('group_id'))
            .post('user_profile', uploadProfile).subscribe(
                response => {
                    this.notif.success('Profile saved successfully!');
                }
        );

    }

    saveLastChange(keyName, item, upload) {
        // if (upload === 'local' || upload === 'both') {
        //     this.profile[keyName] = item;
        // }
    }
}
