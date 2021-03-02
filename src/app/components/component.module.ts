import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AlertComponent } from './alert/alert.component';
import { ChipsSelectorComponent } from './chips-selector/chips-selector.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';




@NgModule({
    imports: [
        ReactiveFormsModule,
        CommonModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatRippleModule,
        MatChipsModule,
        MatAutocompleteModule
    ],
    declarations: [
        AlertComponent,
        ChipsSelectorComponent
    ],
    exports: [AlertComponent,
        ChipsSelectorComponent
    ]
})
export class CommonComponentModule {}
