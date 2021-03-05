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
import { ImageDropUploadComponent } from './image-drop-upload/image-drop-upload.component';
import { DragDropDirective } from './image-drop-upload/appDragDrop.directive';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@NgModule({
    imports: [
        ReactiveFormsModule,
        CommonModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatRippleModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
    ],
    declarations: [
        AlertComponent,
        ChipsSelectorComponent,
        ImageDropUploadComponent,
        DragDropDirective
    ],
    exports: [
        AlertComponent,
        ChipsSelectorComponent,
        ImageDropUploadComponent,
        DragDropDirective
    ]
})

export class CommonComponentModule {}
