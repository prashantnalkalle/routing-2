import { inject, Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { BaseResolver } from './base.resolver';
import { Iproduct } from './shared/module/product';
import { ProductService } from './shared/service/product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver extends BaseResolver<Iproduct | Iproduct[]>{

    private _service=inject(ProductService)
    override resolveData(rotue: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Iproduct | Iproduct[]> {
      let productId = rotue.paramMap.get('id')

      if(productId) {
        return this._service.fetchproductById(productId)
      }

      return this._service.fetchproduct()
    }
}
