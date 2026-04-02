export interface categoryType {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface productType {
  sold: number;
  images: string[];
  subcategory: {
    _id: string;
    name: string;
    slug: string;
    image: string;
  }[];
  ratingsQuantity: number;
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  priceAfterDiscount?: number;
  availableColors: [];
  imageCover: string;
  category: {
    _id: string;
    name: string;
    slug: string;
    image: string;
  };
  brand: {
    _id: string;
    name: string;
    slug: string;
    image: string;
  };
  ratingsAverage: number;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export type GetAllProductsParams = {
  limit?: number;
  page?: number;
  sort?: string;
  fields?: string;
  keyword?: string;
  brand?: string;
  priceGte?: number;
  priceLte?: number;
  categoryIn?: string;
};

export type GetAllProductsParamsWithLimit = {
  limit?: number;
  page?: number;
  sort?: string;
  fields?: string;
  keyword?: string;
  brand?: string[];
  priceGte?: number;
  priceLte?: number;
  categoryIn?: string[];
};

export type GetAllProductsResponse = {
  results: number;
  metadata?: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
    prevPage?: number;
  };
  data: ProductDetailsData[];
};

export type CategoryLike = {
  _id: string;
  name: string;
  slug: string;
  image: string;
};

export type BrandLike = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
};

export type SubcategoryLike = {
  _id: string;
  name: string;
  slug: string;
  category?: string;
};

export type ProductDetailsData = {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  imageCover: string;
  images: string[];
  price: number;
  priceAfterDiscount?: number;
  quantity: number;
  sold: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  createdAt?: string;
  updatedAt?: string;
  category: CategoryLike;
  brand?: BrandLike;
  subcategory?: SubcategoryLike[];
  reviews?: {
    _id: string;
    review: string;
    rating: number;
    createdAt: string;
  }[];
  availableColors?: string[];
};

export type GetAllCategoriesParams = {
  limit?: number;
  page?: number;
  keyword?: string;
};
