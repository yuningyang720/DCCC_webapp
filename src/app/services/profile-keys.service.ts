import { Injectable } from '@angular/core';
import {RestService} from './rest.service';
import {ProfileKey} from '../Models/profile_key';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProfileKeysService {
    profile: any = {};
    profileKeys: ProfileKey[];

    constructor(private rest: RestService) {
        if (localStorage['profile']) {
            this.profile = JSON.parse(localStorage['profile']);
        }
        this.rest.getRest().one('group', 'mygroup').get().subscribe(
            response => {
                const keys = response['profile_keys'];
                this.profileKeys = keys;
                if (localStorage['profile']) {
                    this.profile = JSON.parse(localStorage['profile']);
                } else {
                    this.profile = {};
                }
                for (const key of keys) {
                    if (!this.profile[key.name]) {
                        this.profile[key.name] = null;
                    }
                }
                this.rest.getRest().one('group', response._id.$oid).one('user_profile').get().subscribe(
                    res => {
                        this.profile = {...this.profile, ...res.plain()};
                    }, error => {
                    }
                )
            }, response => {

            }
        )
    }

    get(key: string, def?: any) {
        return this.profile[key] ? this.profile[key] : def;
    }

    replaceText(text: string) {
        if (!text) {
            return text;
        }
        text = text.replace(/\{\[\]\}/g, phrase => {
            const key = phrase.match(/\{\[(.*?)\|/)[0].replace(/[^a-zA-Z0-9_]/g, '');
            const alt = phrase.match(/\|(.*?)\]\}/)[0].replace(/(\]\}\|)/g, '');
            if (this.profile[key]) {
                return this.profile[key];
            } else {
                return alt;
            }
        });
        return text;
    }
}
