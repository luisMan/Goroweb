export interface StorefrontStatItem {
  value: string;
  label: string;
}

export interface StorefrontValueProp {
  title: string;
  text: string;
}

export interface StorefrontTestimonial {
  quote: string;
  name: string;
  role: string;
}

export interface StorefrontFaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface StorefrontHeroContent {
  eyebrow: string;
  title: string;
  subtext: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  cardLabel: string;
  cardTitle: string;
  cardText: string;
}

export interface StorefrontSectionHeading {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export interface StorefrontValuePropsSection extends StorefrontSectionHeading {
  items: StorefrontValueProp[];
}

export interface StorefrontTestimonialsSection extends StorefrontSectionHeading {
  items: StorefrontTestimonial[];
}

export interface StorefrontFaqSection extends StorefrontSectionHeading {
  items: StorefrontFaqItem[];
}

export interface StorefrontSubscriptionBanner {
  eyebrow: string;
  title: string;
  buttonLabel: string;
}

export interface StorefrontBlogPageContent extends StorefrontSectionHeading {
  newsletterTitle: string;
}

export interface StorefrontCollectionPageContent {
  eyebrow: string;
  subtitle: string;
  emptyStateText: string;
}

export interface StorefrontCartPageContent {
  eyebrow: string;
  title: string;
  shippingNote: string;
  checkoutButtonLabel: string;
  continueShoppingLabel: string;
  browseProductsLabel: string;
  emptyStateText: string;
}

export interface StorefrontBrandingContent {
  announcementText: string;
  brandName: string;
  brandMark: string;
  footerDescription: string;
}

export interface StorefrontContent {
  branding: StorefrontBrandingContent;
  hero: StorefrontHeroContent;
  homeCollections: StorefrontSectionHeading;
  stats: StorefrontStatItem[];
  valueProps: StorefrontValuePropsSection;
  subscriptionBanner: StorefrontSubscriptionBanner;
  testimonials: StorefrontTestimonialsSection;
  journal: StorefrontSectionHeading;
  faq: StorefrontFaqSection;
  homeNewsletterTitle: string;
  blogPage: StorefrontBlogPageContent;
  collectionPage: StorefrontCollectionPageContent;
  cartPage: StorefrontCartPageContent;
}
