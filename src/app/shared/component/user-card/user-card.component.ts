import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Iuser, IuserData } from '../../module/users';
import { MatDialog, MatDialogClose, MatDialogConfig } from '@angular/material/dialog';
import { GetConfirmComponent } from '../get-confirm/get-confirm.component';
import { filter, switchMap } from 'rxjs';
import { SnackbarService } from '../../service/snackbar.service';
import { IproductData } from '../../module/product';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  userId!:string
  userObj!:Iuser
  defaultImage:string = `https://img.magnific.com/free-vector/man-profile-account-picture_24908-81754.jpg?semt=ais_hybrid&w=740&q=80`
  constructor(
    private _servie:UserService,
    private _router:Router,
    private _routes:ActivatedRoute,
    private _mat_dialog:MatDialog,
    private _snackbar:SnackbarService
  ) { }

  ngOnInit(): void {

    this._routes.paramMap.subscribe({
      next:res =>{
       this.userId =res.get('id') as string
      }
    })

    this._routes.data.subscribe(res =>{
      if(res['user']) {
        this.userObj = res['user']
        this.userObj.id = this.userId 
      }
    })
  }

  navigateToform() {
    this._router.navigate(['edit'],{
      relativeTo:this._routes
    })
  }

  onRemove() {
    let config = new MatDialogConfig
    config.width= "600px",
    config.disableClose = true
    config.data = `Are You sure you want to remove user with Id ${this.userId}?`

    let matdialogref = this._mat_dialog.open(GetConfirmComponent,config)

    matdialogref.afterClosed()
                  .pipe(
                    filter(res => Boolean(res) || res),
                    switchMap(() => this._servie.RemoveUser(this.userId))
                  )
                  .subscribe(res =>{
                    this._snackbar.openSnackbar(`The User with Id ${this.userId} is removed successfully!!`)
                    let Obj:IuserData ={
                      action:'Remove',
                      user:this.userObj
                    }

                    this._servie.userData(Obj)
                    this._router.navigate(['users'])
                  })

  }




}
