import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable()
export class AuthEffects {

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START), // filtering
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(resData => {
          const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);

          // ~dispatch new action <= auto subscribe by @Effect
          return new AuthActions.Login({
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            expirationDate: expirationDate
          });
        }),
        catchError(errorRes => {
          let errorMessage = 'An unknown error occurred!';
          if (!errorRes.error || !errorRes.error.error) {
            return of(new AuthActions.LoginFail(errorMessage));
          }

          if (errorRes.error.error.message.startsWith('TOO_MANY_ATTEMPTS_TRY_LATER')) {
            errorMessage = 'Too many attempts, try later';
          }

          switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'This email exists already';
              break;
            case 'EMAIL_NOT_FOUND':
              errorMessage = 'This email does not exist';
              break;
            case 'INVALID_PASSWORD':
              errorMessage = 'This password is not correct';
              break;

            case 'USER_DISABLED':
              errorMessage = 'Account disabled';
          }

          // need to return of() to wrap it as observable since unlike map, catchError don't wrap it as an observable automatically
          return of(new AuthActions.LoginFail(errorMessage));
        }));
    })
  );

  // normally Effect will dispatch an action, so in this case where we don't need to dispatch an action, we explicly tell Angular this Effect won't dispatch an action
  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN), // upon success login
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) { }
}
