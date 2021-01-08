import { ActivatedRoute } from '@angular/router';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
    selector     : 'error-500',
    templateUrl  : './error-500.component.html',
    styleUrls    : ['./error-500.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class Error500Component implements OnInit
{
    status: any;
    error: any;
    /**
     * Constructor
     */
    constructor( private activeRoute: ActivatedRoute)
    {

    }
    ngOnInit(): void {
        this.activeRoute.params.subscribe(params => {
            this.status = params['status'];
            this.error = params['error'];
        });
    }
}
