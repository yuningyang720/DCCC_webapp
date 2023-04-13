import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {AppConfig} from '../../app.config';
import {GroupCategory} from '../../Models/group';
import {RestService} from '../../services/rest.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    private toggleButton: any;
    private sidebarVisible: boolean;
    categories: Array<GroupCategory>;
    appName = AppConfig.name;

    constructor(public location: Location, private element: ElementRef, private router: Router,
                private notif: NotificationsService, private rest: RestService) {
        this.sidebarVisible = false;
    }

    loadCategories() {
        this.rest.getRest().one('group/mygroup').get().subscribe( response => {
                this.categories = response.categories;
                localStorage.setItem('categories', JSON.stringify(response.categories));
            }
        );
    }

    ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        const categoriesStr = localStorage.getItem('categories');
        if (categoriesStr) {
            this.categories = JSON.parse(categoriesStr);
        } else {
            this.loadCategories();
        }
    }
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        setTimeout(function() {
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };

    isDocumentation() {
        const titlee = this.location.prepareExternalUrl(this.location.path());
        if ( titlee === '/documentation' ) {
            return true;
        } else {
            return false;
        }
    }

    getRoute() {
        return this.router.url;
    }

    logout () {
        localStorage.removeItem('authentication_token');
        localStorage.removeItem('group_id');
        localStorage.removeItem('categories');
        localStorage.removeItem('profile');
        this.router.navigate(['/login']);
        this.notif.success(AppConfig.logout_success_msg);
    }
}
