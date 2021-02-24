import { AlertService } from './../../../../services/alert/alert.service';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { CommonFn } from '../../../../shared/common-fn';
import { takeUntil } from 'rxjs/operators';
import { AdKeywordService } from '../../../../services/ad-keyword/ad-keyword.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { ModuleCodeEnum } from 'app/shared/module-code-enum';

@Component({
    selector   : 'ad-keywords-maintenance-form',
    templateUrl: './ad-keywords-maintenance-form.component.html',
    styleUrls  : ['./ad-keywords-maintenance-form.component.scss']
})
export class AdKeywordsFormComponent implements OnInit, OnDestroy
{
    canEdit: boolean;
    canAdd: boolean;
    canDelete: boolean;
    canDev: boolean;
    form: FormGroup;
    editing = {};
    rows = [];
    submitted = false;

    keywordsDTO: any;
    updKeywordsDTO: any;
    keywordsSchema: any;

    ColumnMode = ColumnMode;

    // Private
    private _unsubscribeAll: Subject<any>;


/**
 * Constructor
 *
 * @param adKeywords adKeyword Service
 */
    constructor(
        private _formBuilder: FormBuilder,
        private adKeywords: AdKeywordService,
        private _authSession: AuthTokenSessionService,
        private _fn: CommonFn,
        private _alertService: AlertService
    )
    {
        this.rows = this.adKeywords.keywords;
        this.keywordsDTO = this.adKeywords.keywordsDTO;
        this.updKeywordsDTO = this.adKeywords.keywordsUpdDTO;
        this.keywordsSchema = this.adKeywords.keywordsSchema;
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
        this.canEdit = this._authSession.canEdit(ModuleCodeEnum.Maintenance);
        this.canAdd = this._authSession.canEdit(ModuleCodeEnum.Maintenance);
        this.canDelete = this._authSession.canDelete(ModuleCodeEnum.Maintenance);
        this.canDev = this._authSession.canDev(ModuleCodeEnum.Maintenance);
        this.adKeywords.keywordsOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((adKeywords) => {
            this.rows = adKeywords;
        });
        this.adKeywords.keywordsDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((adKeywordsDTO) => {
            this.keywordsDTO = adKeywordsDTO;
        });
        this.adKeywords.keywordsUpdDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((adKeywordsUpdDTO) => {
            this.updKeywordsDTO = adKeywordsUpdDTO;
        });
        this.adKeywords.keywordsSchemaOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((adKeywordsSchema) => {
            this.keywordsSchema = adKeywordsSchema;
        });
        this.form = this._formBuilder.group({
            keyword   : ['', [Validators.maxLength(30)]]
        });
        this.adKeywords.doLoadKeywords();
        if (this._authSession.devUser) {
            this.adKeywords.getKeywordsDTO();
            this.adKeywords.getKeywordsUpdDTO();
            this.adKeywords.getKeywordsSchema();
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
        const keyword = this.form.controls['keyword'].value;
        if (this._fn.emptyStr(keyword)) {
            return;
        }
        this.submitted = true;
        this.adKeywords.exist(keyword).then(() => {
            this.adKeywords.doLoadKeywords().finally(() => {
                this._alertService.error('Keyword Code Already Exist');
                this.submitted = false;
            });
        })
        .catch(() => {
            this.adKeywords.addKeyword(keyword).then(() => {
                this.form.reset();
                this.adKeywords.doLoadKeywords();
                this.submitted = false;
            })
            .catch(() => {
                this.submitted = false;
            });
        });
    }

    updateKeyword(event, cell, rowIndex): void {
        console.log('inline editing rowIndex', rowIndex);
        this.editing[rowIndex + '-' + cell] = false;
        if (event.target.value !== this.rows[rowIndex][cell]) {
          this.rows[rowIndex][cell] = event.target.value;
          this.rows = [...this.rows];
          console.log('UPDATED!', this.rows[rowIndex][cell]);
          this.adKeywords.updateKeyword(this.rows[rowIndex].id, this.rows[rowIndex][cell]).finally(() => {
            this.adKeywords.doLoadKeywords();
        });
        }
      }
      deleteKeyword(event, rowIndex): void {
          const id = this.rows[rowIndex].id;
          this.adKeywords.deleteKeyword(id).finally(() => {
            this.adKeywords.doLoadKeywords();
          });
      }
}
