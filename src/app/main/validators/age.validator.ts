import { AbstractControl, ValidatorFn } from '@angular/forms';
export class AgeValidators {
    static ageLessThan(ageField1: string, ageField2: string, 
                       validatorFail: { [key: string]: boolean }
        ): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            const age1 = c.get(ageField1).value;
            const age2 = c.get(ageField2).value;
            if ((age1 !== age2) && age1 > age2) {
                return validatorFail;
            }
            return null;
        };
    }
}