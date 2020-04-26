import { Component, ComponentFactoryResolver, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NgForm, Form } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/paceholder/placeholder.directive';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

  private closeSub: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver,
              private store: Store<fromApp.AppState>) {}


  ngOnInit() {
    this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;

  }


  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;

    // let authObser: Observable<AuthResponseData>;
    if (this.isLoginMode) {
      // authObser =  this.authService.login(email, password);
      this.store.dispatch(new AuthActions.LoginStart({
        // tslint:disable-next-line: object-literal-shorthand
        email: email,
        // tslint:disable-next-line: object-literal-shorthand
        password: password
      }));
    } else {
      // authObser =  this.authService.signUp(email, password);
      this.store.dispatch(new AuthActions.SignupStart({
        // tslint:disable-next-line: object-literal-shorthand
        email: email,
         // tslint:disable-next-line: object-literal-shorthand
        password: password
      }));
    }


   /* authObser.subscribe(
      reponse => {
        console.log(reponse);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      }
    ); */

    form.reset();
  }


  onCloseAlertBox() {
    this.error = null;
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

  // Dynamicaly creating component
  private showErrorAlert(message: string) {
   // const alertCmp = new AlertComponent(); // cant do this not angular way
   // Creatting Component Factory
    const AlertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainer = this.alertHost.viewContainertRef;
    hostViewContainer.clear();
    const componentRef = hostViewContainer.createComponent(AlertCmpFactory);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainer.clear();
    });


  }

}
