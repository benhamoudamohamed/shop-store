import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  loadingSpinner = false;
  user: User;
  id: string;
  private readonly destroy$ = new Subject();

  constructor(private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute) {
      this.id = this.route.snapshot.params.id;
    }

  ngOnInit() {
    this.getUser()
  }

  getUser() {
    this.loadingSpinner = true;
    this.apiService.getOneUser(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: User) => {
        this.user = res
        this.loadingSpinner = false;
      })
  }

  update(id: string) {
    this.router.navigateByUrl(`admin/(root:user/edit/${id})`)
  }

  delete(id: string) {
    id = this.id
    this.apiService.deleteUser(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadingSpinner = false;
        this.router.navigateByUrl(`admin/(root:user)`)
      }, (error) => {
        console.log(error);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
