import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserRoleGuard implements CanActivate {

  private _service=inject(AuthService)
  private _router=inject(Router)
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean | UrlTree {
      let userRole :string = this._service.getuserRole() as string
    
      let roles:string[] = route.data['roles']

      if(roles.includes(userRole)){
        return true
      }
    
    
      return this._router.createUrlTree(['']);
  }
  
}
