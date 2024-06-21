export type Categories = {
  id: number;
  name: string;
  url: string;
  query: string;
  childs: SubCategories[];
};

export type SubCategories = {
  id: number;
  name: string;
  parent: number;
  query: string;
  seo: string;
  url: string;
  childs: SubCategories[];
};
