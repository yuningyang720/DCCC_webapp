import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-scale-question',
    templateUrl: './scale-question.component.html',
    styleUrls: ['./scale-question.component.scss']
})
export class ScaleQuestionComponent implements OnInit {
    @Input() value: number;
    @Input() indicator?: Array<string>;
    @Input() title: string;
    @Input() max?: number;
    @Input() min?: number;
    @Input() tooltip?: boolean;
    @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();
    @Input() required: boolean;

    constructor() { }

    ngOnInit() {
        if (!this.max) {
            this.max = 100;
        }
        if (!this.min) {
            this.min = 0;
        }
        if (!this.tooltip) {
            this.tooltip = false;
        }
        if (this.value === undefined || this.value === null) {
            this.value = Math.floor( (this.min + this.max) / 2);
        }
    }

    onChange() {
        this.valueChange.emit(this.value);
    }

}
