import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/shared/api.service';
import { Coupon } from './../../shared/models/coupon';

@Component({
  selector: 'app-coupon-edit',
  templateUrl: './coupon-edit.component.html',
  styleUrls: ['./coupon-edit.component.scss']
})
export class CouponEditComponent implements OnInit, OnDestroy  {

  title: string;
  form: FormGroup;
  id = '';
  code: string;
  discount: number;
  userLimit: number;
  expired: boolean;

  submitted = false;
  queryError:string;
  loadingSpinner = false;
  itemId: string;
  private readonly destroy$ = new Subject();

  constructor(private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      code : ['', [Validators.required]],
      discount : ['', [Validators.required]],
      userLimit : ['', [Validators.required]],
      expired : [''],
    });

    this.form.valueChanges.subscribe(() => {
      this.queryError = ''
    });

    this.itemId = this.route.snapshot.params.id;

    if(this.itemId !== undefined) {
      this.title = 'Update Coupon'
      this.apiService.getOneCoupon(this.itemId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: Coupon) => {
          this.id = res.id;
          this.form.setValue({
            code: res.code,
            discount: res.discount,
            userLimit: res.userLimit,
            expired: res.expired,
          });
      })
    } else {
      this.title = 'Create Coupon'
      this.form.setValue({
        code: this.generateRandomCode(6),
        discount: 0,
        userLimit: 0,
        expired: false,
      });
    }
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if(this.itemId !== undefined) {
      this.update(this.itemId)
    } else {
      this.create()
    }
  }

  create() {
    this.submitted = true;
    const data = this.form.value;
    if (this.form.invalid) {
      return;
    }
    this.loadingSpinner = true;

    this.apiService.createCoupon(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadingSpinner = false
        this.router.navigateByUrl(`admin/(root:coupon)`)
        this.submitted = false;
        this.form.reset();
      }, (error: any) => {
        console.log(error)
        this.loadingSpinner = false
        if(error.error.code === '23505') {
          this.queryError = 'Duplicate code value'
        } else {
          this.queryError = error.error.message
        }
      }
    );
  }

  update(id: string) {
    this.submitted = true;
    const data = this.form.value;
    if (this.form.invalid) {
      return;
    }
    this.loadingSpinner = true;

    this.apiService.updateCoupon(id, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadingSpinner = false
        this.router.navigateByUrl(`admin/(root:coupon)`)
        this.submitted = false;
        this.form.reset();
      }, (error: any) => {
        console.log(error)
        this.loadingSpinner = false
        this.queryError = error.error.message
      }
    );
  }

  isExpiredEvent(expired: boolean) {
    this.expired = expired;
  }

  generateRandomCode(length: number) {
    const result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
