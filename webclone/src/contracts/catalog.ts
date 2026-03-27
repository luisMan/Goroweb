import type { StorefrontProduct, StorefrontVariant } from "../types/storefront";

export interface CatalogOption {
  name: string;
  values: string[];
}

export interface CatalogVariant {
  id: number;
  title: string;
  sku: string;
  available: boolean;
  price: number;
}

export interface CatalogProduct {
  id: number;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  type: string;
  tags: string[];
  price: number;
  available: boolean;
  variants: CatalogVariant[];
  images: string[];
  featured_image: string;
  options: CatalogOption[];
  collection?: string;
  collection_handle?: string;
  badge?: string;
  currency_code?: string;
}

export interface CatalogProductsResponse {
  products: CatalogProduct[];
}

export const mapCatalogVariantToStorefront = (variant: CatalogVariant): StorefrontVariant => ({
  id: variant.id,
  title: variant.title,
  priceCents: variant.price,
  sku: variant.sku,
  available: variant.available
});

export const mapCatalogProductToStorefront = (product: CatalogProduct): StorefrontProduct => ({
  id: product.id,
  handle: product.handle,
  title: product.title,
  description: product.description,
  vendor: product.vendor,
  productType: product.type,
  collection: product.collection ?? "All",
  collectionHandle: product.collection_handle ?? slugify(product.collection ?? "All"),
  badge: product.badge ?? "Featured",
  tags: product.tags,
  image: product.featured_image,
  images: product.images,
  priceCents: product.price,
  currencyCode: product.currency_code ?? "MXN",
  available: product.available,
  variants: product.variants.map(mapCatalogVariantToStorefront)
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
