import { Component, inject, OnInit } from '@angular/core';
import { SpinnerService } from './shared/service/spinner.service';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'routing-2';
  private service=inject(SpinnerService)
  loders$:Observable<boolean> = this.service.lodingobs$

   isAuthPage = true;

  constructor(private router:Router) {
    this.isAuthPage = this.router.url === '/';
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.isAuthPage = event.urlAfterRedirects === '/';
    });
  }


  ngOnInit(): void {
     
  }

 



}
