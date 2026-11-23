import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Iproduct, IproductData, Iproductres } from '../module/product';
import { Ires } from '../module/users';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  Base_url:string = environment.Base_url
  Product_url :string = `${this.Base_url}/products.json`

  constructor(
    private _http:HttpClient
  ) { }

 private readonly productObj$:Subject<IproductData> =new Subject()

 productobser:Observable<IproductData> = this.productObj$.asObservable()

  fetchproduct() :Observable<Iproduct[]>{
    return this._http.get<Iproductres>(this.Product_url)
                .pipe(
                  map(res =>{
                    let productArr:Iproduct[] = []

                    for (const key in res) {
                      productArr.unshift({...res[key],id:key})
                    }

                    return productArr
                  })
                )
  }


  fetchproductById(id:string):Observable<Iproduct>{
    let GetUrl = `${this.Base_url}/products/${id}.json`

    return this._http.get<Iproduct>(GetUrl)
  }


  CreateProduct(product:Iproduct):Observable<Ires> {

    return this._http.post<Ires>(this.Product_url,product)
  }

  UpdateProduct(product:Iproduct):Observable<Iproduct> {
    let updateUrl = `${this.Base_url}/products/${product.id}.json`

    return this._http.put<Iproduct>(updateUrl,product)
  }

  RemoveProduct(id:string) {
    let removeUrl =`${this.Base_url}/products/${id}.json`

    return this._http.delete(removeUrl)
  }

  productData(product:IproductData ) {
    this.productObj$.next(product)
  }

}
