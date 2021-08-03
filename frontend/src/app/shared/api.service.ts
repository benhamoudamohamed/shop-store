import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { User } from './models/user';
import { Product } from './models/product';
import { Category } from './models/category';
import { AuthDTO } from './models/auth';
import { Purchase } from './models/purchase';
import { Coupon } from './models/coupon';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private api: string = environment.api_server;

  constructor(private http: HttpClient, private auth: AuthService) { }

  public request(method: string, endpoint: string, body?: any): Observable<any> {
    const url = `${this.api}/${endpoint}`;
    return this.http.request(method, url, {body, headers: {authorization: `Bearer ${this.auth.token}`}})
  }

  private requestWithoutToken(method: string, endpoint: string, body?: any): Observable<any> {
    const url = `${this.api}/${endpoint}`;
    return this.http.request(method, url, {body})
  }

  //************** File **************************
  uploadFiles(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.request('POST', `api/upload`, formData)
  }

  deleteFile(file: string): Observable<any> {
    return this.request('DELETE', `api/upload/${file}`)
  }

  //************** Users **************************
  getAllUsers(page: number, size: number): Observable<User[]>  {
    return this.request('GET', `api/user?page=${page}&size=${size}`)
  }

  getOneUser(id: string): Observable<User>  {
    return this.request('GET', `api/user/${id}`)
  }

  getUserBymail(data: User): Observable<User>  {
    return this.requestWithoutToken('POST', `findbyEmail`, data)
  }

  resetPassowrd(data: AuthDTO): Observable<AuthDTO>  {
    return this.requestWithoutToken('POST', `resetPassowrd`, data)
  }

  register(data: User): Observable<User> {
    return this.request('POST', `register`, data)
  }

  updateUser(id: string, data: User): Observable<User> {
    return this.request('PUT', `api/user/${id}`, data)
  }

  deleteUser(id: string): Observable<User> {
    return this.request('DELETE', `api/user/${id}`)
  }

  //************** Category **************************
  getAllCategories(): Observable<Category[]>  {
    return this.requestWithoutToken('GET', `api/category/all`)
  }

  getAllCategoriesByPage(page: number, size: number): Observable<Category[]>  {
    return this.requestWithoutToken('GET', `api/category?page=${page}&size=${size}`)
  }

  getOneCategory(id: string): Observable<Category>  {
    return this.requestWithoutToken('GET', `api/category/${id}`)
  }

  createCategory(data: any): Observable<Category> {
    return this.request('POST', `api/category`, data)
  }

  updateCategory(id: string, data: any): Observable<Category> {
    return this.request('PUT', `api/category/${id}`, data)
  }

  deleteCategory(id: string): Observable<Category>  {
    return this.request('DELETE', `api/category/${id}`)
  }

  //************** Product **************************
  getAllProducts(page: number, size: number): Observable<Product[]>  {
    return this.requestWithoutToken('GET', `api/product?page=${page}&size=${size}`)
  }

  getProductsByCategory(id: string): Observable<Product[]>  {
    return this.requestWithoutToken('GET', `api/product/category/${id}`)
  }

  findByFavorite(isFavorite: boolean): Observable<Product[]>  {
    return this.requestWithoutToken('GET', `api/product/isFavorite/${isFavorite}`)
  }

  getOneProduct(id: string): Observable<Product>  {
    return this.requestWithoutToken('GET', `api/product/${id}`)
  }

  createProduct(data: any, catId: string): Observable<Product> {
    return this.request('POST', `api/product/category/${catId}`, {...data})
  }

  updateProduct(id: string, data: any, catId: string): Observable<Product> {
    return this.request('PUT', `api/product/${id}/category/${catId}`, data)
  }

  deleteProduct(id: string): Observable<Product>  {
    return this.request('DELETE', `api/product/${id}`)
  }

  //************** Purchase **************************
  getAllPurchases(page: number, size: number): Observable<Purchase[]>  {
    return this.requestWithoutToken('GET', `api/purchase?page=${page}&size=${size}`)
  }

  getOnePurchase(id: string): Observable<Purchase>  {
    return this.requestWithoutToken('GET', `api/purchase/${id}`)
  }

  createPurchase(data: any): Observable<Purchase> {
    return this.request('POST', `api/purchase/`, data)
  }

  deletePurchase(id: string): Observable<Purchase>  {
    return this.request('DELETE', `api/purchase/${id}`)
  }

  //************** Coupon **************************
  getAllCoupons(): Observable<Coupon[]>  {
    return this.requestWithoutToken('GET', `api/coupon/all`)
  }

  getAllCouponsByPage(page: number, size: number): Observable<Coupon[]>  {
    return this.requestWithoutToken('GET', `api/coupon?page=${page}&size=${size}`)
  }

  getOneCoupon(id: string): Observable<Coupon>  {
    return this.requestWithoutToken('GET', `api/coupon/${id}`)
  }

  findbyCode(id: string): Observable<Coupon>  {
    return this.requestWithoutToken('GET', `api/coupon/findByCoupon/${id}`)
  }

  createCoupon(data: any): Observable<Coupon> {
    return this.request('POST', `api/coupon`, data)
  }

  updateCoupon(id: string, data: any): Observable<Coupon> {
    return this.request('PUT', `api/coupon/${id}`, data)
  }

  updateUserLimit(id: string, data: any): Observable<Coupon> {
    return this.requestWithoutToken('PUT', `api/coupon/${id}/userLimit`, data)
  }

  deleteCoupon(id: string): Observable<Coupon>  {
    return this.request('DELETE', `api/coupon/${id}`)
  }
}
