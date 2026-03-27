import { mapCatalogProductToStorefront } from "../contracts/catalog";
import type { StorefrontProduct } from "../types/storefront";
import { getCatalogProducts } from "./catalogStore";

export async function getProducts(collectionHandle = "all"): Promise<StorefrontProduct[]> {
  const data = await getCatalogProducts();
  const filtered =
    collectionHandle === "all"
      ? data
      : data.filter(
          (product) => (product.collection_handle ?? slugify(product.collection ?? "all")) === collectionHandle
        );

  return filtered.map(mapCatalogProductToStorefront);
}

export async function getProductByHandle(handle: string): Promise<StorefrontProduct> {
  const data = await getCatalogProducts();
  const product = data.find((entry) => entry.handle === handle);
  if (!product) {
    throw new Error(`Product ${handle} was not found in the local catalog.`);
  }

  return mapCatalogProductToStorefront(product);
}

export async function getCollectionHandles(): Promise<string[]> {
  const products = await getProducts("all");
  const handleSet = new Set<string>(["all"]);
  products.forEach((product) => {
    handleSet.add(product.collectionHandle || slugify(product.collection));
  });
  return [...handleSet];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
