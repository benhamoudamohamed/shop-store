export interface Purchase {
  id: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
  cost: number;
  subtotal: number;
  coupon?: string;
  discount?: number;
  grandTotal: number;
  clientName: string;
  email: string;
  phone: string;
  address: string;
  created: Date;
}
