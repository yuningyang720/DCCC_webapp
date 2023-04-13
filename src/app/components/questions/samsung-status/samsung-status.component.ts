// import {Component, Input, OnInit} from '@angular/core';
// import {RestService} from '../../../services/rest.service';
// import {DatetoolsService} from '../../../services/datetools.service';
// import {AppConfig} from '../../../app.config';

// @Component({
//   selector: 'app-samsung-status',
//   templateUrl: './samsung-status.component.html',
//   styleUrls: ['./samsung-status.component.scss']
// })
// export class SamsungStatusComponent implements OnInit {
//   @Input() title: string;

//   loadingSamsung = true;
//   neverConnected = false;
//   recentUpload = true;
//   lateUpload = false;
//   timeElapsedFormatted;
//   stepArr = new Array();

//   stepIndex = 0;

//   constructor(private rest: RestService, private datetool: DatetoolsService) { }

//   loadSamsungLastUpload() {
//     this.rest.getRest().one('sensing').one('samsung_raw/last_upload').get().subscribe(
//         response  => {
//           this.loadingSamsung = false;
//           if (response.utctime < 0 ) {
//             this.neverConnected = true;
//           } else {
//             const nowdate = new Date();
//             const utcnow = (nowdate.getTime() + nowdate.getTimezoneOffset() * 60 * 1000) / 1000;
//             const timeElapsed = utcnow - response.utctime;
//             this.recentUpload = timeElapsed > AppConfig.RECENT_TRESHOLD && timeElapsed < AppConfig.LATE_TRESHOLD;
//             this.lateUpload = timeElapsed > AppConfig.LATE_TRESHOLD;
//             this.timeElapsedFormatted = this.datetool.formatDuration(timeElapsed);
//           }
//         }, error => {
//           this.loadingSamsung = false;
//         }
//     );
//   }

//   ngOnInit() {
//     this.loadSamsungLastUpload();
//   }
//   next(type: number): any { // if wifi is already on, there is 2 step
//       // i think this method will be good if add 1
//       this.stepIndex = type;
//       if (this.stepIndex < this.stepArr.length - 1) {
//           this.stepIndex++;
//       }

//   }
//   back(type: number): any {
//       this.stepIndex = type;
//       if (this.stepIndex !== 0) {
//           this.stepIndex--;
//       } else {
//           this.stepArr.splice(0, this.stepArr.length);
//       }

//   }
//   wifiStatus(type: string): void {
//       if (type === 'turnOn') {
//           this.stepArr = new Array();
//           this.stepArr.push([1, 'Open the app by swiping right from your home screen and tapping on the wifi icon. ' +
//           'Then tap on "next" if you have a send button. If not, exit and then tap on "No SEND Button"', 'step1']);
//           this.stepArr.push([2, 'Tap the send button and wait for the upload to be done. You should get a "Done" ' +
//           'message afterwards.', 'step2']);
//       } else if (type === 'noSend') {
//           if ( this.stepArr.length === 2) {
//               this.stepArr.splice(1, 0, [1, 'You need to set up your wifi connection. ' +
//               'Drag from the top of your home screen to find the settings icon and tap on it.', 'Off_step1']);
//               this.stepArr.splice(2, 0, [2, 'In settings, tap on "Connections" and then, ' +
//               'tap on "Wi-Fi".', 'Off_step2']);
//               this.stepArr.splice(3, 0, [3, 'In "Wi-Fi", tap on "Wi-Fi" and then, ' +
//               'tap on "Always on".', 'Off_step3']);
//               this.stepArr.splice(4, 0, [4, 'Go back to "Wi-fi", tap on "Wi-Fi networks" and' +
//               ' tap on the network you want to connect to.', 'Off_step4']);
//               this.stepArr.splice(5, 0, [1, 'Go back to home (use the bottom button), ' +
//               'swipe, and tap on "wi-fi app". To check the "Send" button again.', 'step1']);
//           } else {}
//       } else {}
//   }
//   eightHoursSteps(): void {
//     this.stepArr = new Array();
//     this.stepArr.push("Open the Galaxy Wearable App.", "eightHourStep1");
//     this.stepArr.push('Ensure that the watch is connected by making sure it says "Connected to Bluetooth"', "eightHourStep2");
//     this.stepArr.push('Now check the Wifi on your watch', "eightHourStep3");
//     this.stepArr.push('Open the app by swiping Left from your home screen.', "eightHourStep4");
//     this.stepArr.push("Go to the main screen of your watch", "eightHourStep5");
//     this.stepArr.push("Click on the gear button.", "eightHourStep6");
//     this.stepArr.push("Scroll down until you see the Connections tab. Click on this tab.", "eightHourStep7");
//     this.stepArr.push("Scroll down and ensure Wifi connection is set to Auto.", "eightHourStep8");
//   }

//   twentyFourHourSteps(): void {
//     this.stepArr = new Array();
    
//   }
// }
import {Component, Input, OnInit} from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {DatetoolsService} from '../../../services/datetools.service';
import {AppConfig} from '../../../app.config';

@Component({
  selector: 'app-samsung-status',
  templateUrl: './samsung-status.component.html',
  styleUrls: ['./samsung-status.component.scss']
})
export class SamsungStatusComponent implements OnInit {
  @Input() title: string;

  loadingSamsung = true;
  neverConnected = false;
  recentUpload = true;
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
            this.recentUpload = timeElapsed < AppConfig.RECENT_TRESHOLD;
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
}
