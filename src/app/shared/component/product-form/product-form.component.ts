import { Component, OnInit } from '@angular/core';
import { Iproduct, IproductData } from '../../module/product';
import { ProductService } from '../../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../service/snackbar.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
 product!:Iproduct
  productId!:string
  isEditmode :boolean = false
  constructor(
    private _service:ProductService,
    private _routes:ActivatedRoute,
    private _router:Router,
    private _snackbar:SnackbarService
  ) { }

  ngOnInit(): void {
    this.createform()
    this._routes.paramMap.subscribe({
      next:res =>{
        if(res.get('id')){
          console.log(res.get('id'))
          this.productId = res.get('id') as string
        }
      }
    })

    this._routes.data.subscribe(res =>{
      if(res['product']) {
        this.product = res['product']
        this.isEditmode = true
        this.productForm.patchValue(this.product)
      }
    })
  }

  productForm!:FormGroup


  createform() {
    this.productForm = new FormGroup({
      title:new FormControl('',[Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      category:new FormControl('',[Validators.required, Validators.maxLength(50)]),
      description : new FormControl('',[Validators.required, Validators.minLength(10), Validators.maxLength(1000)]),
      image:new FormControl('',[Validators.required, Validators.pattern(/^https?:\/\/.+/i)]),
      price:new FormControl(null,[Validators.required, Validators.min(0.01)]),
      rating:new FormGroup({
        count:new FormControl(null,[Validators.required, Validators.min(0), Validators.max(1000000)]),
        rate:new FormControl(null,[Validators.required, Validators.min(0), Validators.max(5)])
      })
    })
  }

  onAddProduct() {
    if(!this.productForm.valid){
      this.productForm.markAllAsTouched();
      return 
    }
    let product:Iproduct = this.productForm.value
    this._service.CreateProduct(product).subscribe({
      next:res =>{
        product.id = res.name 
        this.productForm.reset()

        let productdata :IproductData ={
          action:'Add',
          product:product
        }
        this._service.productData(productdata)
        this._router.navigate(['products'])
        this._snackbar.openSnackbar(`The New Product With Id ${product.id} Is Added Successfully!!`)

      },
      error:err =>{
        // this._snackbar.openSnackbar(err.message)
        this._router.navigate(['products'])

      }
    })
  }

  onUpdateProduct() {
    if(this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return
    }
    let product:Iproduct = {...this.productForm.value,id:this.productId}
    this._service.UpdateProduct(product).subscribe({
      next:res =>{
        this.isEditmode = false
        let productData :IproductData ={
          action:'Update',
          product:product
        }
        this._service.productData(productData)
        this._router.navigate(['products'])
        this._snackbar.openSnackbar(`The Product With Id ${this.productId} Is Updated Successfully!!`)

      },
      error:err =>{
       
        this._router.navigate(['products'])

      }
      
    })
  }

}
