import { Product } from './product';

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  userLimit: number;
  expired: boolean;
  created: Date;
  product: Product;
}
