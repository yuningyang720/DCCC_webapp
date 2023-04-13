import {Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {ControlContainer, FormGroupDirective, NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {RestService} from '../../../services/rest.service';
import {ProfileKeysService} from '../../../services/profile-keys.service';
import {NotificationsService} from 'angular2-notifications';
import {UploadPhotoValidator} from '../../../directives/validators/upload-photo-validator.directive';

declare var LocalFileSystem: any;
const IMAGE_DIRECTORY = 'memories/';

@Component({
  selector: 'app-upload-photo-question',
  templateUrl: './upload-photo-question.component.html',
  styleUrls: ['./upload-photo-question.component.scss'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class UploadPhotoQuestionComponent implements OnInit {
  @Input() title: string;
  prompt: string;
  stream: any;
  @Input() required = false;
  @Input() value: File;
  @Input() key: string;
  @Output() valueChange: EventEmitter<File> = new EventEmitter<File>();
  name: string;

  constructor(private route: ActivatedRoute, private rest: RestService, private router: Router,
              private profileKey: ProfileKeysService, private notif: NotificationsService) { }

  ngOnInit() {
    this.name = 'upload_photo_' + this.key;
    if (this.required && this.required === true) {
      this.title = this.title + ' *'
    }
  }

  handleFileInput(files) {
    this.value = files[0];
    this.valueChange.emit(this.value);
    // (window as any).requestFileSystem(LocalFileSystem.PERSISTENT, 0, fs => {
    //   fs.root.getFile(IMAGE_DIRECTORY + Math.random().toString(36).substring(7) + this.value.name,
    //       { create: true, exclusive: false }, fileEntry => {
    //
    //         this.imgService.resize([this.fileToUpload], 500, 500).subscribe(
    //             resizeResult => {
    //                 this.imgService.compress([resizeResult], 1).subscribe(
    //                     compressResult => {
    //                         const reader = new FileReader();
    //                         reader.onload = (e => { this.writeFile(fileEntry, (e.target as any).result) });
    //                         reader.readAsArrayBuffer(compressResult);
    //                     })
    //             });
    //
    //       }, error => {
    //
    //       });
    //
    // }, fileError => {
    //   this.notif.error('error access storage')
    // });
  }

}
