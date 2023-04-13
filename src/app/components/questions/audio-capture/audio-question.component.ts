import {Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroupDirective} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import * as RecordRTC from 'recordrtc';

declare var device;

@Component({
  selector: 'app-audio-question',
  templateUrl: './audio-question.component.html',
  styleUrls: ['./audio-question.component.scss']
})
export class AudioQuestionComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @ViewChild('audio', {static: false}) audio: ElementRef<HTMLAudioElement>;
  prompt: string;
  stream: any;
  recordRTC: any;
  @Input() value: Blob;
  @Output() valueChange: EventEmitter<Blob> = new EventEmitter<Blob>();
  @ViewChild('formDir', {static: false}) questionnaireForm: FormGroupDirective;

  constructor( private notif: NotificationsService, private ngZone: NgZone) { }

  ngOnInit() {
    if (!this.value) {
      this.value = new Blob();
    }
  }

  ngOnDestroy() {
    this.audio.nativeElement.pause();
  }

  toggleRecording() {
    if (!this.recordRTC || this.recordRTC.getState() !== 'recording') {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  errorCallback( errorCode ) {
    this.notif.error('cannot use your device to record');
  }

  successCallback(stream: MediaStream) {
    const options = {
      mimeType: 'audio/mpeg', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
      audioBitsPerSecond: 96000
    };
    this.stream = stream;
    this.ngZone.run(() => {
      this.recordRTC = RecordRTC(stream, options);
      this.recordRTC.startRecording();
    });
    // let video: HTMLVideoElement = this.video.nativeElement;
    // video.src = window.URL.createObjectURL(stream);
    // this.toggleControls();
  }

  cordovaCaptureSuccess(mediaFiles: any) {
    let i, path, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
      path = mediaFiles[i].fullPath;
      this.processAudio(path);
    }
  }

  cordovaStartRecording() {
    (navigator as any).device.capture.captureAudio(this.cordovaCaptureSuccess.bind(this),
        this.errorCallback.bind(this));
  }

  htmlStartRecording() {
    const mediaConstraints = {
      audio: true
    };
    navigator.mediaDevices
        .getUserMedia(mediaConstraints)
        .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  startRecording() {
    const mediaConstraints = {
      audio: true
    };

    if (window['plugins']) {
      if (device.platform === 'Android') {
        const Permission = (window as any).plugins.Permission;

        const permission = 'android.permission.RECORD_AUDIO';

        Permission.has(permission, (hasPermResult) => {
          if (!hasPermResult[permission]) {
            Permission.request(permission, (results) => {
              if (results[permission]) {
                this.htmlStartRecording();
              }
            }, this.errorCallback.bind(this))
          } else {
            this.htmlStartRecording();
          }
        }, this.errorCallback.bind(this))
      } else if (device.platform === 'browser') {
        this.htmlStartRecording();
      }  else if (device.platform === 'iOS') {
        this.cordovaStartRecording();
      } else {
        this.htmlStartRecording();
      }
    }
  }

  stopRecording() {
    const recordRTC = this.recordRTC;
    recordRTC.stopRecording(this.processAudio.bind(this));
    const stream = this.stream;
    stream.getAudioTracks().forEach(track => track.stop());
  }

  processAudio(audioVideoWebMURL) {
    const audio: HTMLAudioElement = this.audio.nativeElement;
    const recordRTC = this.recordRTC;
    audio.src = audioVideoWebMURL;
    this.toggleControls();
    this.value = recordRTC.getBlob();
    this.valueChange.emit(this.value);
    recordRTC.getDataURL(function (dataURL) { });
  }

  toggleControls() {
    const video: HTMLAudioElement = this.audio.nativeElement;
    video.muted = false;
    video.controls = true;
    video.autoplay = false;
  }

  isRecording() {
    return this.recordRTC && this.recordRTC.getState() === 'recording';
  }
}
