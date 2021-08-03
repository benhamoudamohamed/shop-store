import { Purchase } from './../purchase/entities/purchase.entity';
import { Category } from 'src/category/entities/category.entity';
import { EntityManager } from "typeorm";
import {internet, name, phone, commerce, finance, address, random } from 'faker';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { UserRole } from './role.enum';

export class Seed {
    constructor(private entityManager: EntityManager) {  }

    fakeIt<I>(entity: any): void {
        switch(entity) {
            case Category: 
            this.addData(this.addCategory(), entity)
                break

            case Product: 
            this.addData(this.addProduct(), entity)
                break

            case Purchase: 
            this.addData(this.addPurchase(), entity)
                break

            case User: 
            this.addData(this.addUser(), entity)
                break

            case Coupon:     
            this.addData(this.addCoupon(), entity)
                break
                 
            default:
                break
        }
    }

    private addUser(): Array<Partial<User>> {
        return Array.from({length: 1}).map<Partial<User>>(()=> {
            return {
                // firstname: 'Mohamed',
                // lastname: 'Ben Hamouda',
                // email: 'mawachimawachi@gmail.com',
                // password: 'passwordA!1',

                firstname: 'Amine',
                lastname: 'Mehrez',
                email: 'mohamedaminemehrez@outlook.fr',
                password: 'passwordA!1',

                // firstname: `${name.firstName()}`,
                // lastname: `${name.firstName()}`,
                // email: `${internet.email()}`,
                // password: `${internet.password()}`,
                salt: `${internet.password()}`,
                userRole: UserRole.MODERATOR,             
                currentHashedRefreshToken: '',
            };
        })
    }

    private addCategory(): Array<Partial<Category>> {
        return Array.from({length: 10}).map<Partial<Category>>(()=> {
            return {
                fileName: `${commerce.productName()}`,
                fileURL: `http://localhost:3000/api/upload/splash.jpg`,
                name: `${commerce.productName()}`,
            };
        })
    }

    private addProduct(): Array<Partial<Product>> {
        return Array.from({length: 10}).map<Partial<any>>(()=> {
            return {
                productCode: `${random.word()}`,
                name: `${commerce.productName()}`,
                price: `${commerce.price()}`,
                isFavorite: `${random.boolean()}`,
                isAvailable: `${random.boolean()}`, 
                fileName: `${commerce.productName()}`,
                fileURL: `http://localhost:3000/api/upload/splash.jpg`,  
                category: 2,
            };
        })
    }

    private addPurchase(): Array<Partial<Purchase>> {
        return Array.from({length: 10}).map<Partial<any>>(()=> {
            return {
                productName: `${commerce.productName()}`,
                price: `${commerce.price()}`,
                quantity: `${random.number()}`,
                total: `${finance.amount()}`,
                discount: `${random.number()}`, 
                grandTotal: `${finance.amount()}`,
                clientName: `${name.firstName()}`,
                email: `${internet.email()}`,
                phone: `${phone.phoneNumber()}`,
                address: `${address.streetAddress()}`,
                product: 64,
            };
        })
    }

    private addCoupon(): Array<Partial<Coupon>> {
        return Array.from({length: 10}).map<Partial<any>>(()=> {
            return {
                code: `${random.word()}`,
                discount: `${random.number()}`, 
                userLimit: `${random.number()}`,
                expired: `${random.boolean()}`,
            };
        })
    }
 
    private async addData<T>(
        data: Array<Partial<T>>,
        entity: any,
        fun?: (savedData: Array<Partial<T>>) => void,
      ): Promise<void> {
        return this.entityManager
          .save<T, T>(entity, data as any)
          .then((savedData: Array<Partial<T>>) => {
            if (fun) {
              fun(savedData);
            }
             console.log(savedData);
          })
          .catch(console.error);
      }
}