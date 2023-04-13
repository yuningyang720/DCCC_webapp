import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest.service';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {AppConfig} from '../../app.config';

interface User {
    email: string,
    password: string
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [RestService]
})
export class LoginComponent implements OnInit {
    appName = AppConfig.name;
    data: Date = new Date();
    focus;
    focus1;
    user: User = {
        email: '',
        password: ''
    };


    constructor(private rest: RestService, private router: Router, private notif: NotificationsService) {
    }

    ngOnInit() {
        if (localStorage.getItem('authentication_token')) {
                this.router.navigate(['']);
        }
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');

        const navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');
        navbar.classList.add('d-none');
    }

    ngOnDestroy() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');

        const navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.remove('navbar-transparent');
        navbar.classList.remove('d-none');
    }

    loginAction() {
        if (this.user.email && this.user.password) {
            this.rest.getRestNoAuth().one('auth/login').customPOST(this.user).subscribe(response => {
                localStorage.setItem('authentication_token', response.authentication_token);
                const userID = response.id;
                if (window['plugins']) {
                    window['plugins'].OneSignal.setExternalUserId(userID);
                }
                this.rest.getRest().one('group/mygroups').get().subscribe( result => {
                    if (window['plugins']) {
                        window['plugins'].OneSignal.sendTag('group', result._id['$oid']);
                        localStorage.setItem('group_id', result._id['$oid']);
                    }
                    this.router.navigate([''])
                });
            }, response => {
                if (response.status === 400) {
                    this.notif.error('Username or password is incorrect');
                } else {
                    this.notif.error(AppConfig.default_error);
                }
            })
        }
    }
}
