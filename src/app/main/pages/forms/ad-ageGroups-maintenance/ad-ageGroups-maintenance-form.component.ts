import { CrossFieldErrorMatcher } from './../../../../shared/cross-field-error-matcher';
import { AgeValidators } from './../../../validators/age.validator';
import { AlertService } from '../../../../services/alert/alert.service';
import { CommonFn } from '../../../../shared/common-fn';
import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { AdAgeGroupService } from '../../../../services/ad-age-group.service.ts/ad-age-group.service';
import { AuthTokenSessionService } from '../../../../services/auth-token-session/auth-token-session.service';



@Component({
    selector   : 'ad-ageGroups-maintenance-form',
    templateUrl: './ad-ageGroups-maintenance-form.component.html',
    styleUrls  : ['./ad-ageGroups-maintenance-form.component.scss']
})
export class AdAgeGroupsFormComponent implements OnInit, OnDestroy
{
    errorMatcher = new CrossFieldErrorMatcher();
    form: FormGroup;
    editing = {};
    rows = [];
    submitted = false;

    ageGroupsDTO: any;
    updAgeGroupsDTO: any;
    ageGroupsSchema: any;

    ColumnMode = ColumnMode;

    // Private
    private _unsubscribeAll: Subject<any>;


/**
 * Constructor
 *
 * @param adAgeGroups adAgeGroup Service
 */
    constructor(
        private _formBuilder: FormBuilder,
        private adAgeGroups: AdAgeGroupService,
        private _authSession: AuthTokenSessionService,
        private _fn: CommonFn,
        private _alertService: AlertService
    )
    {
        this.rows = this.adAgeGroups.ageGroups;
        this.ageGroupsDTO = this.adAgeGroups.ageGroupsDTO;
        this.updAgeGroupsDTO = this.adAgeGroups.ageGroupsUpdDTO;
        this.ageGroupsSchema = this.adAgeGroups.ageGroupsSchema;
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
        this.adAgeGroups.ageGroupsOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((adAgeGroups) => {
            this.rows = adAgeGroups;
        });
        this.adAgeGroups.ageGroupsDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((adAgeGroupsDTO) => {
            this.ageGroupsDTO = adAgeGroupsDTO;
        });
        this.adAgeGroups.ageGroupsUpdDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((adAgeGroupsUpdDTO) => {
            this.updAgeGroupsDTO = adAgeGroupsUpdDTO;
        });
        this.adAgeGroups.ageGroupsSchemaOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((adAgeGroupsSchema) => {
            this.ageGroupsSchema = adAgeGroupsSchema;
        });
        this.form = this._formBuilder.group({
            ageGroup   : ['', [Validators.maxLength(30), Validators.required]],
            startAge   : [0],
            endAge     : [0]
        }, { validator: Validators.compose([
            AgeValidators.ageLessThan('startAge', 'endAge', { 'startAgeError': true }),
            AgeValidators.ageLessThan('startAge', 'endAge', { 'endAgeError': true })
        ])});
        this.adAgeGroups.doLoadAgeGroups();
        if (this._authSession.devUser) {
            this.adAgeGroups.getAgeGroupsDTO();
            this.adAgeGroups.getAgeGroupsUpdDTO();
            this.adAgeGroups.getAgeGroupsSchema();
        }
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

    onSubmit(): void {
        if (this.submitted) {
            return;
        }
        const ageGroup = this.form.controls['ageGroup'].value;
        const startAge = this.form.controls['startAge'].value;
        const endAge = this.form.controls['endAge'].value;
        if (this._fn.emptyStr(ageGroup)) {
            return;
        }
        this.submitted = true;
        this.adAgeGroups.exist(ageGroup).then(() => {
            this.adAgeGroups.doLoadAgeGroups().finally(() => {
                this._alertService.error('AgeGroup Code Already Exist');
                this.submitted = false;
            });
        })
        .catch(() => {
            this.adAgeGroups.addAgeGroup({
                adAgeGroup_code: ageGroup,
                start_age: startAge,
                end_age: endAge
            }).then(() => {
                this.form.reset();
                this.adAgeGroups.doLoadAgeGroups();
                this.submitted = false;
            })
            .catch(() => {
                this.submitted = false;
            });
        });
    }

    updateAgeGroup(event, cell, rowIndex): void {
        console.log('inline editing rowIndex', rowIndex);
        this.editing[rowIndex + '-' + cell] = false;
        if (event.target.value !== this.rows[rowIndex][cell]) {
          this.rows[rowIndex][cell] = event.target.value;
          this.rows = [...this.rows];
          console.log('UPDATED!', this.rows[rowIndex][cell]);
          this.adAgeGroups.updateAgeGroup(this.rows[rowIndex].id, this.rows[rowIndex][cell]).finally(() => {
            this.adAgeGroups.doLoadAgeGroups();
        });
        }
      }
      deleteAgeGroup(event, rowIndex): void {
          const id = this.rows[rowIndex].id;
          this.adAgeGroups.deleteAgeGroup(id).finally(() => {
            this.adAgeGroups.doLoadAgeGroups();
          });
      }
}
