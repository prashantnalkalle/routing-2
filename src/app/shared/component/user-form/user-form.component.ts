import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../service/snackbar.service';

import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Iuser, IuserData } from '../../module/users';

@Component({
  selector: 'app-users-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UsersFormComponent implements OnInit {
  UserObj!:Iuser
  isEditMode :boolean =false
  constructor(
    private _service:UserService,
    private _routes:ActivatedRoute,
    private _router:Router,
    private _snackbar:SnackbarService
  ) { }

  ngOnInit(): void {
    this.CreateUserform()
    this.enablecheckbox()
    this.PatchValue()
    this._routes.data.subscribe(res =>{
      if(res['user']){
        this.UserObj = res['user']
        this.isEditMode =true
        this.UserForm.patchValue(this.UserObj)
        this.skillsArray.clear()

        this.UserObj.skills.forEach(ele =>{
          this.skillsArray.push(new FormControl(ele,[Validators.required]))
        })
      }
    })
  }

  enablecheckbox() {
    this.f['currentAddress'].valueChanges.subscribe(
      res=>{
        if(this.f['currentAddress'].valid) {
          this.f['checkbox'].enable()
        }else{
          this.f['checkbox'].disable()
          this.f['checkbox'].reset()
        }
      }
    )
  }

  PatchValue() {
    this.f['checkbox'].valueChanges.subscribe(
      res =>{
        if(res) {
          let currentadd = this.UserForm.get('currentAddress')?.value
          this.f['permanentAddress'].patchValue(currentadd)
          this.f['permanentAddress'].disable()
        }else{
          this.f['permanentAddress'].reset()
          this.f['permanentAddress'].enable()
        }
      }
    )
  }

  UserForm !:FormGroup

  CreateUserform() {
    this.UserForm = new FormGroup({
      name:new FormControl('',[Validators.required, Validators.minLength(2), Validators.maxLength(80)]),
      email: new FormControl('',[Validators.required, Validators.email, Validators.maxLength(254)]),
      description:new FormControl('',[Validators.required, Validators.minLength(10), Validators.maxLength(1000)]),
      imageUrl:new FormControl('',[Validators.required, Validators.pattern(/^https?:\/\/.+/i)]),
      role:new FormControl(null,[Validators.required]),
      age:new FormControl(null,[Validators.required, Validators.min(24), Validators.max(60)]),
      experience:new FormControl(null,[Validators.required, Validators.min(0), Validators.max(60)]),
      skills:new FormArray([new FormControl('',[Validators.required, Validators.pattern(/.*\S.*/), Validators.maxLength(50)])]),
      currentAddress:new FormGroup({
        country:new FormControl('',[Validators.required, Validators.maxLength(80)]),
        state:new FormControl('',[Validators.required, Validators.maxLength(80)]),
        city:new FormControl('',[Validators.required, Validators.maxLength(80)]),
        zipcode:new FormControl(null,[Validators.required, Validators.min(1), Validators.max(999999999)])
      }),
       permanentAddress:new FormGroup({
        country:new FormControl('',[Validators.required, Validators.maxLength(80)]),
        state:new FormControl('',[Validators.required, Validators.maxLength(80)]),
        city:new FormControl('',[Validators.required, Validators.maxLength(80)]),
        zipcode:new FormControl(null,[Validators.required, Validators.min(1), Validators.max(999999999)])
      }),
      checkbox:new FormControl({value:false,disabled:true})
    })
  }

  OnUserFormSubmit() {
    if(this.UserForm.invalid) {
      this.UserForm.markAllAsTouched();
      return 
    }

    let  user:Iuser = this.UserForm.getRawValue()

    this._service.CreateUser(user).subscribe({
      next:res =>{
        user.id = res.name
        this.UserForm.reset()
       let userObj:IuserData ={
        action:"Add",
        user:user
       }
       this._service.userData(userObj)
        
        this._snackbar.openSnackbar(`The New User With Id ${res.name} Is Added Successfully!!`)
        this._router.navigate(['users'])

      },
      error:err =>{
        // this._snackbar.openSnackbar(err.message)
      }
    })

  }

  OnUpdateUser() {
    if(this.UserForm.invalid) {
      this.UserForm.markAllAsTouched();
      return
    }

    let UpdateUser:Iuser ={...this.UserForm.getRawValue(),id:this.UserObj.id}

    this._service.UpdateUser(UpdateUser).subscribe({
      next:res =>{
        this.UserForm.reset()
        this.isEditMode = false

        let userObj:IuserData ={
          action:"Update",
          user:UpdateUser
        }
        this._service.userData(userObj)
        this._snackbar.openSnackbar(`The User With Id ${this.UserObj.id} Is Updated Successfully!!`)
        this._router.navigate(['users'])

      },
      error:err =>{
        // this._snackbar.openSnackbar(err.message)
        
      }
    })
  }

  Addskill() {
    this.skillsArray.push(new FormControl('',[Validators.required, Validators.pattern(/.*\S.*/), Validators.maxLength(50)]))
  }
  RemoveSkill(index:number) {
    if(index >0 && index < this.skillsArray.length) {
      this.skillsArray.removeAt(index)
    }
  }
 
  get f() {
    return this.UserForm.controls
  }

  get skillsArray(): FormArray {
    return this.UserForm.get('skills') as FormArray;
  }

}
