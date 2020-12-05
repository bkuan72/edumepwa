import { CommonFn } from './../../../../shared/common-fn';
import { AppSettings } from './../../../../shared/app-settings';
import { isUndefined, isArray } from 'lodash';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

import { SearchModernService } from 'app/main/pages/search/modern/search-modern.service';
import { AppSettingsService } from 'app/services/app-settings/app-settings.service';

@Component({
    selector     : 'search-modern',
    templateUrl  : './search-modern.component.html',
    styleUrls    : ['./search-modern.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchModernComponent implements OnInit, OnDestroy, AfterViewInit
{
    @ViewChild('searchInput') searchInput: ElementRef;
    searchItems: any[];
    foundItems: any[];
    currentPage: number;
    pageLines: number;
    settings: AppSettings;
    maxPageNo: number;
    pageNumbers: number[];
    paginationStart: number;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {SearchModernService} _searchModernService
     */
    constructor(
        private _searchModernService: SearchModernService,
        private _appSettings: AppSettingsService,
        private _commonFn: CommonFn
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.searchItems = [];
        this.foundItems = [];
        this.currentPage = 0;
        this.maxPageNo = 0;
        this.paginationStart = 4;
        this.pageNumbers = [];
        this.pageLines = 20;
        this._appSettings.getSettings().subscribe(settings => this.settings = settings, () => null, () => {
            this.pageLines = this.settings.searchPageLines;
        });
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
            .pipe(
                takeUntil(this._unsubscribeAll))
            .subscribe(results => {
                if (isArray(results) && !isUndefined(results.length)) {
                    this.foundItems = results;
                    this.searchItems = [];
                    this.doLoadPage(1);
                }
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

    ngAfterViewInit(): void {
        // server-side search
        fromEvent(this.searchInput.nativeElement, 'keyup')
        .pipe(
            filter(Boolean),
            debounceTime(1000),
            distinctUntilChanged(),
            tap((_text) => {
                this._searchModernService.getSearchData(this.searchInput.nativeElement.value);
            })
        )
        .subscribe();
    }

    leftChevronDisabled() {
        return this.currentPage <= 1;
    }

    doLoadPage = (pageNo: number): void => {
        let cntLines = 0;
        this.maxPageNo = this._commonFn.getPageNo(this.foundItems.length, this.pageLines);
        if (pageNo <= 0) {
            pageNo = 1;
        } else {
            if (pageNo > this.maxPageNo) {
                return;
            }
        }
        this.currentPage = pageNo;
        const startIdx = (this.currentPage - 1) * this.pageLines;
        this.pageNumbers = [];
        this.searchItems = [];
        let paginationSet = false;
        let lastPage = 0;

        this.foundItems.forEach((item, idx) => {
            if (idx >= startIdx) {
                if (cntLines < this.pageLines) {
                    this.searchItems.push(item);
                    cntLines++;
                }
            }
            const page = this._commonFn.getPageNo(idx, this.pageLines);
            if (page >= this.paginationStart) {
                if (paginationSet) {
                    this.pageNumbers.push(-1);
                }
                paginationSet = true;
            } else {
                if (lastPage !== page) {
                    this.pageNumbers.push(page);
                    lastPage = page;
                }
            }
        });

    }

    movePaginationForward(): void {

    }
    movePaginationBack(): void {

    }

    trackByUuid(index: number, item: any) {
        return item.data.id;
      }
}
