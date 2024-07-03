export type CategoryType = {
  id: number;
  name: string;
  url: string;
  query: string;
  parentId: string;
  shard: string;
};

export type SystemInfoType = {
  categoriesUpdateDate: string;
  productsUpdateDate: string;
};
