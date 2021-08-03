import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { Category } from 'src/app/shared/models/category';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {

  loadingSpinner = false;
  categories: Category[]
  private readonly destroy$ = new Subject();

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.loadAllCategories()
  }

  loadAllCategories() {
    this.loadingSpinner = true;

    this.apiService.getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.categories = res
        this.loadingSpinner = false;
      }, (error) => {
        console.log('cant get categories ', error);
      });
  }

  onClick(id: string) {
    this.router.navigateByUrl(`store/products/${id})`)
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
