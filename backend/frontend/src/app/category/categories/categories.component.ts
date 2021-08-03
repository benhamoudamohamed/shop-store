import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { Category } from './../../shared/models/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  loadingSpinner = false;
  columnsItems = ['id', 'name', 'image', 'image_low', 'view'];
  tableDataSource: Array<Category>;
  itemsPagination = [];
  searchedKeyword: string;
  currentPage: number = 1;
  size: number = 10;
  totalItems: number;
  private readonly destroy$ = new Subject();

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.loadAll()
  }

  loadAll() {
    this.loadingSpinner = true;
    this.apiService.getAllCategoriesByPage(this.currentPage, this.size)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.tableDataSource = res.items
        this.totalItems = res.meta.totalItems
        this.loadingSpinner = false;
      })
  }

  getPage(page: number) {
    this.apiService.getAllCategoriesByPage(page, this.size)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.tableDataSource = res.items
        this.totalItems = res.meta.totalItems
      })
  }

  create() {
    this.router.navigateByUrl(`admin/(root:category/create)`)
  }

  view(id: string) {
    this.router.navigateByUrl(`admin/(root:category/detail/${id})`)
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
