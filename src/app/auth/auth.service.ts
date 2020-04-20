import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AuthService {

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  constructor(private http: HttpClient,
              private router: Router) {}

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBdt_86aeB0nqYCQxuwFtcUR3RtQ0ncqM4',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    .pipe(
      catchError(this.errorHandler),
      tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      })
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBdt_86aeB0nqYCQxuwFtcUR3RtQ0ncqM4',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    .pipe(
      catchError(this.errorHandler),
      tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      })
    );
  }

  autoLogin(){
    console.log('auto login called');
    const userData: {
      email: string,
      userId: string,
      _token: string,
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if(!userData) {
      return;
    }

    const loadedUser = new User(userData.email,
                                userData.userId,
                                userData._token,
                                new Date(userData._tokenExpirationDate)
                              );


    if(loadedUser.token){
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }

  }



  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    console.log("expirationDuration "+expirationDuration);
    this.tokenExpirationTimer =  setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
    const user = new User(
          email,
          userId,
          token,
          expirationDate
        );
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private errorHandler(errorResp: HttpErrorResponse) {
    let errorMessage = null;
    if (!errorResp.error || !errorResp.error.error) {
          return throwError(errorMessage);
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
          default:
            errorMessage = 'An unknown error occurred';
            break;
        }
    return throwError(errorMessage);
  }
}