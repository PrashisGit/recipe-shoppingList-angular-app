import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment} from '../../../environments/environment';

import * as AuthActions from './auth.actions';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START)
  );

  @Effect() // effects will yield observable
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => { // switchmap use to yield new observable
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
        + environment.firebaseAPIKey,
        {
          // tslint:disable-next-line: object-literal-shorthand
          email: authData.payload.email,
          // tslint:disable-next-line: object-literal-shorthand
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        // observable die in error block, usw (Of) to yeild new observable
        map(resData => {
          const expirationDate = new Date(new Date().getTime() + (+resData.expiresIn * 1000));
          return new AuthActions.AuthenticateSuccess({
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            // tslint:disable-next-line: object-literal-shorthand
            expirationDate: expirationDate
          });
        }),
        catchError(errorResp => {
          let errorMessage = 'An unnown error occurred!';
          if (!errorResp.error || !errorResp.error.error) {
            return of(new AuthActions.AuthenticateFail(errorMessage));
          }
          switch (errorResp.error.error.message) {
            case 'EMAIL_NOT_FOUND':
            errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
            break;
          case 'INVALID_PASSWORD':
            errorMessage = 'The password is invalid or the user does not have a password.';
            break;
          case 'USER_DISABLED':
            errorMessage = 'The user account has been disabled by an administrator.';
            break;
          case 'EMAIL_EXISTS':
            errorMessage = 'The email address is already in use by another account.';
            break;
          case 'OPERATION_NOT_ALLOWED':
            errorMessage = 'Password sign-in is disabled for this project.';
            break;
          case 'EMAIL_EXISTS':
            errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
            break;
          }
          return of(new AuthActions.AuthenticateFail(errorMessage));
        })// catchError block
      );
    })
  );

  // to stop effect from returning obervable user dispatch false
@Effect({dispatch: false})
authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

constructor(private actions$: Actions,
            private http: HttpClient,
            private router: Router) {}
}
