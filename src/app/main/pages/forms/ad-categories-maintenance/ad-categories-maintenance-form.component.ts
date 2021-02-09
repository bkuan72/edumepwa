import { CommonFn } from './../../../../shared/common-fn';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { takeUntil } from 'rxjs/operators';
import { AdCategoryService } from './../../../../services/ad-category/ad-category.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { AlertService } from 'app/services/alert/alert.service';

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
    submitted = false;

    categoriesDTO: any;
    updCategoriesDTO: any;
    categoriesSchema: any;

    ColumnMode = ColumnMode;

    // Private
    private _unsubscribeAll: Subject<any>;


/**
 * Constructor
 *
 * @param adCategories adCategory Service
 */
    constructor(
        private _formBuilder: FormBuilder,
        private adCategories: AdCategoryService,
        private _authSession: AuthTokenSessionService,
        private _fn: CommonFn,
        private _alertService: AlertService
    )
    {
        this.rows = this.adCategories.categories;
        this.categoriesDTO = this.adCategories.categoriesDTO;
        this.updCategoriesDTO = this.adCategories.categoriesUpdDTO;
        this.categoriesSchema = this.adCategories.categoriesSchema;
        this._unsubscribeAll = new Subject();
        // this.fetch(data => {
        //         // push our inital complete list
        //     this.rows = data;
        //   });
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
        this.form = this._formBuilder.group({
            category   : ['', [Validators.maxLength(30)]]
        });
        this.adCategories.doLoadCategories();
        if (this._authSession.devUser) {
            this.adCategories.getCategoriesDTO();
            this.adCategories.getCategoriesUpdDTO();
            this.adCategories.getCategoriesSchema();
        }
    }


    // fetch(cb) {
    //     const req = new XMLHttpRequest();
    //     req.open('GET', `assets/data/company.json`);
    
    //     req.onload = () => {
    //       cb(JSON.parse(req.response));
    //     };
    
    //     req.send();
    //   }

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

    onSubmit(): void {
        if (this.submitted) {
            return;
        }
        const category = this.form.controls['category'].value;
        if (this._fn.emptyStr(category)) {
            return;
        }
        this.submitted = true;
        this.adCategories.exist(category).then(() => {
            this.adCategories.doLoadCategories().finally(() => {
                this._alertService.error('Category Code Already Exist');
                this.submitted = false;
            });
        })
        .catch(() => {
            this.adCategories.addCategory(category).then(() => {
                this.form.reset();
                this.adCategories.doLoadCategories();
                this.submitted = false;
            })
            .catch(() => {
                this.submitted = false;
            });
        });
    }

    updateCategory(event, cell, rowIndex): void {
        console.log('inline editing rowIndex', rowIndex);
        this.editing[rowIndex + '-' + cell] = false;
        if (event.target.value !== this.rows[rowIndex][cell]) {
          this.rows[rowIndex][cell] = event.target.value;
          this.rows = [...this.rows];
          console.log('UPDATED!', this.rows[rowIndex][cell]);
          this.adCategories.updateCategory(this.rows[rowIndex].id, this.rows[rowIndex][cell]).finally(() => {
            this.adCategories.doLoadCategories();
        });
        }
      }
      deleteCategory(event, rowIndex): void {
          const id = this.rows[rowIndex].id;
          this.adCategories.deleteCategory(id).finally(() => {
            this.adCategories.doLoadCategories();
          });
      }
}
