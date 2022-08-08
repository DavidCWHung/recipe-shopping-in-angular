import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { map, Subscription } from "rxjs";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component ({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    userSub: Subscription;

    constructor(private store: Store<fromApp.AppState>) {}

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
        // this.dataStorageService.storeRecipes();
        this.store.dispatch(new RecipeActions.StoreRecipes());
    }

    onLogout() {
      // this.authService.logout();
      this.store.dispatch(new AuthActions.Logout());
    }

    onFetchData() {
        // this.dataStorageService.fetchRecipes().subscribe();
        this.store.dispatch(new RecipeActions.FetchRecipes());
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}
