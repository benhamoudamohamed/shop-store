import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { validateWhitespaces } from 'src/app/shared/validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { ApiService } from 'src/app/shared/api.service';
import { AuthService } from 'src/app/shared/auth.service';
import { UserRole } from 'src/app/shared/models/role.enum';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {

  title: string;
  form: FormGroup;
  user: User;
  id = '';
  firstname = '';
  lastname = '';
  password = '';
  email = '';
  userRole = '';
  userRoles = UserRole;
  private readonly destroy$ = new Subject();

  submitted = false;
  queryError: string;
  loadingSpinner = false;
  itemId: string;

  constructor(private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      firstname : ['', [Validators.required]],
      lastname : ['', [Validators.required]],
      password : ['', [Validators.required, validateWhitespaces]],
      email : ['', [Validators.required, validateWhitespaces]],
      userRole : ['', [Validators.required]],
    });

    this.form.valueChanges.subscribe(() => {
      this.queryError = ''
    });

    this.itemId = this.route.snapshot.params.id;

    if(this.itemId !== undefined) {
      this.title = 'Update User'
      this.apiService.getOneUser(this.itemId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: User) => {
        this.user = res
        this.id = this.user.id;
        this.form.setValue({
          firstname: this.user.firstname,
          lastname: this.user.lastname,
          email: this.user.email,
          password: '',
          userRole: this.user.userRole,
        });
      })
    } else {
      this.title = 'Create User'
      this.form.setValue({
        firstname: '',
        lastname: '',
        password: '',
        email: '',
        userRole: null
      });
    }
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    const data = this.form.value;
    if (this.form.invalid) {
      return;
    }
    this.loadingSpinner = true;

    if(this.itemId !== undefined) {
      this.update(this.itemId, data)
    } else {
      this.create(data)
    }
  }

  create(data: any) {
    this.apiService.register(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe( () => {
        this.loadingSpinner = false;
        this.router.navigateByUrl(`admin/(root:user)`)
        this.submitted = false;
        this.form.reset();
    }, (error) => {
      this.loadingSpinner = false;
      console.log('register ', error)
      if(data.password.length < 8) {
        this.queryError = error.error.message[1]
      }
      else if(error.status === 403) {
        this.queryError = error.error.error
      } else {
        this.queryError = error.error.message[0] || error.error.message
      }
    });
  }

  update(id: string, data: any) {
    this.apiService.updateUser(id, data)
    .pipe(takeUntil(this.destroy$))
      .subscribe((res: User) => {
        this.user.firstname = res.firstname;
        this.user.lastname = res.lastname;
        this.user.email = res.email;
        this.user.password = res.password;
        this.user.userRole = res.userRole;

        this.loadingSpinner = false;
        this.router.navigateByUrl(`admin/(root:user)`)
        this.submitted = false;
        this.form.reset();
      }, (error) => {
        this.loadingSpinner = false;
        console.log(error)
        if(data.password.length < 8) {
          this.queryError = error.error.message[1]
        } else {
          this.queryError = error.error.message[0]
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
