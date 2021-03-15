import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector   : 'ok-dialog',
    templateUrl: './ok-dialog.component.html',
    styleUrls  : ['./ok-dialog.component.scss']
})
export class OkDialogComponent
{
    public confirmMessage: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<OkDialogComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<OkDialogComponent>
    )
    {
    }

}
