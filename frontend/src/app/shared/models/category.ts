import { Product } from "./product";

export interface Category {
  id: string;
  name: string;
  file?: File;
  fileName: string;
  fileURL: string;
  fileName_low: string;
  fileURL_low: string;
  created: Date;
  products: Product[];
}
