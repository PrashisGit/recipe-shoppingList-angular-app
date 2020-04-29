import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { isPlatformBrowser} from '@angular/common';

import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';
import { LoggingService } from './logging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>,
              @Inject(PLATFORM_ID) private platformId,
              private logginService: LoggingService) {}

  ngOnInit() {
    // browser api will not work on Angular Universal, so in this project local storage will not work
    // we used local storage in autologin
    // to fix this we will check the platform, it will dispatch on browser and not in server

    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch( new AuthActions.AutoLogin());
    }

    this.logginService.printLog('Hello from App component ngOnInit');
  }
}
