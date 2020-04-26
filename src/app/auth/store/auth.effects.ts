import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment} from '../../../environments/environment';

import * as AuthActions from './auth.actions';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    // tslint:disable-next-line: object-literal-shorthand
    email: email,
    // tslint:disable-next-line: object-literal-shorthand
    userId: userId,
    // tslint:disable-next-line: object-literal-shorthand
    token: token,
    // tslint:disable-next-line: object-literal-shorthand
    expirationDate: expirationDate
  });
};

const handleError = (errorResp) => {
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
};

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupActions: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
        {
          // tslint:disable-next-line: object-literal-shorthand
          email: signupActions.payload.email,
          // tslint:disable-next-line: object-literal-shorthand
          password: signupActions.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(resData => {
          return handleAuthentication(
              +resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken
            );
        }),
        catchError(errorResp => {
          return handleError(errorResp);
        })
      );
    })// switch map block
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
          return handleAuthentication(
            +resData.expiresIn,
            resData.email,
            resData.localId,
            resData.idToken
          );
        }),
        catchError(errorResp => {
          return handleError(errorResp);
        })// catchError block
      );
    })
  );

  // to stop effect from returning obervable user dispatch false
@Effect({dispatch: false})
authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
      email: string,
      userId: string,
      _token: string,
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

      if (!userData) {
      return {type: 'DUMMY'};
    }
      const loadedUser = new User(userData.email,
                                userData.userId,
                                userData._token,
                                new Date(userData._tokenExpirationDate)
                              );


      if (loadedUser.token) {
    // this.user.next(loadedUser);
     return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.userId,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate)
        });
     /*const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
     this.autoLogout(expirationDuration);*/
    }
    })
  );

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.router.navigate(['/auth']);
      localStorage.removeItem('userData');
    })
  );

constructor(private actions$: Actions,
            private http: HttpClient,
            private router: Router) {}
}
