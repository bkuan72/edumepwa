import { FuseNavigation } from './../../types/fuse-navigation';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { devNavigation, adminNavigation, bizNavigation, userNavigation } from 'app/navigation/navigation';

@Component({
    selector       : 'fuse-navigation',
    templateUrl    : './navigation.component.html',
    styleUrls      : ['./navigation.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuseNavigationComponent implements OnInit
{
    @Input()
    layout = 'vertical';

    @Input()
    navigation: any;
    authUser: any;
    lastNavigation: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     *
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {FuseNavigationService} _fuseNavigationService
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private _auth: AuthTokenSessionService
    )
    {
        // Set the private defaults
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
        // Load the navigation either from the input or from the service
        this.navigation = this.navigation || this._fuseNavigationService.getCurrentNavigation();

        // Subscribe to the current navigation changes
        this._fuseNavigationService.onNavigationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {

                // Load the navigation
                this.navigation = this._fuseNavigationService.getCurrentNavigation();

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to navigation item
        merge(
            this._fuseNavigationService.onNavigationItemAdded,
            this._fuseNavigationService.onNavigationItemUpdated,
            this._fuseNavigationService.onNavigationItemRemoved
        ).pipe(takeUntil(this._unsubscribeAll))
         .subscribe(() => {

             // Mark for check
             this._changeDetectorRef.markForCheck();
         });

        this._auth.authUserOnChanged
         .pipe(takeUntil(this._unsubscribeAll))
         .subscribe((authUser) => {
             this.authUser = authUser;
             if (authUser) {
                 this.setAuthUserNavigation(true);
             } else {
                 this.setAuthUserNavigation(false);
             }
         });
    }

    private updateNavigation(nav: FuseNavigation, add: boolean): void {
        const mainNav = this._fuseNavigationService.getNavigation('main');
        if (mainNav && mainNav.length > 0) {
            const fuseNav = this._fuseNavigationService.getNavigationItem(nav.id, mainNav[0].children);
            if (add) {
                if (fuseNav !== false) {
                    this._fuseNavigationService.updateNavigationItem(nav.id, nav);
                } else {
                    this._fuseNavigationService.addNavigationItem(nav, 'applications');
                }
            } else {
                if (fuseNav) {
                    this._fuseNavigationService.removeNavigationItem(nav.id);
                }
            }
        }

    }


    setAuthUserNavigation(add: boolean): void {
        if (add) {
            if (this._auth.devUser) {
                devNavigation.forEach((nav) => {
                    this.updateNavigation(nav, add);
                });
                this.lastNavigation = devNavigation;
            } else {
                if (this._auth.adminUser) {
                    adminNavigation.forEach((nav) => {
                        this.updateNavigation(nav, add);
                    });
                    this.lastNavigation = adminNavigation;
                } else {
                    if (this._auth.bizUser) {
                        bizNavigation.forEach((nav) => {
                            this.updateNavigation(nav, add);
                        });
                        this.lastNavigation = bizNavigation;
                    } else {
                        userNavigation.forEach((nav) => {
                            this.updateNavigation(nav, add);
                        });
                        this.lastNavigation = userNavigation;
                    }
                }
            }
        } else {
            if (this.lastNavigation) {
                this.lastNavigation.forEach((nav) => {
                    this.updateNavigation(nav, add);
                });
                this.lastNavigation = undefined;
            }
        }
        this._fuseNavigationService.setCurrentNavigation('main');
    }
}
