import {Schema, model, Document} from 'mongoose';

interface SystemInfoType extends Document {
  categoriesUpdateDate?: number;
  productsUpdateDate?: number;
}

const systemInfoShema = new Schema<SystemInfoType>(
  {
    categoriesUpdateDate: {
      type: Number,
      required: false,
    },
    productsUpdateDate: {
      type: Number,
      required: false,
    },
  },
  {collection: 'systeminfo'},
);

const SystemInfo = model<SystemInfoType>('Systeminfo', systemInfoShema);

export default SystemInfo;
export {SystemInfoType};
