export interface StorefrontVariant {
  id: number;
  title: string;
  priceCents: number;
  sku: string;
  available: boolean;
}

export interface StorefrontProduct {
  id: number;
  handle: string;
  title: string;
  description: string;
  vendor: string;
  productType: string;
  collection: string;
  collectionHandle: string;
  badge: string;
  tags: string[];
  image: string;
  images: string[];
  priceCents: number;
  currencyCode: string;
  available: boolean;
  variants: StorefrontVariant[];
}

export interface StorefrontBlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  cover: string;
  publishedAt: string;
}
