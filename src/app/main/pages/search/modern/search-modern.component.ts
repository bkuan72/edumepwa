import { AdAgeGroupService } from 'app/services/ad-age-group/ad-age-group.service';
import { isUndefined, isArray } from 'lodash';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';


import { SearchModernService } from 'app/main/pages/search/modern/search-modern.service';
import { AppSettingsService } from 'app/services/app-settings/app-settings.service';
import { AppSettings } from 'app/shared/app-settings';
import { CommonFn } from 'app/shared/common-fn';
import { AdCategoryService } from 'app/services/ad-category/ad-category.service';
import { AdKeywordService } from 'app/services/ad-keyword/ad-keyword.service';

enum PaginationType {
    PAGE_UP,
    PAGE_DOWN,
    NONE
};

@Component({
    selector     : 'search-modern',
    templateUrl  : './search-modern.component.html',
    styleUrls    : ['./search-modern.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchModernComponent implements OnInit, OnDestroy, AfterViewInit
{
    @ViewChild('searchInput') searchInput: ElementRef;
    searchItems: any[] = [];
    foundItems: any[] = [];
    currentPage = 0;
    settings: AppSettings;
    maxPageNo = 0;
    pageNumbers: number[] = [];
    paginationStart = 1;
    paginationEnd: number;
    filterDTO: any;

    filterCategories: any[] = [];
    filterKeywords: any[] = [];
    filterAgeGroups: any[] = [];

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
        private _commonFn: CommonFn,
        private _adCategories: AdCategoryService,
        private _adKeywords: AdKeywordService,
        private _adAgeGroups: AdAgeGroupService
    )
    {
        // Set the private defaults
        this.settings = this._appSettings.settingsValue;
        this.filterDTO = this._searchModernService.filterDTO;
        this._unsubscribeAll = new Subject();
        this.paginationEnd = this.paginationStart + this.settings.paginationRange;
        this.filterCategories = this._adCategories.categories;
        this.filterAgeGroups = this._adAgeGroups.ageGroups;
        this.filterKeywords = this._adKeywords.keywords;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._adKeywords.keywordsOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((adKeywords) => {
            this.filterKeywords = adKeywords;
        });
        this._adCategories.categoriesOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((adCategories) => {
            this.filterCategories = adCategories;
        });
        this._adAgeGroups.ageGroupsOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((adAgeGroups) => {
            this.filterAgeGroups = adAgeGroups;
        });
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
        this._searchModernService.filterDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((filterDTO) => {
            this.filterDTO = filterDTO;
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


    doLoadPage = (pageNo: number): void => {
        let paginationAction: PaginationType = PaginationType.NONE;
        let cntLines = 0;
        this.maxPageNo = this._commonFn.getPageNo(this.foundItems.length, this.settings.searchPageLines);
        let moveAPage = true;
        if (pageNo === 0) {
            return;
        }
        if (pageNo > this.maxPageNo) {
            return;
        }
        if (pageNo < 0) {
            if (pageNo === -2) {
                paginationAction = PaginationType.PAGE_UP;
                moveAPage = false;
            } else { 
                if (pageNo === -1) {
                    paginationAction = PaginationType.PAGE_DOWN;
                    moveAPage = false;
                }
            }
        } else {
            if (pageNo < this.paginationStart) {
                paginationAction = PaginationType.PAGE_DOWN;
            }
            if (pageNo > this.paginationEnd) {
                paginationAction = PaginationType.PAGE_UP;
            }
        }
        if (pageNo < 0 && paginationAction === PaginationType.NONE) {
            pageNo = 1;
            return;
        }
        if (pageNo > this.maxPageNo) {
            return;
        }
        switch(paginationAction) {
            case PaginationType.PAGE_UP:
                this.paginationStart += this.settings.paginationRange;
                this.paginationEnd = this.paginationStart + this.settings.paginationRange;
                if (this.paginationEnd > this.maxPageNo) {
                    this.paginationEnd = this.maxPageNo;
                }
                pageNo = this.paginationStart;
                if (moveAPage) {
                    pageNo += 1;
                }
                break;
            case PaginationType.PAGE_DOWN:
                this.paginationEnd = this.paginationStart;
                this.paginationStart -= this.settings.paginationRange;
                pageNo = this.paginationEnd;
                if (moveAPage) {
                    pageNo -= 1;
                }
                break;
        }

        this.currentPage = pageNo;
        const startIdx = (this.currentPage - 1) * this.settings.searchPageLines;
        this.pageNumbers = [];
        this.searchItems = [];
        let paginationStartSet = false;
        let paginationEndSet = false;
        let page = 0;
        let lastPage = 0;
        let lastPushPage = 0;

        this.foundItems.forEach((item, idx) => {
            if (idx >= startIdx) {
                if (cntLines < this.settings.searchPageLines) {
                    this.searchItems.push(item);
                    cntLines++;
                }
            }
            page = this._commonFn.getPageNo(idx, this.settings.searchPageLines);
            if (lastPage !== page) {
                if (page < this.paginationStart && !paginationStartSet) {
                    this.pageNumbers.push(-1);
                    paginationStartSet = true;
                }
                if ( page > this.paginationEnd && page < this.maxPageNo && !paginationEndSet) {
                    this.pageNumbers.push(-2);
                    paginationEndSet = true;
                }
                if (page >= this.paginationStart && page <= this.paginationEnd) {
                    this.pageNumbers.push(page);
                    lastPushPage = page;
                }
            }
            lastPage = page;

        });
        if ( lastPushPage !== this.maxPageNo) {
            this.pageNumbers.push(this.maxPageNo);
        }
    }

    trackByUuid(index: number, item: any): string {
        return item.id;
    }
}
