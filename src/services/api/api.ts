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
import type { GetUserCartResponse } from "@/types/cart";

function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (error instanceof Error) return error.message;
  return fallback;
}

async function parseJsonResponse<T>(
  res: Response,
  fallbackMessage: string,
): Promise<T> {
  let data: T | { message?: string };

  try {
    data = (await res.json()) as T | { message?: string };
  } catch {
    throw new Error(fallbackMessage);
  }

  if (!res.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : fallbackMessage;

    throw new Error(message);
  }

  return data as T;
}

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
        next: { revalidate: 60 * 60 * 24 },
      },
    );

    const data = await parseJsonResponse<{ data: categoryType[] }>(
      res,
      "Failed to fetch categories",
    );

    return data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch categories"));
  }
}

export async function getSpecificCategory(
  categoryId: string,
): Promise<CategoryLike> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/categories/${categoryId}`,
      {
        method: "GET",
        next: { revalidate: 60 * 60 * 24 },
      },
    );

    const data = await parseJsonResponse<{ data: CategoryLike }>(
      res,
      "Failed to fetch category",
    );

    return data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch category"));
  }
}

export async function getAllProducts(
  params: GetAllProductsParams = {},
): Promise<ProductDetailsData[]> {
  try {
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
    if (params.categoryIn) {
      searchParams.set("category[in]", params.categoryIn);
    }

    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products?${searchParams.toString()}`,
      {
        method: "GET",
        next: { revalidate: 60 * 60 * 24 },
      },
    );

    const data = await parseJsonResponse<{ data: ProductDetailsData[] }>(
      res,
      "Failed to fetch products",
    );

    return data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch products"));
  }
}

export async function getAllProductsWithLimit(
  params: GetAllProductsParamsWithLimit = {},
): Promise<GetAllProductsResponse> {
  try {
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
        next: { revalidate: 60 * 60 * 24 },
      },
    );

    return await parseJsonResponse<GetAllProductsResponse>(
      res,
      "Failed to fetch products",
    );
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch products"));
  }
}

export async function getSingleProduct(
  id: string,
): Promise<ProductDetailsData> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products/${id}`,
      {
        method: "GET",
        next: { revalidate: 60 * 60 * 24 },
      },
    );

    const data = await parseJsonResponse<{ data: ProductDetailsData }>(
      res,
      "Failed to fetch product",
    );

    return data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch product"));
  }
}

export async function getAllBrands(): Promise<BrandLike[]> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/brands`, {
      method: "GET",
      next: { revalidate: 60 * 60 * 24 },
    });

    const data = await parseJsonResponse<{ data: BrandLike[] }>(
      res,
      "Failed to fetch brands",
    );

    return data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch brands"));
  }
}

export async function getSpecificBrand(brandId: string): Promise<BrandLike> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/brands/${brandId}`,
      {
        method: "GET",
        next: { revalidate: 60 * 60 * 24 },
      },
    );

    const data = await parseJsonResponse<{ data: BrandLike }>(
      res,
      "Failed to fetch brand",
    );

    return data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch brand"));
  }
}

export async function getSubcategoriesByCategory(
  categoryId: string,
): Promise<SubcategoryLike[]> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/categories/${categoryId}/subcategories`,
      {
        method: "GET",
        next: { revalidate: 60 * 60 * 24 },
      },
    );

    const data = await parseJsonResponse<{ data: SubcategoryLike[] }>(
      res,
      "Failed to fetch subcategories",
    );

    return data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch subcategories"));
  }
}

export async function getSpecificSubCategory(
  subCategoryId: string,
): Promise<SubcategoryLike> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/subcategories/${subCategoryId}`,
      {
        method: "GET",
        next: { revalidate: 60 * 60 * 24 },
      },
    );

    const data = await parseJsonResponse<{ data: SubcategoryLike }>(
      res,
      "Failed to fetch subcategory",
    );

    return data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch subcategory"));
  }
}

export async function getUserCart(
  accessToken: string,
): Promise<GetUserCartResponse> {
  try {
    const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
      method: "GET",
      headers: {
        token: accessToken,
      },
      next: { revalidate: 60 * 60 * 24 },
    });

    const data = await parseJsonResponse<GetUserCartResponse>(
      res,
      "Failed to fetch cart",
    );

    console.log(data);

    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch cart"));
  }
}
