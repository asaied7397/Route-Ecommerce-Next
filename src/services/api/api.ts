import type {
  BrandLike,
  CategoryLike,
  categoryType,
  GetAllCategoriesParams,
  GetAllProductsParams,
  GetAllProductsParamsWithLimit,
  GetAllProductsResponse,
  ProductDetailsData,
  SubcategoryLike,
} from "@/types/types";

export async function getAllCategories(
  params: GetAllCategoriesParams = {},
): Promise<categoryType[]> {
  try {
    const searchParams = new URLSearchParams();

    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.page) searchParams.set("page", String(params.page));
    if (params.keyword) searchParams.set("keyword", params.keyword);

    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/categories?${searchParams.toString()}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await res.json();
    const categories = data.data;

    return categories;
  } catch (error) {
    throw error;
  }
}

export async function getSpecificCategory(
  categoryId: string,
): Promise<CategoryLike> {
  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/categories/${categoryId}`,
  );
  const data = await res.json();
  const category = data.data;
  return category;
}

export async function getAllProducts(
  params: GetAllProductsParams = {},
): Promise<ProductDetailsData[]> {
  const searchParams = new URLSearchParams();

  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.page) searchParams.set("page", String(params.page));
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.fields) searchParams.set("fields", params.fields);
  if (params.keyword) searchParams.set("keyword", params.keyword);
  if (params.brand) searchParams.set("brand", params.brand);
  if (params.priceGte !== undefined) {
    searchParams.set("price[gte]", String(params.priceGte));
  }
  if (params.priceLte !== undefined) {
    searchParams.set("price[lte]", String(params.priceLte));
  }

  if (params.categoryIn) searchParams.set("category[in]", params.categoryIn);

  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/products?${searchParams.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );
  const data = await res.json();
  const products = data.data;
  return products;
}

export async function getAllProductsWithLimit(
  params: GetAllProductsParamsWithLimit = {},
): Promise<GetAllProductsResponse> {
  const searchParams = new URLSearchParams();

  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.page) searchParams.set("page", String(params.page));
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.fields) searchParams.set("fields", params.fields);
  if (params.keyword) searchParams.set("keyword", params.keyword);
  if (params.priceGte !== undefined) {
    searchParams.set("price[gte]", String(params.priceGte));
  }
  if (params.priceLte !== undefined) {
    searchParams.set("price[lte]", String(params.priceLte));
  }

  if (params.brand?.length) {
    params.brand.forEach((brandId) => {
      searchParams.append("brand", brandId);
    });
  }

  if (params.categoryIn?.length) {
    params.categoryIn.forEach((categoryId) => {
      searchParams.append("category[in]", categoryId);
    });
  }

  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/products?${searchParams.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data;
}

export async function getSingleProduct(id: string) {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products/${id}`,
    );
    const data = await res.json();
    const product = data.data;
    return product;
  } catch {}
}

export async function getAllBrands() {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/brands`);
    const data = await res.json();
    const brand = data.data;
    return brand;
  } catch {}
}

export async function getSpecificBrand(brandId: string): Promise<BrandLike> {
  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/brands/${brandId}`,
  );
  const data = await res.json();
  const brand = data.data;
  return brand;
}

export async function getSubcategoriesByCategory(
  categoryId: string,
): Promise<SubcategoryLike[]> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/categories/${categoryId}/subcategories`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch subcategories");
    }

    const data = await res.json();
    const subCategory = data.data;

    return subCategory;
  } catch (error) {
    throw error;
  }
}

export async function getSpecificSubCategory(
  subCategoryId: string,
): Promise<SubcategoryLike> {
  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/subcategories/${subCategoryId}`,
  );
  const data = await res.json();
  const subCategory = data.data;
  return subCategory;
}

import type { GetUserCartResponse } from "@/types/cart";

export async function getUserCart(
  accessToken: string,
): Promise<GetUserCartResponse> {
  const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
    method: "GET",
    headers: {
      token: accessToken,
    },
    cache: "no-store",
  });

  const data: GetUserCartResponse = await res.json();

  console.log(data);

  if (!res.ok) {
    throw new Error("Failed to fetch cart");
  }

  return data;
}
