import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AlertComponent } from './alert/alert.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    imports: [
        CommonModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatRippleModule
    ],
    declarations: [
        AlertComponent
    ],
    exports: [AlertComponent]
})
export class CommonComponentModule {}
