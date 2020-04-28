import { Component, OnInit, OnDestroy} from '@angular/core';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { DataStorageService } from '../shared/data-storage.service';
import * as fromApp from '../store/app.reducer';
import * as authActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipe.actions';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  userSub: Subscription;
  constructor(private dataStorageService: DataStorageService,
              private store: Store<fromApp.AppState>) {}


  ngOnInit() {
    this.userSub = this.store.select('auth')
    .pipe(
      map(authstate => authstate.user)
    )
   .subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }
  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
   this.store.dispatch(new RecipesActions.FetchRecipes());

  }
  onLogout() {
    // this.authService.logout();
    this.store.dispatch(new authActions.Logout());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
