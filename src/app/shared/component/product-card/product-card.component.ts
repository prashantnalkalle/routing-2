import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../service/snackbar.service';
import { Iproduct, IproductData } from '../../module/product';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GetConfirmComponent } from '../get-confirm/get-confirm.component';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  product!:Iproduct |null
  productId!:string
  constructor(
    private _service:ProductService,
    private _router:Router,
    private  _routes:ActivatedRoute,
    private _snackbar:SnackbarService,
    private  _mat_dialog:MatDialog
  ) { }

  ngOnInit(): void {
    this._routes.paramMap.subscribe({
      next:res =>{
       this.productId =res.get('id') as string
      }
    })

    this._routes.data.subscribe(res =>{
      if(res['product']){
        this.product = null
        this.product = res['product']
        this.product!.id = this.productId as string
      }
    })
  }

  navigatetoForm() {
    this._router.navigate(['edit'],{
      relativeTo:this._routes
    })
  }

  onRemove() {
    let config = new MatDialogConfig
    config.width = "600px",
    config.disableClose = true
    config.data =`Are you sure you want to remove product with id ${this.productId}?`

    let matdialogref = this._mat_dialog.open(GetConfirmComponent,config)

    matdialogref.afterClosed()
                .pipe(
                  filter(res => Boolean(res) || res),
                  switchMap(() => this._service.RemoveProduct(this.productId))
                )
                .subscribe(res =>{
                  this._snackbar.openSnackbar(`The product with id ${this.productId} is removed Successfully!!!`)
                  let Obj :IproductData ={
                    action:'Remove',
                    product:this.product as Iproduct
                  }

                  this._service.productData(Obj)
                  this._router.navigate(['products'])

                })
  }


}
