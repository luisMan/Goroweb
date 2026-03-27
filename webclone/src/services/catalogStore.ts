import { ref } from "vue";
import type { CatalogProduct, CatalogProductsResponse } from "../contracts/catalog";

const STORAGE_KEY = "birdfuel.storefront.catalog.v1";
const STORAGE_VERSION = 2;
const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1594737625785-cf2f247e3491?auto=format&fit=crop&w=900&q=80";

const catalogRevision = ref(0);
const catalogState = ref<CatalogProduct[] | null>(null);
let loadPromise: Promise<CatalogProduct[]> | null = null;

export function useCatalogStore() {
  return {
    catalogRevision
  };
}

export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  if (catalogState.value?.length) {
    return cloneData(catalogState.value);
  }

  if (catalogState.value && catalogState.value.length === 0) {
    catalogState.value = null;
    loadPromise = null;
  }

  if (!loadPromise) {
    loadPromise = loadCatalogProducts();
  }

  const products = await loadPromise;
  catalogState.value = cloneData(products);
  return cloneData(products);
}

export async function getCatalogProductsSnapshot(): Promise<CatalogProduct[]> {
  return await getCatalogProducts();
}

export function saveCatalogProducts(products: CatalogProduct[]): CatalogProduct[] {
  const normalized = normalizeCatalogProducts(products);
  catalogState.value = cloneData(normalized);
  loadPromise = Promise.resolve(cloneData(normalized));
  catalogRevision.value += 1;

  if (canUseStorage()) {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        products: normalized
      })
    );
  }

  return cloneData(normalized);
}

export async function resetCatalogProducts(): Promise<CatalogProduct[]> {
  if (canUseStorage()) {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  catalogState.value = null;
  loadPromise = null;
  catalogRevision.value += 1;
  return await getCatalogProducts();
}

async function loadCatalogProducts(): Promise<CatalogProduct[]> {
  const stored = getStoredCatalogProducts();
  if (stored) {
    return stored;
  }

  const response = await fetch("/api/products.json");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} when requesting /api/products.json`);
  }

  const data = (await response.json()) as CatalogProductsResponse;
  return normalizeCatalogProducts(data.products);
}

function getStoredCatalogProducts(): CatalogProduct[] | null {
  if (!canUseStorage()) return null;

  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue) as { version?: number; products?: CatalogProduct[] } | CatalogProduct[];
    if (Array.isArray(parsed)) {
      const legacyProducts = normalizeCatalogProducts(parsed);
      if (!legacyProducts.length) {
        window.localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return legacyProducts;
    }

    if (!parsed || parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.products)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    const storedProducts = normalizeCatalogProducts(parsed.products);
    if (!storedProducts.length) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return storedProducts;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function normalizeCatalogProducts(products: CatalogProduct[]): CatalogProduct[] {
  let nextProductId = getMaxId(products.map((product) => product.id), 4516886970455);
  let nextVariantId = getMaxId(
    products.flatMap((product) => product.variants.map((variant) => variant.id)),
    499000000
  );

  return products.map((product, index) => {
    const id = normalizeNumericId(product.id) || ++nextProductId;
    const title = product.title?.trim() || `Product ${index + 1}`;
    const handle = normalizeHandle(product.handle || title || `product-${id}`) || `product-${id}`;
    const featuredImage = product.featured_image?.trim() || product.images?.[0]?.trim() || DEFAULT_PRODUCT_IMAGE;
    const galleryImages = dedupeStrings([featuredImage, ...(product.images ?? [])]);
    const collection = product.collection?.trim() || "All";
    const collectionHandle = normalizeHandle(product.collection_handle || collection) || "all";
    const currencyCode = (product.currency_code || "MXN").trim().toUpperCase() || "MXN";
    const price = normalizeNumericId(product.price) || normalizeNumericId(product.variants?.[0]?.price) || 0;
    const available = product.available !== false;
    const variant = product.variants?.[0];
    const variantId = normalizeNumericId(variant?.id) || ++nextVariantId;

    return {
      id,
      title,
      handle,
      description: product.description?.trim() || "<p>New product description.</p>",
      vendor: product.vendor?.trim() || "BirdFuel",
      type: product.type?.trim() || "Core Series",
      tags: dedupeStrings(product.tags ?? []),
      price,
      available,
      variants: [
        {
          id: variantId,
          title: variant?.title?.trim() || "Default Title",
          sku: variant?.sku?.trim() || handle.toUpperCase(),
          available,
          price
        }
      ],
      images: galleryImages,
      featured_image: featuredImage,
      options: product.options?.length
        ? product.options
        : [
            {
              name: "Title",
              values: ["Default Title"]
            }
          ],
      collection,
      collection_handle: collectionHandle,
      badge: product.badge?.trim() || "Featured",
      currency_code: currencyCode
    };
  });
}

function getMaxId(values: number[], fallback: number): number {
  return values.reduce((max, value) => Math.max(max, normalizeNumericId(value)), fallback);
}

function normalizeNumericId(value: unknown): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? Math.round(numeric) : 0;
}

function normalizeHandle(value: string): string {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function dedupeStrings(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && "localStorage" in window;
}

function cloneData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
