import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-title-question',
    template: '<div class="question-wrapper">\n' +
    '    <p class="question-title">\n' +
    '    <i *ngIf="soundUrl" (click)="playAudio()" class="fas fa-volume-up"></i>\n' +
    '        {{title}}\n' +
    '    </p>' +
        '<img *ngIf="imageUrl" [src]="imageUrl" class="w-100" />' +
        '<ul *ngIf="bullets">' +
        '<li *ngFor="let bullet of bullets">{{bullet}}</li>' +
        '</ul>' +
    '</div>'
})
export class TitleQuestionComponent implements OnInit {
    @Input() title: string;
    @Input() soundUrl: string;
    @Input() imageUrl: string;
    @Input() player: any;
    @Input() bullets: Array<string>;

    constructor() { }

    ngOnInit() {
    }

    playAudio() {
        this.player.src = this.soundUrl;
        this.player.play();
    }
}
