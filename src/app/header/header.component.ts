import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { map, Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Component ({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    userSub: Subscription;

    constructor(private dataStorageService: DataStorageService,
                private authService: AuthService,
                private store: Store<fromApp.AppState>) {}

    ngOnInit(): void {
        // monitor user status
        this.userSub = this.store.select('auth')
          .pipe(map(authState => authState.user)) // quick inline statement since only one expression where we instantly return, same as return authState.user
          .subscribe(user => {
            this.isAuthenticated = !!user;
            console.log(!user);
            console.log(!!user);
            // this.isAuthenticated = !user ? false : true;
        });
    }

    onSaveData() {
        this.dataStorageService.storeRecipes();
    }

    onLogout() {
      // this.authService.logout();
      this.store.dispatch(new AuthActions.Logout());
    }

    onFetchData() {
        this.dataStorageService.fetchRecipes().subscribe();
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}
