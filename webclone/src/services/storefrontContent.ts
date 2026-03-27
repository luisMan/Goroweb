import { ref } from "vue";
import type { StorefrontContent } from "../types/content";

const STORAGE_KEY = "birdfuel.storefront.content.v1";

const defaultStorefrontContent: StorefrontContent = {
  branding: {
    announcementText: "Free shipping in Mexico from $999 MXN - 100% plant-based formulas",
    brandName: "BirdFuel",
    brandMark: "BF",
    footerDescription: "Plant-based supplements for daily performance."
  },
  hero: {
    eyebrow: "Performance nutrition for modern routines",
    title: "Plant-powered formulas with clean ingredients and serious results.",
    subtext: "Built with Vue + Vite + Router, a catalog-driven storefront layer, and Mercado Pago checkout.",
    primaryCtaLabel: "Shop All Products",
    secondaryCtaLabel: "Read Performance Journal",
    cardLabel: "Top Seller",
    cardTitle: "Falcon Protein",
    cardText: "Organic plant protein with digestive enzymes."
  },
  homeCollections: {
    eyebrow: "Collections",
    title: "Choose your line"
  },
  stats: [
    { value: "116+", label: "Products and bundles" },
    { value: "4.8/5", label: "Average verified rating" },
    { value: "24h", label: "Order processing window" },
    { value: "100%", label: "Plant-based formulas" }
  ],
  valueProps: {
    eyebrow: "Why BirdFuel",
    title: "Built for consistency",
    items: [
      {
        title: "Clinically-informed formulas",
        text: "Ingredients selected for outcomes that matter: energy, recovery, and consistency."
      },
      {
        title: "Flexible subscription engine",
        text: "Frequency controls, smart offers, and predictable reorder flows."
      },
      {
        title: "Operationally scalable storefront",
        text: "Section-based UI, reusable blocks, and controlled app integrations."
      }
    ]
  },
  subscriptionBanner: {
    eyebrow: "Subscription Program",
    title: "Save up to 20% with auto-delivery.",
    buttonLabel: "Configure Subscription"
  },
  testimonials: {
    eyebrow: "Community",
    title: "Real customers, real progress",
    items: [
      {
        quote:
          "I switched my morning routine to BirdFuel and my digestion and training energy both improved within weeks.",
        name: "Ariadna L.",
        role: "Customer - Monterrey"
      },
      {
        quote:
          "Subscription delivery removed friction for me. I never run out now, and the cart upsells are actually relevant.",
        name: "Roberto M.",
        role: "Subscriber - Guadalajara"
      },
      {
        quote:
          "The formulas are clean, no heavy feeling, and the flavor profile is better than most options I tried.",
        name: "Daniela R.",
        role: "Customer - CDMX"
      }
    ]
  },
  journal: {
    eyebrow: "Journal",
    title: "Education and recipes"
  },
  faq: {
    eyebrow: "FAQ",
    title: "Common questions",
    items: [
      {
        id: 1,
        question: "Do you offer subscriptions with flexible frequency?",
        answer: "Yes. Customers can choose monthly frequency and adjust delivery from account settings."
      },
      {
        id: 2,
        question: "Are products vegan and free from common allergens?",
        answer: "Core formulas are 100% plant-based and most are free from dairy, gluten, and soy."
      },
      {
        id: 3,
        question: "How long does shipping take in Mexico?",
        answer: "Most orders process within 24 hours and typically arrive in 2-5 business days."
      },
      {
        id: 4,
        question: "How are payments handled in this storefront?",
        answer: "The cart creates a Mercado Pago Checkout Pro preference on the backend and redirects customers to pay securely."
      }
    ]
  },
  homeNewsletterTitle: "Get new drops, guides, and subscription offers.",
  blogPage: {
    eyebrow: "Journal",
    title: "Performance and nutrition insights",
    subtitle: "Editorial content driven by the storefront content feed.",
    newsletterTitle: "Get weekly nutrition and training content."
  },
  collectionPage: {
    eyebrow: "Collection",
    subtitle: "Filter products by line and quickly add items to cart.",
    emptyStateText: "No products were found for this collection."
  },
  cartPage: {
    eyebrow: "Cart",
    title: "Review your order",
    shippingNote: "Shipping and payment options are finalized in Mercado Pago.",
    checkoutButtonLabel: "Pay with Mercado Pago",
    continueShoppingLabel: "Continue Shopping",
    browseProductsLabel: "Browse Products",
    emptyStateText: "Your cart is empty."
  }
};

const content = ref<StorefrontContent>(cloneData(defaultStorefrontContent));

loadFromStorage();

export function useStorefrontContent() {
  return {
    content
  };
}

export function getStorefrontContentSnapshot(): StorefrontContent {
  return cloneData(content.value);
}

export function saveStorefrontContent(nextContent: StorefrontContent): void {
  const normalized = normalizeStorefrontContent(nextContent);
  content.value = normalized;

  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  }
}

export function resetStorefrontContent(): void {
  content.value = cloneData(defaultStorefrontContent);
  if (canUseStorage()) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

function loadFromStorage(): void {
  if (!canUseStorage()) return;

  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) return;

  try {
    const parsed = JSON.parse(rawValue) as StorefrontContent;
    content.value = normalizeStorefrontContent(parsed);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

function normalizeStorefrontContent(candidate: StorefrontContent): StorefrontContent {
  const next = cloneData(candidate);

  next.branding.announcementText = next.branding.announcementText.trim() || defaultStorefrontContent.branding.announcementText;
  next.branding.brandName = next.branding.brandName.trim() || defaultStorefrontContent.branding.brandName;
  next.branding.brandMark = next.branding.brandMark.trim().slice(0, 4) || defaultStorefrontContent.branding.brandMark;
  next.branding.footerDescription =
    next.branding.footerDescription.trim() || defaultStorefrontContent.branding.footerDescription;

  next.stats = next.stats.filter((item) => item.label.trim() || item.value.trim());
  next.valueProps.items = next.valueProps.items.filter((item) => item.title.trim() || item.text.trim());
  next.testimonials.items = next.testimonials.items.filter(
    (item) => item.quote.trim() || item.name.trim() || item.role.trim()
  );
  next.faq.items = next.faq.items
    .filter((item) => item.question.trim() || item.answer.trim())
    .map((item, index) => ({
      ...item,
      id: index + 1
    }));

  return next;
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && "localStorage" in window;
}

function cloneData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
