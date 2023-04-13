import {Directive} from '@angular/core';
import {Input} from '@angular/core';
import {NG_VALIDATORS, Validator, FormControl} from '@angular/forms';

@Directive({
    selector: '[requireCheckbox]',
    providers: [
        { provide: [NG_VALIDATORS], useExisting: CheckboxValidator, multi: true },
    ]
})

export class CheckboxValidator implements Validator {
    // @Input('requireCheckbox') checkboxValues: Object;
    currentCount: BigInteger; 
    static validate(c: FormControl): {[key: string]: any} {
        console.log(c);
        return true ? null : null;
    }

    validate(c: FormControl): {[key: string]: any} | null {
        return CheckboxValidator.validate(c);
    }
}
