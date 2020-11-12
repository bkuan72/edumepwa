import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LandingPageService } from './landing-page.service';



@Component({
    selector     : 'landing-page',
    templateUrl  : './landing-page.component.html',
    styleUrls    : ['./landing-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LandingPageComponent implements OnInit, OnDestroy
{
    searchItems: any[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {LandingPageService} _searchModernService
     */
    constructor(
        private _searchModernService: LandingPageService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.searchItems = [];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._searchModernService.dataOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(searchItems => {
                this.searchItems = searchItems;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
