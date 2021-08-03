import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as Cookies from 'js-cookie'
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/shared/api.service';
declare let Email: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  productListOnCart
  products: Array<any>
  id
  cartItem: number
  newArray
  private readonly destroy$ = new Subject();

  invoice: any = {};
  invoiceForm: FormGroup;
  invoiceFormSub: Subscription;
  subTotal: number;

  coupons: string;
  message: string = ''
  submitted: boolean = false
  loadingSpinner: boolean = false;
  queryError:string;

  couponId: string;
  userLimit: number;

  constructor(private apiService: ApiService,
    private formBuilder: FormBuilder,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

    this.products = []
    if(Cookies.get("cartItem") !== undefined && Cookies.get("productListOnCart") !== undefined) {

      this.cartItem = parseInt(Cookies.get("cartItem"))
      this.productListOnCart = Cookies.get("productListOnCart")
      this.newArray = JSON.parse(this.productListOnCart)

      for(let i = 0; i < this.newArray.length; i++) {
        this.id = this.newArray[i]
        this.apiService.getOneProduct(this.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {
            this.products.push(res)
            this.productItems.push(
              this.formBuilder.group({
                productName: [res.name],
                image: [res.fileURL],
                quantity: [1],
                price: [res.price],
                cost: [res.price]
              })
            );
          })
      }
    }

    setInterval(() => {
      this.cartItem = parseInt(Cookies.get("cartItem"))
      this.productListOnCart = Cookies.get("productListOnCart")
    }, 1000)
  }

  ngOnInit() {
    this.buildInvoiceForm(this.invoice);

    this.invoiceForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(formValue => {
        this.coupons = formValue.coupon
        this.queryError = ''
      });
  }

  get productItems() {
    return this.invoiceForm.get('items') as FormArray;
  }
  get f() {
    return this.invoiceForm.controls;
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  buildInvoiceForm(i: any = {}) {
    this.invoiceForm = this.fb.group({
      subtotal: [''],
      coupon: [''],
      discount: [0],
      grandTotal: [''],
      clientName: ['', [Validators.required, Validators.minLength(4)]],
      phone : ['', [Validators.required, Validators.minLength(8), Validators.maxLength(13)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(4)]],
      items: this.fb.array((() => {
        if (!i.items) {
          return [];
        }
        return i.items.map((item) => this.createItem(item));
      })())
    });
    // LINSTEN FOR VALUE CHANGES AND CALCULATE TOTAL
    if (this.invoiceFormSub) {
      this.invoiceFormSub.unsubscribe();
    }
    this.invoiceFormSub = this.invoiceForm.valueChanges
      .subscribe(formValue => {
        this.subTotal = this.calculateSubtotal(formValue);
      });
  }

  createItem(item: any = {}) {
    return this.fb.group({
      productName: [''],
      image: [''],
      quantity: [''],
      price: [''],
      cost: [''],
    });
  }

  removeItem(i) {
    const control = <FormArray>this.invoiceForm.controls['items'];
    control.removeAt(i);

    let newArray = JSON.parse(this.productListOnCart)
    newArray.forEach((element,index)=>{
      if(index === i) newArray.splice(index, 1);
    });
    Cookies.set("productListOnCart", JSON.stringify(newArray))
    this.productListOnCart = JSON.parse(Cookies.get("productListOnCart"))
    Cookies.set("cartItem", JSON.stringify(this.productListOnCart.length))

    if(this.productListOnCart.length < 1) {
      window.location.reload();
    }
  }

  calculateSubtotal(invoice) {
    let total = 0;
    invoice.items.forEach(i => {
        total += (i.quantity * i.price);
    });
    return total;
  }

  changeQuantity(index, increase: boolean) {
    const control = <FormArray>this.invoiceForm.controls['items'];
    let quantity = this.invoiceForm.get('items')['controls'][index].controls['quantity'].value
    let price = this.invoiceForm.get('items')['controls'][index].controls['price'].value

    if(increase === true) {
      control.at(index).patchValue({
        'quantity': quantity + 1,
      })
      quantity = this.invoiceForm.get('items')['controls'][index].controls['quantity'].value
      control.at(index).patchValue({
        'cost': quantity * price,
      })
    }
    else {
      if(quantity >1) {
        control.at(index).patchValue({
          'quantity': quantity - 1,
        })
        quantity = this.invoiceForm.get('items')['controls'][index].controls['quantity'].value
        control.at(index).patchValue({
          'cost': quantity * price,
        })
      }
    }

    this.invoiceForm.patchValue({
      'subtotal': this.subTotal
    })
  }

  setCodePromo() {
    const data = this.invoiceForm.value;
    this.apiService.findbyCode(data.coupon)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.couponId = res.id;
        this.userLimit = res.userLimit;

        if(!res.expired) {
          this.message = 'Valid Code'
          this.invoiceForm.patchValue({
            'discount': res.discount,
            'grandTotal': (this.subTotal - res.discount/100 * this.subTotal),
          })
        } else if(res.expired) {
          this.message = 'Coupon Code Expired'
          this.invoiceForm.patchValue({
            'coupon': '',
            'discount': 0,
            'grandTotal': this.subTotal,
          })
        }
      }, (error: any) => {
        this.message = 'Coupon Not Found'
        this.invoiceForm.patchValue({
          'coupon': '',
          'discount': 0,
          'grandTotal': this.subTotal,
        })
      }
    );
  }

  onSubmit() {
    this.invoiceForm.patchValue({
      'subtotal': this.subTotal,
      'grandTotal': (this.subTotal - this.invoiceForm.controls['discount'].value/100 * this.subTotal)
    })

    this.submitted = true;
    const data = this.invoiceForm.value;
    if (this.invoiceForm.invalid) {
      return;
    }

    let items = data.items
    let subtotal = data.subtotal
    let coupon = data.coupon
    let discount = data.discount
    let grandTotal = data.grandTotal
    let clientName = data.clientName
    let phone = data.phone
    let email = data.email
    let address = data.address

    this.loadingSpinner = true;

    this.apiService.createPurchase({items, subtotal, coupon, discount, grandTotal, clientName, phone, email, address})
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if(this.userLimit > 0) {
          const data = {
            userLimit: this.userLimit-1
          }
          this.apiService.updateUserLimit(this.couponId, data)
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => {
              if(res.userLimit === 0) {
                const data = {
                  code: res.code,
                  discount: res.discount,
                  userLimit: res.userLimit,
                  expired: true,
                }
                this.apiService.updateCoupon(this.couponId, data)
                  .pipe(takeUntil(this.destroy$))
                  .subscribe(() => {})
              }
            })
        }

        Email.send({
          SecureToken: "C973D7AD-F097-4B95-91F4-40ABC5567812",
          Host: 'ssl0.ovh.net',
          Username: 'contact@artyclic.com',
          Password: 'AeuHDZwPbcQ6Xjv',
          To: 'contact@artyclic.com',
          From: email,
          Subject: `Purchase`,
          Body: `
              <style type="text/css">
                a { color: #0000ee; text-decoration: underline; }
                @media only screen and (min-width: 620px) {
                .u-row {
                width: 600px !important;
                }
                .u-row .u-col {
                vertical-align: top;
                }

                .u-row .u-col-100 {
                width: 600px !important;
                }

                }

                @media (max-width: 620px) {
                .u-row-container {
                max-width: 100% !important;
                padding-left: 0px !important;
                padding-right: 0px !important;
                }
                .u-row .u-col {
                min-width: 320px !important;
                max-width: 100% !important;
                display: block !important;
                }
                .u-row {
                width: calc(100% - 40px) !important;
                }
                .u-col {
                width: 100% !important;
                }
                .u-col > div {
                margin: 0 auto;
                }
                }
                body {
                margin: 0;
                padding: 0;
                }

                table,
                tr,
                td {
                vertical-align: top;
                border-collapse: collapse;
                }

                p {
                  margin: 3% 0;
                }

                .ie-container table,
                .mso-container table {
                table-layout: fixed;
                }

                * {
                line-height: inherit;
                }

                a[x-apple-data-detectors='true'] {
                color: inherit !important;
                text-decoration: none !important;
                }
              </style>

              <div class="clean-body" style="margin: 2% 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #b88401">
              <!--[if IE]><div class="ie-container"><![endif]-->
              <!--[if mso]><div class="mso-container"><![endif]-->
              <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0">
                <tbody>
                  <tr style="vertical-align: top">
                    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f9f9f9;"><![endif]-->

                      <!-- icon + Header -->
                      <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #b88401;">
                          <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #003399;"><![endif]-->

                            <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                            <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                              <div style="width: 100% !important;">
                              <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                                <!-- Email icon -->
                                <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                  <tbody>
                                    <tr>
                                      <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 10px;font-family:'Cabin',sans-serif;" align="left">
                                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                          <td style="padding-right: 0px;padding-left: 0px;" align="center">
                                            <img align="center" border="0" src="https://dl.dropboxusercontent.com/s/urvdg3y0rcr3ybx/image-5.png?dl=0" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 26%;max-width: 150.8px;" width="150.8"/>
                                          </td>
                                        </tr>
                                      </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <!-- Header -->
                                <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                  <tbody>
                                    <tr>
                                      <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 31px;font-family:'Cabin',sans-serif;" align="left">
                                        <div style="color: #e5eaf5; line-height: 140%; text-align: center; word-wrap: break-word;">
                                          <p style="font-size: 14px; line-height: 140%;">
                                            <span style="font-size: 28px; line-height: 39.2px;">
                                              <strong><span style="line-height: 39.2px; font-size: 28px;">You have a new Purchase</span></strong>
                                            </span>
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                              </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                          </div>
                        </div>
                      </div>

                      <!-- Body -->
                      <div class="u-row-container" style="padding: 0px;background-color: transparent;">
                        <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                          <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->

                            <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                            <div class="u-col u-col-100" style=" background-color: #e5eaf5; max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                              <div style="width: 100% !important;">
                              <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                                <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                  <tbody>
                                    <tr>
                                      <td style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px;font-family:'Cabin',sans-serif;" align="left">
                                        <div style="color: #000000; line-height: 160%; word-wrap: break-word;">
                                          <p style="text-transform: uppercase; font-size: 14px; line-height: 160%; text-align: center;"><span style="font-size: 22px; line-height: 35.2px;">Subject: Purchase</span></p>
                                          <p style="font-size: 14px; line-height: 160%;  text-align: left; margin-top: 10%;">
                                            <span style="font-size: 18px; line-height: 28.8px; ">Client Name: ${data.clientName}</span>
                                          </p>
                                          <p style="font-size: 14px; line-height: 160%; text-align: left;">
                                          <span style="font-size: 18px; line-height: 28.8px;">Phone Number: ${data.phone}</span>
                                        </p>
                                        <p style="font-size: 14px; line-height: 160%; text-align: left;">
                                          <span style="font-size: 18px; line-height: 28.8px;">Email:  ${data.email}</span>
                                        </p>
                                        <p style="font-size: 14px; line-height: 160%; text-align: left;">
                                          <span style="font-size: 18px; line-height: 28.8px;">Address: ${data.address}</span>
                                        </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                              </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                          </div>
                        </div>
                      </div>

                      <!-- Footer -->
                      <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #b88401;">
                          <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #003399;"><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                            <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                              <div style="width: 100% !important;">
                              <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                                <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                  <tbody>
                                    <tr>
                                      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
                                        <div style="color: #fafafa; line-height: 180%; text-align: center; word-wrap: break-word;">
                                          <p style="font-size: 14px; line-height: 180%;"><span style="font-size: 16px; line-height: 28.8px;">Copyrights &copy; All Rights Reserved</span></p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                              </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                          </div>
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></div><![endif]-->
              <!--[if IE]></div><![endif]-->
            </div>`
          }).then(() => {

            this.loadingSpinner = false;
            this.submitted = false;
            Cookies.remove('productListOnCart')
            Cookies.remove('cartItem')

            window.location.reload();
            this.loadingSpinner = false
            this.submitted = false;
            this.invoiceForm.reset();
          }, (error) => {
            console.log(error)
            this.loadingSpinner = false
          })

      }, (error) => {
        console.log(error)
        this.loadingSpinner = false
        this.queryError = error
      })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
