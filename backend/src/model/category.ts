import {Schema, model, Document} from 'mongoose';

interface CategoryType extends Document {
  id: number;
  name: string;
  url: string;
  query: string;
  parentId: string;
  shard: string;
}

const categoryShema = new Schema<CategoryType>({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  shard: {
    type: String,
    required: false,
  },
  query: {
    type: String,
    required: false,
  },
  parentId: {
    type: String,
    required: false,
  },
});

const Category = model<CategoryType>('Categoryes', categoryShema);

export default Category;
export {CategoryType};
