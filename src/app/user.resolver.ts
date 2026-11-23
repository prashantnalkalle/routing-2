import { inject, Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { BaseResolver } from './base.resolver';
import { Iuser } from './shared/module/users';
import { UserService } from './shared/service/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolver extends BaseResolver<Iuser|Iuser[]> {

  private _service=inject(UserService)
  override resolveData(rotue: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Iuser | Iuser[]> {

    let userId = rotue.paramMap.get('id')

    if(userId){
      return this._service.fetchUserById(userId)
    }

    return this._service.fetchUsers()
  }
  
}
