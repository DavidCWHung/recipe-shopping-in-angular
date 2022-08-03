import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, Observable, take } from "rxjs";
import { AuthService } from "./auth.service";
import * as fromApp from '../store/app.reducer';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,
                private router: Router,
                private store: Store<fromApp.AppState>) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean> {
        return this.store.select('auth').pipe(
            take(1), //prevent ongoing user subscription which could cause unwanted behavior
            map(authState => {
              return authState.user;
            }),
            map(user => {
                const isAuth = !!user;

                if (isAuth) {
                    return true;
                }

                return this.router.createUrlTree(['/auth']);
            })
        );
    }
}
