import type { CartLine } from "../composables/useCart";

export interface MercadoPagoPreferenceResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint?: string;
}

interface CheckoutItemPayload {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number;
  currencyCode: string;
  pictureUrl: string;
}

const getPreferenceEndpoint = (): string =>
  import.meta.env.VITE_MERCADO_PAGO_PREFERENCE_ENDPOINT?.trim() || "/api/mercado-pago/preferences";

export async function createMercadoPagoPreference(
  lines: CartLine[]
): Promise<MercadoPagoPreferenceResponse> {
  if (!lines.length) {
    throw new Error("Add at least one item to your cart before checkout.");
  }

  const response = await fetch(getPreferenceEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      origin: window.location.origin,
      items: lines.map(mapCartLineToPayload)
    })
  });

  const payload = (await response.json().catch(() => null)) as
    | MercadoPagoPreferenceResponse
    | { error?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error || `Mercado Pago checkout failed with HTTP ${response.status}.`);
  }

  if (!payload || !("initPoint" in payload) || !payload.initPoint) {
    throw new Error("Mercado Pago checkout did not return a valid redirect URL.");
  }

  return payload;
}

function mapCartLineToPayload(line: CartLine): CheckoutItemPayload {
  return {
    id: String(line.productId),
    title: line.title,
    quantity: line.quantity,
    unitPrice: line.unitPriceCents / 100,
    currencyCode: line.currencyCode,
    pictureUrl: line.image
  };
}
