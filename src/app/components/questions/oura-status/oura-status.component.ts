import {Component, Input, OnInit} from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {AppConfig} from '../../../app.config';
import {DatetoolsService} from '../../../services/datetools.service';
import {AppComponent} from '../../../app.component';

declare var device;
declare var startApp;

@Component({
  selector: 'app-oura-status',
  templateUrl: './oura-status.component.html',
  styleUrls: ['./oura-status.component.scss']
})
export class OuraStatusComponent implements OnInit {
  @Input() title: string;

  loadingStatus = true;
  ringConnected = false;
  recentUpload = true;
  url;
  recentLaunch;
  openOuraURL = 'oura://launch';

  getOAuthUrl() {
    this.rest.getRest().one('sensing').one('oauth/code_url/oura').get().subscribe(response => {
      const url = response.plain();
      this.url = url.url;
      this.ringConnected = false;
      this.loadingStatus = false;
    })
  }

  loadOuraData() {
    this.rest.getRest().one('sensing').one('oauth/status/oura').get().subscribe(response => {
      this.loadingStatus = false;
      const nowdate = new Date();
      const utcnow = nowdate.getTime() / 1000;
      const timeElapsed = utcnow - response.utctime;
      this.recentUpload = timeElapsed < AppConfig.OURA_RECENT_TRESHOLD;
      if (response.functioning) {
        this.ringConnected = true;
      } else {
        this.ringConnected = false;
        this.getOAuthUrl();
      }
    }, error => {
      if (error.status === 404) {
        this.getOAuthUrl();
      }
    });
  }

  constructor(private rest: RestService, private datetool: DatetoolsService) { }

  ngOnInit() {
    this.loadOuraData();
    const lastLaunch = localStorage.getItem('oura_last_launch')
    this.recentLaunch = false;
    if (lastLaunch) {
      const lastLaunchDate = new Date(parseInt(lastLaunch, 10))
      const now = new Date()
      const firstSyncTime = new Date(lastLaunchDate.getTime())
      if (now.getTime() - lastLaunchDate.getTime() > AppConfig.OURA_SYNC_FREQ * 1000) {
        return;
      }
      firstSyncTime.setHours(AppConfig.OURA_SYNC_START / 60 / 60, AppConfig.OURA_SYNC_START / 60, 0, 0)
      let syncTime = new Date(firstSyncTime.getTime())
      this.recentLaunch = true;
      while (syncTime.getTime() < now.getTime()) {
        if (syncTime.getTime() < now.getTime() && syncTime.getTime() >= lastLaunchDate.getTime()) {
          this.recentLaunch = false;
          return;
        }
        syncTime = new Date(syncTime.getTime() + AppConfig.OURA_SYNC_FREQ * 1000)
      }
    }
  }

  openOuraApp() {
    localStorage.setItem('oura_last_launch', new Date().getTime().toString())
    this.recentLaunch = true;
    if (device.platform) {
      if (device.platform === 'Android') {
        const sApp = startApp.set({
          'application': 'com.ouraring.oura'
        }).start();
      } else if (device.platform === 'iOS') {
        const sApp = startApp.set('oura://').start();
      }
    }
  }
}
