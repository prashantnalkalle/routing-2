import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Iuser } from '../../module/users';

@Component({
  selector: 'app-user-dash',
  templateUrl: './user-dash.component.html',
  styleUrls: ['./user-dash.component.scss']
})
export class UserDashComponent implements OnInit {
  userArr:Iuser[] = []
  constructor(
    private _service:UserService,
    private _router:Router,
    private _routes:ActivatedRoute
  ) { }

  ngOnInit(): void {
   this._routes.data.subscribe({
    next:res =>{
      if(res['users']){
        this.userArr = res['users']
      }
    }
   })
   

   this._service.userObser$.subscribe(res =>{
    if(res.action === 'Add') {
      this.userArr.unshift(res.user)
    }else if(res.action === 'Update') {
      let index = this.userArr.findIndex(ele => ele.id === res.user.id)

      this.userArr[index] = res.user
    }else if(res.action === 'Remove') {
      let index = this.userArr.findIndex(ele => ele.id === res.user.id)

      this.userArr.splice(index,1)
    }
   })
  }


  



}
