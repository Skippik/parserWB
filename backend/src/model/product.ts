import {Schema, model, Document} from 'mongoose';
import {ProductColor, ProductSize} from '../types';

interface ProductType extends Document {
  __sort: number;
  ksort: number;
  time1: number;
  time2: number;
  wh: number;
  dtype: number;
  dist: number;
  id: number;
  root: number;
  kindId: number;
  brand: string;
  brandId: number;
  siteBrandId: number;
  subjectId: number;
  subjectParentId: number;
  name: string;
  supplier: string;
  supplierId: number;
  supplierRating: number;
  supplierFlags: number;
  pics: number;
  rating: number;
  reviewRating: number;
  feedbacks: number;
  panelPromoId: number;
  promoTextCard: string;
  promoTextCat: string;
  volume: number;
  viewFlags: number;
  totalQuantity: number;
  logs: string;
  meta: {};
  sizes: ProductSize;
  colors: ProductColor[];
  category_id: number;
}

const productSchema = new Schema<ProductType>({
  __sort: {type: Number, required: false},
  category_id: {type: Number, required: false},
  ksort: {type: Number, required: false},
  time1: {type: Number, required: false},
  time2: {type: Number, required: false},
  wh: {type: Number, required: false},
  dtype: {type: Number, required: false},
  dist: {type: Number, required: false},
  id: {type: Number, required: true},
  root: {type: Number, required: false},
  kindId: {type: Number, required: false},
  brand: {type: String, required: false},
  brandId: {type: Number, required: false},
  siteBrandId: {type: Number, required: false},
  subjectId: {type: Number, required: false},
  subjectParentId: {type: Number, required: false},
  name: {type: String, required: false},
  supplier: {type: String, required: false},
  supplierId: {type: Number, required: false},
  supplierRating: {type: Number, required: false},
  supplierFlags: {type: Number, required: false},
  pics: {type: Number, required: false},
  rating: {type: Number, required: false},
  reviewRating: {type: Number, required: false},
  feedbacks: {type: Number, required: false},
  panelPromoId: {type: Number, required: false},
  promoTextCard: {type: String, required: false},
  promoTextCat: {type: String, required: false},
  volume: {type: Number, required: false},
  viewFlags: {type: Number, required: false},
  totalQuantity: {type: Number, required: false},
  logs: {type: String, required: false},
  meta: {type: Schema.Types.Mixed}, // Используем Mixed для произвольных полей
  sizes: [{type: Schema.Types.Mixed}], // Массив Mixed для произвольных размеров
  colors: [{type: Schema.Types.Mixed}], // Массив Mixed для произвольных цветов
});

const Product = model<ProductType>('Products', productSchema);

export default Product;
export {ProductType};
