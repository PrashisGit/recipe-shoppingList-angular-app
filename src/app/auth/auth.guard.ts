import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { map, tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authSerivce: AuthService,
              private router: Router){}

  canActivate(route: import("@angular/router").ActivatedRouteSnapshot,
              state: import("@angular/router").RouterStateSnapshot): boolean |
              import("@angular/router").UrlTree |
              import("rxjs").Observable<boolean |
              import("@angular/router").UrlTree> |
              Promise<boolean | import("@angular/router").UrlTree> {

                return this.authSerivce.user
                .pipe(
                  take(1),
                  map(user => {
                    const isAuth =  !!user;
                    if(isAuth) {
                      return true;
                    }
                    return this.router.createUrlTree(['/auth']);
                  }),
                  /*tap(isAuth =>{
                    if(!isAuth){
                      this.router.navigate(['/auth']);
                    }

                  })*/
                );

  }

}
