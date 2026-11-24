import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Inav } from '../../module/nav';
import { navbar } from '../../const/navbar';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  navItems:Inav[] =[]
  userRole!:string
  constructor(
    private _service:AuthService,
    private _router:Router
  ) { }
  
  ngOnInit(): void {
    this.navItems = navbar
    
    this.userRole = this._service.getuserRole()
    console.log(this.userRole)
  }
  
  logout() {
    this._service.logout()
    this._router.navigate([''])
  }

}
