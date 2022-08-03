import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { exhaustMap, map, Observable, take } from "rxjs";
import { AuthService } from "./auth.service";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
    constructor(private authService: AuthService,
                private store: Store<fromApp.AppState>) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.store.select('auth').pipe(
            // get the user observable, then return a new observable
            take(1),
            // interested in the user only and thus get the user property from AuthState instead of the whole AuthState object itself
            map(authState => {
              return authState.user;
            }),
            // for firebase realtime database API, add the token as query param (read the firebase doc) - can set it mannually or via arguments; other API could be added as headers
            exhaustMap(user => {
                // only for outgoing request that's for storing and fetching data (excluding signup & login); can also limit to specific URL
                if (!user) {
                    return next.handle(req);
                }

                // only add the token when there is an user
                const modifiedReq = req.clone({
                    params: new HttpParams().set('auth', user.token)
                });

                return next.handle(modifiedReq);
            })
        );
    }
}
