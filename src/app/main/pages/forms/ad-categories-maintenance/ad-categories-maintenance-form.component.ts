import { takeUntil } from 'rxjs/operators';
import { AdCategoryService } from './../../../../services/ad-category/ad-category.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';

@Component({
    selector   : 'ad-categories-maintenance-form',
    templateUrl: './ad-categories-maintenance-form.component.html',
    styleUrls  : ['./ad-categories-maintenance-form.component.scss']
})
export class AdCategoriesFormComponent implements OnInit, OnDestroy
{
    form: FormGroup;
    editing = {};
    rows = [];

    categoriesDTO: any;
    updCategoriesDTO: any;
    categoriesSchema: any;

    ColumnMode = ColumnMode;

    // Private
    private _unsubscribeAll: Subject<any>;


    updateValue(event, cell, rowIndex): void {
      console.log('inline editing rowIndex', rowIndex);
      this.editing[rowIndex + '-' + cell] = false;
      this.rows[rowIndex][cell] = event.target.value;
      this.rows = [...this.rows];
      console.log('UPDATED!', this.rows[rowIndex][cell]);
    }



/**
 * Constructor 
 * 
 * @param adCategories adCategory Service
 */
    constructor(
        private adCategories: AdCategoryService
    )
    {
        this.rows = this.adCategories.categories;
        this.categoriesDTO = this.adCategories.categoriesDTO;
        this.updCategoriesDTO = this.adCategories.categoriesUpdDTO;
        this.categoriesSchema = this.adCategories.categoriesSchema;
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.adCategories.categoriesOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((adCategories) => {
            this.rows = adCategories;
        });
        this.adCategories.categoriesDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((adCategoriesDTO) => {
            this.categoriesDTO = adCategoriesDTO;
        });
        this.adCategories.categoriesUpdDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((adCategoriesUpdDTO) => {
            this.updCategoriesDTO = adCategoriesUpdDTO;
        });
        this.adCategories.categoriesSchemaOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((adCategoriesSchema) => {
            this.categoriesSchema = adCategoriesSchema;
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Finish the horizontal stepper
     */
    finishHorizontalStepper(): void
    {
        alert('You have finished the horizontal stepper!');
    }

    /**
     * Finish the vertical stepper
     */
    finishVerticalStepper(): void
    {
        alert('You have finished the vertical stepper!');
    }
}
