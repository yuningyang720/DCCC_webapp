
import {OnInit, Component, ViewChild, AfterViewInit, NgZone, OnDestroy, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RestService} from '../../services/rest.service';
import {NotificationsService} from 'angular2-notifications';
import * as mimeDb from 'mime-db';
import {ProfileKeysService} from '../../services/profile-keys.service';
import {FormGroupDirective} from '@angular/forms';
import {DatetoolsService} from '../../services/datetools.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {AppConfig} from '../../app.config';

declare var device;
declare var LocalFileSystem: any;
declare var writeFile: any;
const LOCAL_FILES_DIRECTORY = 'surveys/';
const FILE_GENERATING_TYPES = ['audio_capture', 'image_capture'];

@Component({
    selector: 'app-survey',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.scss'],
    styles: [`
    .light-black-backdrop {
        background-color: #292b2c;    }
  `]
})
export class SurveyComponent implements AfterViewInit, OnInit, OnDestroy  {
    @ViewChild('audio', {static: false}) audio: any;
    value = 50;
    questionsSeries: any = [{}];
    seriesIndex = 0;
    answers: any = {};
    prompt: string;
    uploadFiles: any = {};
    localFiles: any = {};
    breathing: any = false;
    closeResult: string;
    @ViewChild('content', {static: true}) content;
    fileToUpload: File = null;
    lastSave: any = {};
    modalCloseResult: string;
    modalResult: string;
    mainPlayer: any = new Audio();
    utilityPlayer: any = new Audio();
    prevSubmissionId: any;
    checkboxValidObject: Object = {'uwu': true};
    @ViewChild('formDir', {static: false}) questionnaireForm: FormGroupDirective;

    private submissionId: string;
    tempSave: any;
    edit_time: Date;

    constructor(private route: ActivatedRoute, private rest: RestService, private router: Router,
                private profileKey: ProfileKeysService, private notif: NotificationsService, private ngZone: NgZone,
                private datetools: DatetoolsService, private modalService: NgbModal
               ) { }


    getRandom(min, max) {
        return min + Math.floor(Math.random() * (max - min));
    }

    ngOnInit() {
        const qid = this.route.snapshot.params['questionnaire'];
        this.prompt = this.route.snapshot.params['prompt'];
        this.rest.getRest().one('questionnaire', qid).get().subscribe(
            response => {
                this.questionsSeries = response.data;

                // Uncomment to view Questionnaire Schema submitted by Admin
                // console.log(this.questionsSeries);
            }, response => {
                this.notif.error('Fail to load questionnaire.', 'Check your internet connection');
            }
        );
        this.answers['start_time'] = this.datetools.getTimestamp();
        this.router.events.subscribe((val) => {
            this.mainPlayer.pause();
            this.utilityPlayer.pause();
        })

    }

    ngAfterViewInit() {
        // Get the most recently submitted answers from server
        this.rest.getRest().one('prompt', 'mysubmissions').get({prompt: this.prompt, per_page: 1}).subscribe(
            response => {

                // Check for previous submission attempt
                if (response[0]) {
                    this.tempSave = response[0].data;
                    this.edit_time = new Date(response[0].time.$date);
                    console.log('Last Save: ', this.tempSave);

                    const time_diff = (this.datetools.getTimestamp() - this.edit_time.getTime()) / 1000;
                    console.log(time_diff);

                    if (this.tempSave['submission_complete'] === false && time_diff < AppConfig.partial_save_expiration) {
                        this.prevSubmissionId = response[0]._id.$oid;
                        this.seriesIndex = this.tempSave['last_page'];

                        // Prompts user to continue or make new submission
                        this.open(this.content);
                    }
                }
            }, response => {

        });
    }

    ngOnDestroy() {
        this.mainPlayer.pause();
        this.utilityPlayer.pause();
    }

    checkRequired() {
        for (let i = 0; i < this.questionsSeries[this.seriesIndex].questions.length; ++i) {
            const key = this.questionsSeries[this.seriesIndex].questions[i].key;
            if (this.questionsSeries[this.seriesIndex].questions[i].required &&
                this.questionsSeries[this.seriesIndex].questions[i].required === true) {
                if (!this.questionsSeries[this.seriesIndex].questions[i].value ||
                    Object.keys(this.questionsSeries[this.seriesIndex].questions[i].value).length === 0) {
                    console.log('Form was not submitted');
                    return false;
                }
            }
        }
        return false;
    }

    checkCheckboxValidObject() {
        // console.log(this.checkboxValidObject)
        const values = Object.keys(this.checkboxValidObject).map(key => this.checkboxValidObject[key]);
        // console.log(values);
        // console.log(values.includes(false));
        return values.includes(false);
    }

