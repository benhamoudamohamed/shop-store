import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { Product } from 'src/app/shared/models/product';
import * as Cookies from 'js-cookie'
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit, OnDestroy {

  loadingSpinner: boolean = false;
  products: Product[]
  id: string;
  product
  isInList: boolean = false

  productListOnCart: any;
  cartItem: any = 0
  disableButton: boolean = false;
  private readonly destroy$ = new Subject();

  constructor(private apiService: ApiService,
    private toastrService: NbToastrService,
    private route: ActivatedRoute) {
    this.id = this.route.snapshot.params.id;

    this.productListOnCart = []

    if(Cookies.get("productListOnCart") !== undefined && Cookies.get("cartItem") !== undefined) {
      setInterval(() => {
        this.productListOnCart = JSON.parse(Cookies.get("productListOnCart"))
        this.cartItem = JSON.parse(Cookies.get("cartItem"))
      }, 1000)
    }
  }

  ngOnInit() {
    this.getAllFavouritesproducts()
  }

  getAllFavouritesproducts() {
    this.loadingSpinner = true;
    this.apiService.findByFavorite(true)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.products = res
        this.loadingSpinner = false;
      })
  }

  addTocart(id: string, preventDuplicates) {
    this.apiService.getOneProduct(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: Product) => {
        this.product = res
        this.isInList = this.productListOnCart.includes(this.product.id);

        if(this.isInList) {
          this.toastrService.warning('', `Product Already In Cart`, { preventDuplicates });
          return;
        }
        if(!this.isInList && this.product.isAvailable === true) {
          this.productListOnCart.push(this.product.id)
          Cookies.set("productListOnCart", JSON.stringify(this.productListOnCart), {expires: (30), secure: true})
          Cookies.set("cartItem", JSON.stringify(this.productListOnCart.length), {expires: (30), secure: true})
          this.toastrService.success('', `Product Add to Cart successfully`, { preventDuplicates });
        }
      })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
