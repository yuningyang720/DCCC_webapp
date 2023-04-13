import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { AppConfig } from '../app.config';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import {environment} from '../../environments/environment';
import {NgxSpinnerService} from 'ngx-spinner';


@Injectable()
export class RestService {

    restServer: Restangular;

    constructor(private restangular: Restangular, private notif: NotificationsService, private router: Router,
                private spinnerService: NgxSpinnerService) {
        this.restServer = this.restangular.withConfig((RestangularConfigurer) => {
            RestangularConfigurer.setBaseUrl(environment.host_url);
            RestangularConfigurer.setDefaultHeaders({'Content-Type': 'application/json'});
            RestangularConfigurer.addFullRequestInterceptor((element, operation, path, url, headers, params) => {
                if ('spinner' in headers && headers.spinner) {
                    this.spinnerService.show();
                }
            });
            RestangularConfigurer.addResponseInterceptor((data, operation, what, url, response) => {
                this.spinnerService.hide();
                if (url.endsWith('group/mygroup')) {
                    localStorage.setItem('group_id', data._id['$oid']);
                }
                return data;
            });
            RestangularConfigurer.setErrorInterceptor((response, deferred, responseHandler) => {
                this.spinnerService.hide();
                if (response.status === 401) {
                    this.notif.error(AppConfig.access_deny_error);
                    localStorage.removeItem('authentication_token');
                    this.router.navigate(['login']);
                } else if (response.status === 0) {
                    this.notif.error(AppConfig.connection_error);
                }
                return response;
            });
        });
    }

    getRestNoSpinner(): Restangular {
        return this.getRest(false, true, environment.host_url);
    }

    getRest(spinner: boolean = true, auth: boolean = true, base: string = environment.host_url): Restangular {
        return this.restServer.withConfig((RestangularConfigurer) => {
            const header = {};
            if (auth) {
                header['Authorization'] = localStorage.getItem('authentication_token');
            }
            if (spinner) {
                header['spinner'] = true;
            }
            if (base) {
                RestangularConfigurer.setBaseUrl(base);
            }
            RestangularConfigurer.setDefaultHeaders(
                header);
        });
    }

    getRestNoAuth(): Restangular {
        return this.getRest(true, false, environment.host_url)
    }

    getRestNutritionix() {
        return this.restServer.withConfig((RestangularConfigurer) => {
            const header = {};
            header['x-app-id'] = AppConfig.nutritionix.id;
            header['x-app-key'] = AppConfig.nutritionix.key;
            header['spinner'] = false;
            RestangularConfigurer.setBaseUrl(AppConfig.nutritionix.base_url);
            RestangularConfigurer.setDefaultHeaders(
                header);
            RestangularConfigurer.setErrorInterceptor((response, deferred, responseHandler) => {
                this.spinnerService.hide();
                return response;
            });
        });
    }
}
