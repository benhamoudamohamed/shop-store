import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/shared/api.service';
import { User } from 'src/app/shared/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  loadingSpinner = false;
  columnsItems = ['id', 'name', 'userRole', 'view'];
  tableDataSource: Array<User>;
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
    this.apiService.getAllUsers(this.currentPage, this.size)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.tableDataSource = res.items
        this.totalItems = res.meta.totalItems
        this.loadingSpinner = false;
      })
  }

  getPage(page: number) {
    this.apiService.getAllUsers(page, this.size)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.tableDataSource = res.items
        this.totalItems = res.meta.totalItems
      })
  }

  create() {
    this.router.navigateByUrl(`admin/(root:user/create)`)
  }

  view(id: string) {
    this.router.navigateByUrl(`admin/(root:user/detail/${id})`)
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
