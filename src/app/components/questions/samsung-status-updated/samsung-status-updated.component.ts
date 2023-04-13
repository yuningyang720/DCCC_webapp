import {Component, Input, OnInit} from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {DatetoolsService} from '../../../services/datetools.service';
import {AppConfig} from '../../../app.config';


declare var device;
declare var startApp;
@Component({
  selector: 'app-samsung-status-updated',
  templateUrl: './samsung-status-updated.component.html',
  styleUrls: ['./samsung-status-updated.component.scss']
})



export class SamsungStatusUpdatedComponent implements OnInit {

  @Input() title: string;

  loadingSamsung = true;
  neverConnected = false;
  recentUpload = false;
  lateUpload = false;
  timeElapsedFormatted;
  stepArr = new Array();

  stepIndex = 0;

  constructor(private rest: RestService, private datetool: DatetoolsService) { }

  loadSamsungLastUpload() {
    this.rest.getRest().one('sensing').one('samsung_raw/last_upload').get().subscribe(
        response  => {
          this.loadingSamsung = false;
          if (response.utctime < 0 ) {
            this.neverConnected = true;
          } else {
            const nowdate = new Date();
            const utcnow = (nowdate.getTime() + nowdate.getTimezoneOffset() * 60 * 1000) / 1000;
            const timeElapsed = utcnow - response.utctime;
            this.recentUpload = timeElapsed > AppConfig.RECENT_TRESHOLD && timeElapsed < AppConfig.LATE_TRESHOLD;
            this.lateUpload = timeElapsed > AppConfig.LATE_TRESHOLD;
            this.timeElapsedFormatted = this.datetool.formatDuration(timeElapsed);
          }
        }, error => {
          this.loadingSamsung = false;
        }
    );
  }

  ngOnInit() {
    this.loadSamsungLastUpload();
  }
  next(type: number): any { // if wifi is already on, there is 2 step
      // i think this method will be good if add 1
      this.stepIndex = type;
      if (this.stepIndex < this.stepArr.length - 1) {
          this.stepIndex++;
      }

  }
  back(type: number): any {
      this.stepIndex = type;
      if (this.stepIndex !== 0) {
          this.stepIndex--;
      } else {
          this.stepArr.splice(0, this.stepArr.length);
      }

  }
  wifiStatus(type: string): void {
      if (type === 'turnOn') {
          this.stepArr = new Array();
          this.stepArr.push([1, 'Open the app by swiping right from your home screen and tapping on the wifi icon. ' +
          'Then tap on "next" if you have a send button. If not, exit and then tap on "No SEND Button"', 'step1']);
          this.stepArr.push([2, 'Tap the send button and wait for the upload to be done. You should get a "Done" ' +
          'message afterwards.', 'step2']);
      } else if (type === 'noSend') {
          if ( this.stepArr.length === 2) {
              this.stepArr.splice(1, 0, [1, 'You need to set up your wifi connection. ' +
              'Drag from the top of your home screen to find the settings icon and tap on it.', 'Off_step1']);
              this.stepArr.splice(2, 0, [2, 'In settings, tap on "Connections" and then, ' +
              'tap on "Wi-Fi".', 'Off_step2']);
              this.stepArr.splice(3, 0, [3, 'In "Wi-Fi", tap on "Wi-Fi" and then, ' +
              'tap on "Always on".', 'Off_step3']);
              this.stepArr.splice(4, 0, [4, 'Go back to "Wi-fi", tap on "Wi-Fi networks" and' +
              ' tap on the network you want to connect to.', 'Off_step4']);
              this.stepArr.splice(5, 0, [1, 'Go back to home (use the bottom button), ' +
              'swipe, and tap on "wi-fi app". To check the "Send" button again.', 'step1']);
          } else {}
      } else {}
  }
  eightHourSteps(): void {
    if (this.lateUpload) {
      this.stepArr = new Array();
      this.stepArr.push([0, 'Open galaxy Wearable app on your phone.', 'eighthourstep1.png']);
      this.stepArr.push([1, 'Ensure that the watch is connected by making sure it says "Connected to Bluetooth." on the top of the screen', 'eighthourstep2.png']);
      this.stepArr.push([2, 'Now check the Wifi on your watch.', 'eighthourstep3.png']);
      this.stepArr.push([3, 'Open the app by swiping Left from your home screen.', 'eighthourstep4.png']);
      this.stepArr.push([4, 'Go to the main screen of your watch. Click on the gear button.', 'eighthourstep5.png']);
      this.stepArr.push([5, 'Scroll down until you see the Connections tab. Click on this tab.', 'eighthourstep6.gif']);
      this.stepArr.push([6, 'Scroll down and ensure Wifi connection is set to Auto.', 'eighthourstep7.gif']);
    } else {
      this.stepArr = new Array();
      this.stepArr.push([1, 'Ensure that the watch is connected by making sure it says "Connected to Bluetooth." on the top of the screen', 'eighthourstep2.png']);
      this.stepArr.push([2, 'Now check the Wifi on your watch.', 'eighthourstep3.png']);
      this.stepArr.push([3, 'Open the app by swiping Left from your home screen.', 'eighthourstep4.png']);
      this.stepArr.push([4, 'Go to the main screen of your watch. Click on the gear button.', 'eighthourstep5.png']);
      this.stepArr.push([5, 'Scroll down until you see the Connections tab. Click on this tab.', 'eighthourstep6.gif']);
      this.stepArr.push([6, 'Scroll down and ensure Wifi connection is set to Auto.', 'eighthourstep7.gif']);
    }

  }

  twentyFourHourSteps(): void {
    this.stepArr = new Array();
    this.stepArr.push([0, 'Click a button on the watch to get to the landing screen.', 'twentyfourhourstep1.png']);
    this.stepArr.push([1, 'Using your finger swipe to the left.', 'twentyfourhourstep2.png']);
    this.stepArr.push([2, 'Go to the main screen of your watch. Click on the highlighted button.', 'twentyfourhourstep3.png']);

    this.stepArr.push([3, 'Arrive at this screen.', 'twentyfourhourstep4.png']);
    this.stepArr.push([4, 'Enter 1514 on this screen. If you enter any incorrect numbers just tap ok and start over.', 'twentyfourhourstep5.png']);
    this.stepArr.push([5, 'Once arriving at this screen click on reset services.', 'twentyfourhourstep6.png']);
    this.stepArr.push([6, 'Click on Exit, once Reset is done. Please wait for 30 minutes, then return to this page and press refresh.', 'twentyfourhourstep7.png']);
  }

  openSamsungApp() {
    if (device.platform) {
      if (device.platform === 'Android') {
        const sApp = startApp.set({
          'application': 'com.samsung.android.app.watchmanager'
          // 'application' : 'com.ouraring.oura'
        }).start();
      } else if (device.platform === 'iOS') {
        const sApp = startApp.set('samsung-galaxy-watch-gear-s://').start();
      }
    }
  }

}
