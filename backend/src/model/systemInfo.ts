import {Schema, model, Document} from 'mongoose';

interface SystemInfoTypeModel extends Document {
  categoriesUpdateDate: string;
  productsUpdateDate: string;
}

const systemInfoShema = new Schema<SystemInfoTypeModel>({
  categoriesUpdateDate: {
    type: String,
    required: false,
  },
  productsUpdateDate: {
    type: String,
    required: true,
  },
});

const SystemInfo = model<SystemInfoTypeModel>('SystemInfo', systemInfoShema);

export default SystemInfo;
export {SystemInfoTypeModel};
