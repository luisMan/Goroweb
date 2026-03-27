import { computed, reactive } from "vue";
import type { StorefrontProduct } from "../types/storefront";

export interface CartLine {
  id: number;
  productId: number;
  handle: string;
  title: string;
  unitPriceCents: number;
  currencyCode: string;
  quantity: number;
  image: string;
}

const state = reactive({
  isOpen: false,
  lines: [] as CartLine[]
});

let nextLineId = 1;

export function useCart() {
  const lineCount = computed(() => state.lines.reduce((sum, line) => sum + line.quantity, 0));
  const subtotalCents = computed(() => state.lines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0));
  const currencyCode = computed(() => state.lines[0]?.currencyCode ?? "MXN");

  function openCart(): void {
    state.isOpen = true;
  }

  function closeCart(): void {
    state.isOpen = false;
  }

  function addProduct(product: StorefrontProduct): void {
    const existing = state.lines.find((line) => line.productId === product.id);
    if (existing) {
      existing.quantity += 1;
      state.isOpen = true;
      return;
    }

    state.lines.push({
      id: nextLineId++,
      productId: product.id,
      handle: product.handle,
      title: product.title,
      unitPriceCents: product.priceCents,
      currencyCode: product.currencyCode,
      quantity: 1,
      image: product.image
    });
    state.isOpen = true;
  }

  function removeLine(lineId: number): void {
    const index = state.lines.findIndex((line) => line.id === lineId);
    if (index !== -1) {
      state.lines.splice(index, 1);
    }
  }

  function increment(lineId: number): void {
    const line = state.lines.find((entry) => entry.id === lineId);
    if (line) line.quantity += 1;
  }

  function decrement(lineId: number): void {
    const line = state.lines.find((entry) => entry.id === lineId);
    if (!line) return;
    if (line.quantity <= 1) {
      removeLine(lineId);
      return;
    }
    line.quantity -= 1;
  }

  function clear(): void {
    state.lines.splice(0, state.lines.length);
  }

  return {
    state,
    lineCount,
    subtotalCents,
    currencyCode,
    openCart,
    closeCart,
    addProduct,
    removeLine,
    increment,
    decrement,
    clear
  };
}