    open(content) {
        const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.modalCloseResult = `Closed with: ${result}`;
            this.modalResult = result;

            if (this.modalResult === 'Continue') {
                console.log('Continuing with submission . . .');
                console.log('Loading previous answers . . .');

                this.submissionId = this.prevSubmissionId;
                this.lastSave = this.tempSave;
                this.answers = this.lastSave;

            } else if (this.modalResult === 'New') {
                this.seriesIndex = 0;
                this.lastSave = {};

                console.log('New submission started.')

            }
        }, (reason) => {
            this.modalCloseResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log(this.modalCloseResult);
        });

    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    submit(form) {
        window.scroll(0, 0);

        this.mainPlayer.pause();
        this.utilityPlayer.pause();

        for (let i = 0; i < this.questionsSeries[this.seriesIndex].questions.length; i++) {
            if (FILE_GENERATING_TYPES.includes(this.questionsSeries[this.seriesIndex].questions[i].type) &&
                this.questionsSeries[this.seriesIndex].questions[i].key) {
                if (this.questionsSeries[this.seriesIndex].questions[i].value &&
                    this.questionsSeries[this.seriesIndex].questions[i].value.size > 0) {
                    if (this.questionsSeries[this.seriesIndex].questions[i].upload) {
                        this.uploadFiles[this.questionsSeries[this.seriesIndex].questions[i].key] =
                            new Blob([this.questionsSeries[this.seriesIndex].questions[i].value],
                                {type: this.questionsSeries[this.seriesIndex].questions[i].value.type});
                    } else {
                        this.localFiles[this.questionsSeries[this.seriesIndex].questions[i].key] =
                            new Blob([this.questionsSeries[this.seriesIndex].questions[i].value],
                                {type: this.questionsSeries[this.seriesIndex].questions[i].value.type});
                    }
                }
            } else if (this.questionsSeries[this.seriesIndex].questions[i].key) {
                this.answers[this.questionsSeries[this.seriesIndex].questions[i].key] =
                    this.questionsSeries[this.seriesIndex].questions[i].value;
            }
        }

        // Goto Next Page
        const lastPageBeforeConditionCheck = this.seriesIndex;
        this.seriesIndex++;

        // Check next page for conditions
        const checkCondition: boolean = this.checkCondition();

        if (checkCondition) {
            this.partialUpload();
        } else {
            this.seriesIndex = lastPageBeforeConditionCheck;
            this.finalUpload();
        }
    }

    whereToBack(): number {
        let toGoIndex = this.seriesIndex - 1;
        while (toGoIndex >= 0) {
            if (this.checkPageConditions(toGoIndex)) {
                return toGoIndex;
            }
            toGoIndex -= 1;
        }
        return -1;
    }

    back() {
        if (this.whereToBack() >= 0) {
            this.seriesIndex = this.whereToBack();
        }
    }

    checkCondition() {
        while (this.seriesIndex < this.questionsSeries.length) {
            if (this.questionsSeries[this.seriesIndex].conditions) {
                if (this.checkPageConditions(this.seriesIndex)) {
                    return true;
                } else {
                    this.seriesIndex ++;
                }
            } else {
                return true;
            }
        }
        return false;
    }

    checkPageConditions(index: number) {
        if (this.questionsSeries[index].conditions) {
            const or_conditions = this.questionsSeries[index].conditions;
            for (const and_condition of or_conditions) {
                let allGood = true;
                for (const condition of and_condition) {
                    if (!this.checkConditionMet(condition)) {
                        allGood = false;
                        break;
                    }
                }
                if (allGood) {
                    return true;
                }
            }
            return false;
        } else {
            return true;
        }
    }

    partialUpload() {
        this.saveLocalFiles();

        this.answers['submission_complete'] = false;
        this.answers['last_page'] = this.seriesIndex;

        if (!this.submissionId) {
            this.postAnswers();
        } else {
            this.updateAnswers();
        }
    }

    finalUpload() {
        this.saveLocalFiles();
        this.answers['submission_complete'] = true;
        this.answers['last_page'] = 0;

        if (!this.submissionId) {
            this.postAnswers();
        } else {
            this.updateAnswers();
        }
    }

    prepareAnswers() {
        let str_ans = JSON.stringify(this.answers);
        str_ans = str_ans.replace(/[^\w\s:{},"]/g, '');
        const submitting = JSON.parse(str_ans);
        return submitting;
    }

    postAnswers() {
        const submitting = this.prepareAnswers();
        this.rest.getRestNoSpinner().one('prompt', this.prompt).customPOST(submitting, 'submit').subscribe(
            response => {
                this.submissionId = response._id.$oid;
                this.uploadFilesContent();
            }, response => {
                this.notif.error('Error submitting the survey.');
            }
        );
    }

    updateAnswers() {
        const submitting = this.prepareAnswers();
        this.rest.getRestNoSpinner().one('prompt', this.prompt).one('submit', this.submissionId)
                .customPUT(submitting).subscribe(
                    response => {
                this.submissionId = response._id.$oid;
                this.uploadFilesContent();
            }, response => {
                this.notif.error('Error updating the survey.');
            }
        );
    }

    uploadFilesContent() {
        if (Object.keys(this.uploadFiles).length > 0) {
            const files = new FormData();
            for (const key in this.uploadFiles) {
                const val: Blob = this.uploadFiles[key];
                const filename = 'blob.' + mimeDb[val.type].extensions[0];
                console.log(val.type);
                files.append(key, val, filename);
            }
            this.rest.getRest().one('prompt', this.prompt).one('submit', this.submissionId)
                .customPUT(files, 'files').subscribe(
                response => {

                    if (this.answers['submission_complete'] === true) {
                        this.notif.success('Survey successfully submitted.');
                        this.router.navigate(['']);
                    }

                }, response => {
                    this.notif.error('Error uploading the survey files.');
                }
            );
        } else {
            if (this.answers['submission_complete'] === true) {
                this.notif.success('Survey successfully submitted.');
                this.router.navigate(['']);
            }
        }
    }

    saveLocalFiles() {
        if (this.localFiles) {
            for (const key in this.localFiles) {
                const val: Blob = this.localFiles[key];
                const fileExt = mimeDb[val.type].extensions[0];
                this.handleFileInput(val, fileExt, key, () => {
                    delete this.localFiles[key];
                });
            }
        }
    }

    writeFile(fileEntry, dataObj, success) {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter( fileWriter => {

            fileWriter.onwriteend = function() {
                success()
                console.log('Successful file write...');
            };

            fileWriter.onerror = function (e) {
                console.log('Failed file write: ' + e.toString());
            };

            if (!dataObj) {
                this.notif.error('File is empty');
            }

            fileWriter.write(dataObj);
        });
    }

    handleFileInput(fileToSave, fileExt, key, success) {

        (window as any).requestFileSystem(LocalFileSystem.PERSISTENT, 0, fs => {
            fs.root.getDirectory(LOCAL_FILES_DIRECTORY, {create: true}, surveyDir => {
                surveyDir.getDirectory(key, {create: true}, keyDir => {
                    keyDir.getFile(Math.random().toString(36).substring(7) + '.' + fileExt,
                        { create: true, exclusive: false }, fileEntry => {
                            const reader = new FileReader();
                            reader.onload = (e => { this.writeFile(fileEntry, (e.target as any).result, success) });
                            reader.readAsArrayBuffer(fileToSave);
                            // new Compressor(fileToSave, {
                            //     maxWidth: 500,
                            //     maxHeight: 500,
                            //     quality: .8,
                            //     success: (compressResult: Blob) => {
                            //         const reader = new FileReader();
                            //         reader.onload = (e => { this.writeFile(fileEntry, (e.target as any).result) });
                            //         reader.readAsArrayBuffer(compressResult);
                            //     }, error: (error: Error) => {
                            //         console.error(error);
                            //     }
                            // });
                        }, error => {
                            console.error(error);
                        });
                });
            });

        }, fileError => {
            this.notif.error('error access storage: ' + fileError)
        });
    }

    scaleMax(question) {
        if (question.max) {
            return question.max;
        } else if (question.type === 'image_scale') {
            return question.indicator.length + question.indicator.length - 1
        } else if (question.type === 'scale') {
            return 100
        }
    }

    scaleMin(question) {
        if (question.min) {
            return question.min
        } else {
            return 0;
        }
    }

    private replaceKey(text: string): string {
        if (!text) {
            return text;
        }
        text = text.replace(/\[\{(.*?)\}\]/g, phrase => {
            const key = phrase.match(/\[\{(.*?)\|/)[0].replace(/[^a-zA-Z0-9_]/g, '');
            const alt = phrase.match(/\|(.*?)\}\]/)[0].replace(/[\]\}\|]/g, '');
            if (this.answers[key]) {
                return this.answers[key];
            } else {
                return alt;
            }
        });
        return text;
    }

    textWrap(text: string): string {
        return this.replaceKey(this.profileKey.replaceText(text));
    }

    saveLastChange(question) {
        this.answers[question.key + '_last_modify'] = this.datetools.getTimestamp();
    }

    getSubmitButtonText() {
        if (this.questionsSeries.length === 1) {
            return 'submit';
        } else {
            if (this.seriesIndex === this.questionsSeries.length - 1) {
                return 'submit';
            }
            return 'next';
        }
    }

    private checkConditionMet(condition: any) {
        let answer;
        if (!condition.on || condition.on === 'this') {
            answer = this.answers[condition.key];
        } else if (condition.on === 'profile') {
            answer = this.profileKey.get(condition.key);
        }

        if (condition.key.includes('.')) {
            let tmp = this.answers;
            for (const part of condition.key.split('.')) {
                tmp = tmp[part];
            }
            answer = tmp;
        }
        if (!answer) {
            return condition.default ? condition.default : false;
        }
        switch (condition.op) {
            case 'in':
                return condition.value.includes(answer);
            case 'eq':
                return condition.value === answer;
            case 'ne':
                return condition.value !== answer;
            case 'gt':
                return condition.value < answer;
            case 'gte':
                return condition.value <= answer;
            case 'lt':
                return condition.value > answer;
            case 'lte':
                return condition.value >= answer;
            case 'nin':
                return !condition.value.includes(answer);
        }
    }
}
