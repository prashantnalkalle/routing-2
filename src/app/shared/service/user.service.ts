import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Iproduct } from '../module/product';
import { Ires, Iuser, IuserData, IuserRes } from '../module/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  Base_url:string = environment.Base_url
  user_url:string = `${this.Base_url}/users.json`

  constructor(
    private _http:HttpClient
  ) { }

   private readonly userObj$:Subject<IuserData> = new Subject()

   userObser$:Observable<IuserData> = this.userObj$.asObservable()

  fetchUsers():Observable<Iuser[]> {

    return this._http.get<IuserRes>(this.user_url)
                .pipe(
                  map(res =>{
                    let usersArr:Iuser[]=[]

                    for (const key in res) {
                      
                      usersArr.unshift({...res[key],id:key})
                    }
                    return usersArr
                  })
                )
  }

  fetchUserById(id:string):Observable<Iuser>{
    let singluser=`${this.Base_url}/users/${id}.json`

    return this._http.get<Iuser>(singluser)

  }

  userData(user:IuserData) {
    this.userObj$.next(user)
  }


  CreateUser(user:Iuser):Observable<Ires> {

    return this._http.post<Ires>(this.user_url,user)
  }


  UpdateUser(user:Iuser):Observable<Iuser>{
    let UpdateUrl = `${this.Base_url}/users/${user.id}.json`

    return this._http.put<Iuser>(UpdateUrl,user)
  }


  RemoveUser(id:string) {
    let removeURl = `${this.Base_url}/users/${id}.json`

    return this._http.delete(removeURl)
  }

}
