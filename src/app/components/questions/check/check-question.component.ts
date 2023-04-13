import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlContainer, NgForm, Validators} from '@angular/forms';
// import { CheckboxValidator } from './directives/validators/checkbox-validator.directive';
import {FormGroup, FormControl, FormArray} from '@angular/forms';
import {requireCheckboxesToBeCheckedValidator} from './require-checkboxes-to-be-checked.validator';
@Component({
  selector: 'app-check-question',
  templateUrl: './check-question.component.html',
  styleUrls: ['./check-question.component.scss'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class CheckQuestionComponent implements OnInit {
  @Input() title: string;
  @Input() value: object;
  @Input() options: Array<string>;
  @Input() other_bar: any;
  @Output() valueChange: EventEmitter<object> = new EventEmitter<object>();
  @Input() required = false;
  @Input() hideLabel: boolean;
  inline: boolean;
  indicator: boolean;
  @Input() alignment: string;
  @Input() key: string;
  name: string;
  @Input() other_value;
  // @Input() checkboxValidArray;
  // @Output() checkboxValidArrayChange: EventEmitter<Array<Boolean>> = new EventEmitter<Array<Boolean>>();
  @Input() checkboxValidObject;
  @Output() checkboxValidObjectChange: EventEmitter<Object> = new EventEmitter<Object>();
  myFormGroup : FormGroup;
  arrayNumber : number;
  ngOnInit() {
    if (!this.value) {
      this.value = {};
    }
    this.name = 'check_' + this.key;
    this.checkboxValidObject[this.key] = true;
    // this.arrayNumber = this.checkboxValidArray.length;
    // this.checkboxValidArray[this.arrayNumber] = true;
    if (this.required && this.required === true) {
      this.title = this.title + ' *';
      // this.checkboxValidArray[this.arrayNumber] = false;
      this.checkboxValidObject[this.key] = false;
      // let group = {};
      // this.options.forEach(option => {
      //   group[option] = new FormControl(false);
      // })
      // this.myFormGroup = new FormGroup({
      //   myInput: new FormControl('', [Validators.required]),
      //   myCheckboxGroup: new FormGroup(group,requireCheckboxesToBeCheckedValidator())
      // }        
      // )
      // console.log(this.myFormGroup);
    }
    this.checkboxValidObjectChange.emit(this.checkboxValidObject);
    if (this.alignment === 'vertical') {
      this.inline = false;
      this.indicator = false;
    } else if (this.alignment === 'horizontal') {
      this.inline = true;
      this.indicator = false;
    } else if (this.alignment === 'matrix') {
      this.inline = true;
      this.indicator = true;
    }
  }

  
    
    
  onChange() {
    // manual checker that checks when required that at least one checkbox is checked off
    if (this.required === true) {
      var checkAtLeastOneChecked = false;
      for (const [key,value] of (<any>Object).entries(this.value)) {
        if (value == true) {
          checkAtLeastOneChecked = true;
        }
      }
      // this.checkboxValidArray[this.arrayNumber] = checkAtLeastOneChecked;
      // console.log(this.checkboxValidArray);
      // this.checkboxValidArrayChange.emit(this.checkboxValidArray);
      this.checkboxValidObject[this.key] = checkAtLeastOneChecked;
      // console.log(this.checkboxValidObject);
      // console.log(Object.values(this.checkboxValidObject));
      this.checkboxValidObjectChange.emit(this.checkboxValidObject);
    }
    this.valueChange.emit(this.value);
    
    // console.log(this.checkboxValidObject)
  }

  otherValue(otherInput) {
    this.value['other_input'] = otherInput;
    console.log(otherInput);
  }
  
}
