import { Category } from "./category";

export interface Product {
  id: string;
  productCode: string;
  name: string;
  price: number;
  isFavorite: boolean;
  isAvailable: boolean;
  file?: File;
  fileName: string;
  fileURL: string;
  fileName_low: string;
  fileURL_low: string;
  created: Date;
  category: Category;
}
