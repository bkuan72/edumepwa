import { ActivatedRoute } from '@angular/router';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
    selector     : 'error-404',
    templateUrl  : './error-404.component.html',
    styleUrls    : ['./error-404.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class Error404Component implements OnInit
{
    status: any;
    error: any;
    /**
     * Constructor
     */
    constructor(
        private activeRoute: ActivatedRoute
    )
    {

    }

    ngOnInit(): void {
        this.activeRoute.params.subscribe(params => {
            this.status = params['status'];
            this.error = params['error'];
        });
    }
}
