import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './shared/component/home/home.component';
import { UserDashComponent } from './shared/component/user-dash/user-dash.component';
import {  UsersFormComponent } from './shared/component/user-form/user-form.component';
import { UserCardComponent } from './shared/component/user-card/user-card.component';
import { ProductDashComponent } from './shared/component/product-dash/product-dash.component';
import { ProductFormComponent } from './shared/component/product-form/product-form.component';
import { ProductCardComponent } from './shared/component/product-card/product-card.component';
import { FairsComponent } from './shared/component/fairs/fairs.component';
import { PageNotFoundComponent } from './shared/component/page-not-found/page-not-found.component';
import { ProductResolver } from './product.resolver';
import { UserResolver } from './user.resolver';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { UserRoleGuard } from './shared/guard/user-role.guard';

const routes: Routes = [
  {
    path:'',
    component :AuthComponent
  },
  {
    path:'home',
    canActivate:[AuthGuard,UserRoleGuard],
    component:HomeComponent,
    data:{
      roles:['admin','superAdmin','buyer']
    }
  },
  {
    path:'users',
    component:UserDashComponent,
    canActivate:[AuthGuard,UserRoleGuard],
    data:{
      roles:['admin','superAdmin']
    },
    children:[
      {
        path:'add',
        component:UsersFormComponent
      },
      {
        path:':id',
        component:UserCardComponent,
        resolve:{
          user:UserResolver
        }
      },
      {
        path:':id/edit',
        component:UsersFormComponent,
        resolve:{
          user:UserResolver
        }
      }
    ],
    resolve:{
      users:UserResolver
    }
  },
  {
    path:'products',
    component:ProductDashComponent,
    canActivate:[AuthGuard,UserRoleGuard],
     data:{
      roles:['admin','superAdmin','buyer']
    },
    children:[
      {
        path:'add',
        component:ProductFormComponent
      },
      {
        path:':id',
        component:ProductCardComponent,
        resolve:{
          product:ProductResolver
        }
      },
      {
        path:':id/edit',
        component:ProductFormComponent,
        resolve:{
          product:ProductResolver
        }
      }
    ],
    resolve:{
      products:ProductResolver
    }
  },
  {
    path:'fairs',
    canActivate:[AuthGuard,UserRoleGuard],
    component:FairsComponent,
     data:{
      roles:['superAdmin']
    }
  },
  {
    path:'**',
    component:PageNotFoundComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
