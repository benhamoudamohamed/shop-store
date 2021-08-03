import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { Product } from './../../shared/models/product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {

  loadingSpinner = false;
  product: Product;
  id: string;
  private readonly destroy$ = new Subject();

  constructor(private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute) {
      this.id = this.route.snapshot.params.id;
    }

  ngOnInit() {
    this.getOneProduct()
  }

  getOneProduct() {
    this.loadingSpinner = true;
    this.apiService.getOneProduct(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: Product) => {
        this.product = res
        this.loadingSpinner = false;
      })
  }

  update(id: string) {
    this.router.navigateByUrl(`admin/(root:product/edit/${id})`)
  }

  delete(id: string) {
    id = this.id
    this.apiService.deleteFile(this.product.fileName).subscribe(() => { }, error => console.log(error));
    this.apiService.deleteProduct(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadingSpinner = false;
        this.router.navigateByUrl(`admin/(root:product)`)
      }, (error) => {
        console.log(error);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
