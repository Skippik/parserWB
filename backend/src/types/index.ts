export type CategoriesWbType = {
  id: number;
  name: string;
  url: string;
  query: string;
  childs: SubCategoriesWbTyp[];
};

export type SubCategoriesWbTyp = {
  id: number;
  name: string;
  parent: number;
  query: string;
  seo: string;
  url: string;
  childs: SubCategoriesWbTyp[];
};

export type ProductSize = {
  dtype: number;
  name: string;
  optionId: number;
  origName: string;
  payload: string;

  basic: number;
  logistics: number;
  product: number;
  return: number;
  total: number;
  rank: number;
  saleConditions: number;
  wh: number;
  price: ProductSizePrice;
};

export type ProductSizePrice = {
  price: {
    basic: number;
    product: number;
    total: number;
    logistics: number;
    return: number;
  };
};

export type ProductColor = {
  id: number;
  name: string;
};

export type SystemInfoType = {
  categoriesUpdateDate: string;
  productsUpdateDate: string;
};
