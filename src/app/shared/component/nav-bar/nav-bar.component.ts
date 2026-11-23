import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(
    private _service:AuthService,
    private _router:Router
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this._service.logout()
    this._router.navigate([''])
  }

}
