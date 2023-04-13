import {AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {NotificationsService} from 'angular2-notifications';
import {Observable, of} from 'rxjs';
import {GridLayout, Image, PlainGalleryConfig, PlainGalleryStrategy} from '@ks89/angular-modal-gallery';
import * as url from 'url';
import {DomSanitizer} from '@angular/platform-browser';

declare var LocalFileSystem: any;
declare var writeFile: any;

const IMAGE_DIRECTORY = 'surveys/memory/';

@Component({
    selector: 'app-memories',
    templateUrl: './memories.component.html',
    styleUrls: ['./memories.component.scss']
})
export class MemoriesComponent implements AfterViewInit, OnInit {
    items: Image[];
    plainGalleryGrid: PlainGalleryConfig = {
        strategy: PlainGalleryStrategy.GRID,
        layout: new GridLayout({ width: '32%', height: '100px' }, { length: 3, wrap: true })
    };

    constructor(public notif: NotificationsService, private sanitizer: DomSanitizer,
                private ref: ChangeDetectorRef, private ngZone: NgZone) {
    }

    getItems() {
        (window as any).requestFileSystem(LocalFileSystem.PERSISTENT, 0, fs => {
            fs.root.getDirectory(IMAGE_DIRECTORY , { create: true, exclusive: false}, dirEntry => {
                const reader = dirEntry.createReader();
                reader.readEntries( result => {
                    if (result.length >= 0) {
                        this.items = [];
                        let idc = 0;
                        result.forEach(entry => {
                            if (entry.isFile) {
                                this.ngZone.run(() => {
                                    this.items = [...this.items, new Image(idc++, {
                                        img: this.sanitizer.bypassSecurityTrustResourceUrl(entry.toInternalURL())
                                    })]
                                });
                            }
                        })
                    }
                })
            }, function (error) {
                console.error(error);
            })
        }, function (fileError) {
            console.error(fileError);
        });
    }

    ngOnInit() {
        /*
            check for the ./memory directory
                if not-exist create
            read images into items
         */
        this.getItems();

        // this.gallery.ref('lightbox').load(this.items);
        // const timer = Observable.timer(1000);
        // timer.subscribe(t => {
        //     this.ref.markForCheck();
        // });
    }

    ngAfterViewInit () {
        this.ref.markForCheck();
    }
}
