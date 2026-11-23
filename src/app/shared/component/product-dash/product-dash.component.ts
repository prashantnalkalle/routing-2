import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../service/snackbar.service';
import { Iproduct } from '../../module/product';

@Component({
  selector: 'app-product-dash',
  templateUrl: './product-dash.component.html',
  styleUrls: ['./product-dash.component.scss']
})
export class ProductDashComponent implements OnInit {
  productArr:Iproduct[] =[]
  constructor(
    private  _service:ProductService,
    private _router:Router,
    private _routes:ActivatedRoute,
    private _snackbar:SnackbarService
  ) { }

  ngOnInit(): void {

    this._routes.data.subscribe(res=>{
      if(res['products']) {
        this.productArr = res['products']
      }
    })


    this._service.productobser.subscribe(res =>{
      if(res.action === 'Add') {
        this.productArr.unshift(res.product)
      }else if(res.action === 'Update') {
        let index = this.productArr.findIndex(ele => ele.id === res.product.id)

        this.productArr[index] = res.product
      }else if(res.action === 'Remove') {
        let index = this.productArr.findIndex(ele => ele.id === res.product.id)

        this.productArr.splice(index,1)
      }
    })

  }



}
