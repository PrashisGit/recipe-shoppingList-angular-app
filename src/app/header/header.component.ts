import { Component, OnInit, OnDestroy} from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as authActions from '../auth/store/auth.actions';
import { map } from 'rxjs/operators';

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
    this.dataStorageService.fetchRecipes().subscribe();
  }
  onLogout() {
    // this.authService.logout();
    this.store.dispatch(new authActions.Logout());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
