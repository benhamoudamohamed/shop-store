import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { Purchase } from 'src/app/shared/models/purchase';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit, OnDestroy {

  loadingSpinner = false;
  columnsItems = ['id', 'clientName', 'grandTotal', 'date', 'view'];
  tableDataSource: Array<Purchase>;
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
    this.apiService.getAllPurchases(this.currentPage, this.size)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.tableDataSource = res.items
        this.totalItems = res.meta.totalItems
        this.loadingSpinner = false;
      })
  }

  getPage(page: number) {
    this.apiService.getAllPurchases(page, this.size)
    .pipe(takeUntil(this.destroy$))
    .subscribe((res: any) => {
      this.tableDataSource = res.items
      this.totalItems = res.meta.totalItems
    })
  }

  view(id: string) {
    this.router.navigateByUrl(`admin/(root:purchase/detail/${id})`)
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
