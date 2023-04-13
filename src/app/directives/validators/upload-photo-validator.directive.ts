import {Directive} from '@angular/core';
import {NG_VALIDATORS, Validator, FormControl} from '@angular/forms';

@Directive({
    selector: '[requirePhotoUpload]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: UploadPhotoValidator, multi: true },
    ]
})

export class UploadPhotoValidator implements Validator {
    static validate(c: FormControl): {[key: string]: any} {
        return c.value == null || c.value.length == 0 ? { 'required' : true } : null;
    }

    validate(c: FormControl): {[key: string]: any} | null {
        return UploadPhotoValidator.validate(c);
    }
}
