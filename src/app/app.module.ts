import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './shared/component/home/home.component';
import { UserDashComponent } from './shared/component/user-dash/user-dash.component';
import { UsersFormComponent } from './shared/component/user-form/user-form.component';
import { UserCardComponent } from './shared/component/user-card/user-card.component';
import { ProductDashComponent } from './shared/component/product-dash/product-dash.component';
import { ProductFormComponent } from './shared/component/product-form/product-form.component';
import { ProductCardComponent } from './shared/component/product-card/product-card.component';
import { FairsComponent } from './shared/component/fairs/fairs.component';
import { GetConfirmComponent } from './shared/component/get-confirm/get-confirm.component';
import { NavBarComponent } from './shared/component/nav-bar/nav-bar.component';
import { PageNotFoundComponent } from './shared/component/page-not-found/page-not-found.component';
import { AuthComponent } from './auth/auth.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { ErrorInterceptor } from './error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserDashComponent,
    UsersFormComponent,
    UserCardComponent,
    ProductDashComponent,
    ProductFormComponent,
    ProductCardComponent,
    FairsComponent,
    GetConfirmComponent,
    NavBarComponent,
    PageNotFoundComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide:HTTP_INTERCEPTORS,
      useClass:AuthInterceptor,
      multi:true
    },
    {
      provide:HTTP_INTERCEPTORS,
      useClass:ErrorInterceptor,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
