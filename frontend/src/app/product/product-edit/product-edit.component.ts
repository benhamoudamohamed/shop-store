import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/shared/api.service';
import { Product } from './../../shared/models/product';
import { environment } from 'src/environments/environment';
import { Category } from 'src/app/shared/models/category';
interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit, OnDestroy  {

  private api: string = environment.api_server;
  private readonly destroy$ = new Subject();

  title: string;
  form: FormGroup;
  id = '';
  name = '';
  productCode = '';
  price = '';
  isFavorite: Boolean;
  isAvailable: Boolean;
  category = '';
  file: any;
  fileSize: any;
  sizeLimit: any;
  fileName: string;
  fileURL: string;
  file_low: any;
  fileName_low: string;
  fileURL_low: string;
  categories: Category[];

  submitted = false;
  queryError:string;
  loadingSpinner = false;
  itemId: string;

  isTypesupported: string

  constructor(private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name : ['', [Validators.required]],
      productCode : ['', [Validators.required]],
      price : ['', [Validators.required]],
      isFavorite : ['' , [Validators.required]],
      isAvailable : ['' , [Validators.required]],
      file : [''],
      fileName : ['', [Validators.required]],
      fileURL : ['', [Validators.required]],
      file_low : [''],
      fileName_low : ['', [Validators.required]],
      fileURL_low : ['', [Validators.required]],
      category : ['', [Validators.required]],
    });

    this.loadAllCategory();

    this.form.valueChanges.subscribe(() => {
      this.queryError = ''
    });

    this.itemId = this.route.snapshot.params.id;

    if(this.itemId !== undefined) {
      this.title = 'Update Product'
      this.apiService.getOneProduct(this.itemId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: Product) => {
          this.id = res.id;
          this.form.setValue({
            name: res.name,
            productCode: res.productCode,
            price: res.price,
            isFavorite: res.isFavorite,
            isAvailable: res.isAvailable,
            file: '', // It could open security risks otherwise
            fileName: res.fileName,
            fileURL: res.fileURL,
            file_low : '',
            fileName_low: res.fileName_low,
            fileURL_low: res.fileURL_low,
            category: res.category.id,
          });
      })
    } else {
      this.title = 'Create Product'
      this.form.setValue({
        name: '',
        productCode: this.generateRandomCode(6),
        price: '',
        isFavorite: false,
        isAvailable: false,
        file: '',
        fileName: '',
        fileURL: '',
        file_low : '',
        fileName_low: '',
        fileURL_low: '',
        category: null,
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

    if(this.fileSize > 1000) {
      this.loadingSpinner = false;
      this.sizeLimit = `File size: ${this.fileSize} KB, size limit is under 1 MB`
    } else if(this.fileSize <= 1000) {
      this.sizeLimit = `File size: ${this.fileSize} KB, size accepted`

      const resArray = []
      resArray.push(this.file, this.file_low)

      for (let i = 0; i < resArray.length; i++) {
        this.apiService.uploadFiles(resArray[i])
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
          }, (error)=> {
            console.log('file Error ', error)
            this.loadingSpinner = false
          })
      }

      const name = data.name
      const productCode = data.productCode
      const price = data.price
      const isFavorite = data.isFavorite
      const isAvailable = data.isAvailable
      const category = data.category
      const fileName = resArray[0].name
      const fileURL = `${this.api}/api/upload/${fileName}`
      const fileName_low = resArray[1].name
      const fileURL_low = `${this.api}/api/upload/${fileName_low}`

      this.apiService.createProduct({name, productCode, price, isFavorite, isAvailable, fileName, fileURL, fileName_low, fileURL_low}, category)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.loadingSpinner = false
          this.router.navigateByUrl(`admin/(root:product)`)
          this.submitted = false;
          this.form.reset();
        }, (error) => {
          console.log('createCategory Error ', error)
          this.loadingSpinner = false
          if(error.error.code === "23505") {
            this.queryError = 'name already exists'
          } else {
            this.queryError = error.error.error
          }
        }
      );
    }
  }


  update(id: string) {
    this.submitted = true;
    const data = this.form.value;
    if (this.form.invalid) {
      return;
    }
    this.loadingSpinner = true;

    if(this.file || this.file_low) {
      if(this.fileSize > 1000) {
        this.loadingSpinner = false;
        this.sizeLimit = `File size: ${this.fileSize} KB, size limit is under 1 MB`
      } else if(this.fileSize <= 1000) {
        this.sizeLimit = `File size: ${this.fileSize} KB, size accepted`

        const resArray = []
        resArray.push(this.file, this.file_low)

        for (let i = 0; i < resArray.length; i++) {
          this.apiService.uploadFiles(resArray[i])
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            }, (error)=> {
              console.log('file Error ', error)
              this.loadingSpinner = false
            })
        }

        const name = data.name
        const productCode = data.productCode
        const price = data.price
        const isFavorite = data.isFavorite
        const isAvailable = data.isAvailable
        const category = data.category
        const fileName = resArray[0].name
        const fileURL = `${this.api}/api/upload/${fileName}`
        const fileName_low = resArray[1].name
        const fileURL_low = `${this.api}/api/upload/${fileName_low}`

        this.apiService.updateProduct(id, {name, productCode, price, isFavorite, isAvailable, fileName, fileURL, fileName_low, fileURL_low}, category)

          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            this.loadingSpinner = false
            this.router.navigateByUrl(`admin/(root:product)`)
            this.submitted = false;
            this.form.reset();
          }, (error) => {
            console.log('createCategory Error ', error)
            this.loadingSpinner = false
            if(error.error.code === "23505") {
              this.queryError = 'name already exists'
            } else {
              this.queryError = error.error.error
            }
          }
        );
      }
    } else {
      const name = this.form.get('name').value
      const productCode = this.form.get('productCode').value
      const price = this.form.get('price').value
      const isFavorite = this.form.get('isFavorite').value
      const isAvailable = this.form.get('isAvailable').value
      const category = this.form.get('category').value
      const fileName = this.form.get('fileName').value
      const fileURL = this.form.get('fileURL').value
      const fileName_low = this.form.get('fileName_low').value
      const fileURL_low = this.form.get('fileURL_low').value

      this.apiService.updateProduct(id, {name, productCode, price, isFavorite, isAvailable, fileName, fileURL, fileName_low, fileURL_low}, category)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadingSpinner = false;
          this.router.navigateByUrl(`admin/(root:product)`)
          this.submitted = false;
          this.form.reset();
        }, (error) => {
          this.loadingSpinner = false;
          console.log(error)
          if(error.error.code === "23505") {
            this.queryError = 'name already exists'
          } else {
            this.queryError = error.error.message
          }
        });
    }
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  onFileSecelected(event: HTMLInputEvent) {
    if (event.target.files && event.target.files.length) {
      const file: File = event.target.files[0];
      this.file = file

      if(this.file.type === 'image/jpeg' || this.file.type === 'image/png') {
        this.isTypesupported = ''
        this.fileSize = Math.round(this.file.size / 1024)

        if(this.fileSize <= 1000) {
          this.sizeLimit = `File size: ${this.formatBytes(this.file.size)}, size accepted`
        } else {
          this.sizeLimit = `File size: ${this.formatBytes(this.file.size)}, size limit is under 1 MB`
          this.form.patchValue({
            file: '',
          });
        }
        this.form.patchValue({
          fileName: 's',
          fileURL: 's',
        });
      } else {
        this.isTypesupported = `Unsupported file type, ${this.file.type}`
        this.form.patchValue({
          file: '',
        });
      }
    } else {
      return;
    }
  }

  onFileSecelectedLow(event: HTMLInputEvent) {
    if (event.target.files && event.target.files.length) {
      const file: File = event.target.files[0];
      this.file_low = file
      this.fileSize = Math.round(this.file_low.size / 1024)

      if(this.file_low.type === 'image/jpeg' || this.file.type === 'image/png') {
        this.isTypesupported = ''

        if(this.fileSize <= 1000) {
          this.sizeLimit = `File size: ${this.formatBytes(this.file_low.size)}, size accepted`
        } else {
          this.sizeLimit = `File size: ${this.formatBytes(this.file_low.size)}, size limit is under 1 MB`
          this.form.patchValue({
            file_low: '',
          });
        }
        this.form.patchValue({
          fileName_low: 's',
          fileURL_low: 's',
        });
      } else {
        this.isTypesupported = `Unsupported file type, ${this.file_low.type}`
        this.form.patchValue({
          file_low: '',
        });
      }
    } else {
      return;
    }
  }

  loadAllCategory() {
    this.apiService.getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.categories = res
      })
  }

  isFavoriteEvent(isFavorite: boolean) {
    this.isFavorite = isFavorite;
  }

  isAvailableEvent(isAvailable: boolean) {
    this.isAvailable = isAvailable;
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
