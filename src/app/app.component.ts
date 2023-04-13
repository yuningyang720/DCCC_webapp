
import {filter} from 'rxjs/operators';
import { Component, OnInit, Inject, Renderer, ElementRef, ViewChild, NgZone } from '@angular/core';
import {Router, NavigationEnd, RouterOutlet} from '@angular/router';
import { Subscription } from 'rxjs';

import {DOCUMENT, Location} from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';
import {PromptService} from './services/prompt.service';
import {RestService} from './services/rest.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotificationsService} from 'angular2-notifications';
import {NgSelectConfig} from '@ng-select/ng-select';

declare var device;
declare var cordova;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    private _router: Subscription;
    @ViewChild(NavbarComponent, {static: true}) navbar: NavbarComponent;
    @ViewChild(RouterOutlet, {static: true}) routerOutlet;

    constructor( private renderer: Renderer, private router: Router, private promptService: PromptService,
                 @Inject(DOCUMENT, ) private document: any, private element: ElementRef, public location: Location,
                 private ngZone: NgZone, private rest: RestService, private modalService: NgbModal,
                 private notif: NotificationsService) {}
    ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement.children[0].children[0];
        this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
            if (window.outerWidth > 991) {
                window.document.children[0].scrollTop = 0;
            } else {
                window.document.activeElement.scrollTop = 0;
            }
            this.navbar.sidebarClose();

            this.renderer.listenGlobal('window', 'scroll', () => {
                const number = window.scrollY;
                let _location = this.location.path();
                _location = _location.split('/')[2];

                // if (number > 150 || window.pageYOffset > 150) {
                //     navbar.classList.remove('navbar-transparent');
                // } else if (_location !== 'login' && this.location.path() !== '/nucleoicons' &&
                //     this.location.path() !== '/survey' ) {
                //     // remove logic
                //     navbar.classList.add('navbar-transparent');
                // }
            });
        });

        if ( ! localStorage.getItem('authentication_token')) {
            this.router.navigate(['login']);
        }

        let exitPressed = false;
        const exitTimeout = 3000;
        document.addEventListener('backbutton', () => {
            if (exitPressed) {
                (navigator as any).app.exitApp();
            } else {
                exitPressed = true;
                const toast = this.notif.info('press back again to exit program or tap on this message', '', {
                    timeOut: exitTimeout
                });
                setTimeout(() => {
                    exitPressed = false;
                }, exitTimeout);
                toast.click.subscribe((event) => {
                    (navigator as any).app.exitApp();
                })
            }
        }, false);

        document.addEventListener('deviceready', () => {
            cordova.plugins.notification.local.setDefaults({
                vibrate: true
            });

            const that = this;

            const notificationOpenedCallback = function(jsonData) {
                console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
                if (jsonData.notification && jsonData.notification.payload && jsonData.notification.payload.additionalData.promptId &&
                    jsonData.notification.payload.additionalData.questionnaireId) {

                    if (that.router) {
                        that.ngZone.run(() => {
                            that.router.navigate(['/survey', {
                                prompt: jsonData.notification.payload.additionalData.promptId,
                                questionnaire: jsonData.notification.payload.additionalData.questionnaireId}]);
                        })
                    }
                }
            };

            window['plugins'].OneSignal
                .startInit('907e1d62-d9e0-40a9-9eaa-eb27b594cc67')
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();

            if ( localStorage.getItem('authentication_token') ) {
                this.rest.getRest().one('group/mygroups').get().subscribe(response => {
                    if (window['plugins']) {
                        window['plugins'].OneSignal.sendTag('group', response._id['$oid']);
                    }
                });
            }

        }, false);
    }

    onactivate($event: any) {
        const i = 0;
        console.log(this.routerOutlet.activatedRoute)
    }
}
