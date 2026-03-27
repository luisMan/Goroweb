<template>
  <section class="section-pad">
    <div class="container" v-if="!authReady">
      <p class="empty-state">Checking admin session...</p>
    </div>

    <div class="container admin-auth-shell" v-else-if="!isAuthenticated">
      <SectionHeader
        eyebrow="Admin"
        title="Secure admin login"
        subtitle="Sign in with the server-side credentials stored in your .env file. Access locks after 3 failed attempts."
      />

      <article class="admin-panel admin-auth-panel parallax-card" data-depth="0.018">
        <form class="admin-auth-form" @submit.prevent="submitLogin">
          <label class="admin-field">
            <span>Username</span>
            <input v-model="loginUsername" type="text" autocomplete="username" />
          </label>
          <label class="admin-field">
            <span>Password</span>
            <input v-model="loginPassword" type="password" autocomplete="current-password" />
          </label>
          <button class="btn btn-primary" :disabled="isLoggingIn">
            {{ isLoggingIn ? "Signing In..." : "Sign In" }}
          </button>
        </form>
        <p v-if="authError" class="admin-auth-message">{{ authError }}</p>
      </article>
    </div>

    <div class="container admin-shell" v-else-if="contentDraft">
      <SectionHeader
        eyebrow="Admin"
        title="Edit storefront content and catalog"
        subtitle="Authenticated with server-side credentials. Content and catalog edits still persist in this browser unless you later move them to a database."
      />

      <div class="admin-toolbar parallax-card" data-depth="0.012">
        <div class="admin-toolbar-actions">
          <button class="btn btn-primary" @click="saveContent">Save Content</button>
          <button class="btn btn-ghost" @click="resetContentDraft">Reset Content</button>
          <button class="btn btn-primary" @click="saveProducts">Save Products</button>
          <button class="btn btn-ghost" @click="resetProductDrafts">Reset Products</button>
        </div>
        <div class="admin-toolbar-meta">
          <p class="admin-status">Signed in as {{ authUsername }}</p>
          <button class="btn btn-ghost" @click="handleLogout">Sign Out</button>
          <p v-if="statusMessage" class="admin-status">{{ statusMessage }}</p>
        </div>
      </div>

      <div class="admin-grid">
        <article class="admin-panel parallax-card" data-depth="0.016">
          <h3>Branding</h3>
          <div class="admin-form-grid">
            <label class="admin-field">
              <span>Announcement Bar</span>
              <textarea v-model="contentDraft.branding.announcementText" rows="2"></textarea>
            </label>
            <label class="admin-field">
              <span>Brand Name</span>
              <input v-model="contentDraft.branding.brandName" type="text" />
            </label>
            <label class="admin-field">
              <span>Brand Mark</span>
              <input v-model="contentDraft.branding.brandMark" type="text" maxlength="4" />
            </label>
            <label class="admin-field admin-field-full">
              <span>Footer Description</span>
              <textarea v-model="contentDraft.branding.footerDescription" rows="3"></textarea>
            </label>
          </div>
        </article>

        <article class="admin-panel parallax-card" data-depth="0.02">
          <h3>Hero</h3>
          <div class="admin-form-grid">
            <label class="admin-field">
              <span>Eyebrow</span>
              <input v-model="contentDraft.hero.eyebrow" type="text" />
            </label>
            <label class="admin-field admin-field-full">
              <span>Title</span>
              <textarea v-model="contentDraft.hero.title" rows="2"></textarea>
            </label>
            <label class="admin-field admin-field-full">
              <span>Subtext</span>
              <textarea v-model="contentDraft.hero.subtext" rows="3"></textarea>
            </label>
            <label class="admin-field">
              <span>Primary Button</span>
              <input v-model="contentDraft.hero.primaryCtaLabel" type="text" />
            </label>
            <label class="admin-field">
              <span>Secondary Button</span>
              <input v-model="contentDraft.hero.secondaryCtaLabel" type="text" />
            </label>
            <label class="admin-field">
              <span>Card Label</span>
              <input v-model="contentDraft.hero.cardLabel" type="text" />
            </label>
            <label class="admin-field">
              <span>Card Product</span>
              <input v-model="contentDraft.hero.cardTitle" type="text" />
            </label>
            <label class="admin-field admin-field-full">
              <span>Card Description</span>
              <textarea v-model="contentDraft.hero.cardText" rows="2"></textarea>
            </label>
          </div>
        </article>

        <article class="admin-panel parallax-card" data-depth="0.018">
          <h3>Homepage Sections</h3>
          <div class="admin-form-grid">
            <label class="admin-field">
              <span>Collections Eyebrow</span>
              <input v-model="contentDraft.homeCollections.eyebrow" type="text" />
            </label>
            <label class="admin-field">
              <span>Collections Title</span>
              <input v-model="contentDraft.homeCollections.title" type="text" />
            </label>
            <label class="admin-field">
              <span>Subscription Eyebrow</span>
              <input v-model="contentDraft.subscriptionBanner.eyebrow" type="text" />
            </label>
            <label class="admin-field admin-field-full">
              <span>Subscription Title</span>
              <textarea v-model="contentDraft.subscriptionBanner.title" rows="2"></textarea>
            </label>
            <label class="admin-field">
              <span>Subscription Button</span>
              <input v-model="contentDraft.subscriptionBanner.buttonLabel" type="text" />
            </label>
            <label class="admin-field">
              <span>Journal Eyebrow</span>
              <input v-model="contentDraft.journal.eyebrow" type="text" />
            </label>
            <label class="admin-field">
              <span>Journal Title</span>
              <input v-model="contentDraft.journal.title" type="text" />
            </label>
            <label class="admin-field admin-field-full">
              <span>Homepage Newsletter Title</span>
              <textarea v-model="contentDraft.homeNewsletterTitle" rows="2"></textarea>
            </label>
          </div>
        </article>

        <article class="admin-panel parallax-card" data-depth="0.014">
          <div class="admin-section-head">
            <h3>Stats</h3>
            <button class="btn btn-mini" @click="addStat">Add Stat</button>
          </div>
          <div class="admin-list">
            <div class="admin-item" v-for="(stat, index) in contentDraft.stats" :key="`stat-${index}`">
              <div class="admin-inline-grid">
                <label class="admin-field">
                  <span>Value</span>
                  <input v-model="stat.value" type="text" />
                </label>
                <label class="admin-field">
                  <span>Label</span>
                  <input v-model="stat.label" type="text" />
                </label>
              </div>
              <div class="admin-item-actions">
                <button class="btn btn-mini" @click="removeStat(index)">Remove</button>
              </div>
            </div>
          </div>
        </article>

        <article class="admin-panel parallax-card" data-depth="0.017">
          <div class="admin-section-head">
            <div>
              <h3>Value Props</h3>
              <p class="admin-note">This drives the feature cards under the collection grid.</p>
            </div>
            <button class="btn btn-mini" @click="addValueProp">Add Card</button>
          </div>
          <div class="admin-form-grid">
            <label class="admin-field">
              <span>Section Eyebrow</span>
              <input v-model="contentDraft.valueProps.eyebrow" type="text" />
            </label>
            <label class="admin-field">
              <span>Section Title</span>
              <input v-model="contentDraft.valueProps.title" type="text" />
            </label>
          </div>
          <div class="admin-list">
            <div class="admin-item" v-for="(item, index) in contentDraft.valueProps.items" :key="`prop-${index}`">
              <div class="admin-form-grid">
                <label class="admin-field">
                  <span>Card Title</span>
                  <input v-model="item.title" type="text" />
                </label>
                <label class="admin-field admin-field-full">
                  <span>Card Text</span>
                  <textarea v-model="item.text" rows="3"></textarea>
                </label>
              </div>
              <div class="admin-item-actions">
                <button class="btn btn-mini" @click="removeValueProp(index)">Remove</button>
              </div>
            </div>
          </div>
        </article>

        <article class="admin-panel parallax-card" data-depth="0.018">
          <div class="admin-section-head">
            <div>
              <h3>Testimonials</h3>
              <p class="admin-note">Rotate customer quotes and attribution on the home page.</p>
            </div>
            <button class="btn btn-mini" @click="addTestimonial">Add Testimonial</button>
          </div>
          <div class="admin-form-grid">
            <label class="admin-field">
              <span>Section Eyebrow</span>
              <input v-model="contentDraft.testimonials.eyebrow" type="text" />
            </label>
            <label class="admin-field">
              <span>Section Title</span>
              <input v-model="contentDraft.testimonials.title" type="text" />
            </label>
          </div>
          <div class="admin-list">
            <div
              class="admin-item"
              v-for="(item, index) in contentDraft.testimonials.items"
              :key="`testimonial-${index}`"
            >
              <div class="admin-form-grid">
                <label class="admin-field admin-field-full">
                  <span>Quote</span>
                  <textarea v-model="item.quote" rows="3"></textarea>
                </label>
                <label class="admin-field">
                  <span>Name</span>
                  <input v-model="item.name" type="text" />
                </label>
                <label class="admin-field">
                  <span>Role</span>
                  <input v-model="item.role" type="text" />
                </label>
              </div>
              <div class="admin-item-actions">
                <button class="btn btn-mini" @click="removeTestimonial(index)">Remove</button>
              </div>
            </div>
          </div>
        </article>

        <article class="admin-panel parallax-card" data-depth="0.014">
          <div class="admin-section-head">
            <div>
              <h3>FAQ</h3>
              <p class="admin-note">Keep common answers current without editing the page directly.</p>
            </div>
            <button class="btn btn-mini" @click="addFaq">Add FAQ</button>
          </div>
          <div class="admin-form-grid">
            <label class="admin-field">
              <span>Section Eyebrow</span>
              <input v-model="contentDraft.faq.eyebrow" type="text" />
            </label>
            <label class="admin-field">
              <span>Section Title</span>
              <input v-model="contentDraft.faq.title" type="text" />
            </label>
          </div>
          <div class="admin-list">
            <div class="admin-item" v-for="(item, index) in contentDraft.faq.items" :key="`faq-${index}`">
              <div class="admin-form-grid">
                <label class="admin-field">
                  <span>Question</span>
                  <input v-model="item.question" type="text" />
                </label>
                <label class="admin-field admin-field-full">
                  <span>Answer</span>
                  <textarea v-model="item.answer" rows="3"></textarea>
                </label>
              </div>
              <div class="admin-item-actions">
                <button class="btn btn-mini" @click="removeFaq(index)">Remove</button>
              </div>
            </div>
          </div>
        </article>

        <article class="admin-panel parallax-card" data-depth="0.016">
          <h3>Blog, Collection, and Cart Copy</h3>
          <div class="admin-form-grid">
            <label class="admin-field">
              <span>Blog Eyebrow</span>
              <input v-model="contentDraft.blogPage.eyebrow" type="text" />
            </label>
            <label class="admin-field">
              <span>Blog Title</span>
              <input v-model="contentDraft.blogPage.title" type="text" />
            </label>
            <label class="admin-field admin-field-full">
              <span>Blog Subtitle</span>
              <textarea v-model="contentDraft.blogPage.subtitle" rows="2"></textarea>
            </label>
            <label class="admin-field admin-field-full">
              <span>Blog Newsletter Title</span>
              <textarea v-model="contentDraft.blogPage.newsletterTitle" rows="2"></textarea>
            </label>
            <label class="admin-field">
              <span>Collection Eyebrow</span>
              <input v-model="contentDraft.collectionPage.eyebrow" type="text" />
            </label>
            <label class="admin-field admin-field-full">
              <span>Collection Subtitle</span>
              <textarea v-model="contentDraft.collectionPage.subtitle" rows="2"></textarea>
            </label>
            <label class="admin-field admin-field-full">
              <span>Collection Empty State</span>
              <textarea v-model="contentDraft.collectionPage.emptyStateText" rows="2"></textarea>
            </label>
            <label class="admin-field">
              <span>Cart Eyebrow</span>
              <input v-model="contentDraft.cartPage.eyebrow" type="text" />
            </label>
            <label class="admin-field">
              <span>Cart Title</span>
              <input v-model="contentDraft.cartPage.title" type="text" />
            </label>
            <label class="admin-field admin-field-full">
              <span>Cart Shipping Note</span>
              <textarea v-model="contentDraft.cartPage.shippingNote" rows="2"></textarea>
            </label>
            <label class="admin-field">
              <span>Checkout Button</span>
              <input v-model="contentDraft.cartPage.checkoutButtonLabel" type="text" />
            </label>
            <label class="admin-field">
              <span>Continue Shopping Button</span>
              <input v-model="contentDraft.cartPage.continueShoppingLabel" type="text" />
            </label>
            <label class="admin-field">
              <span>Browse Products Button</span>
              <input v-model="contentDraft.cartPage.browseProductsLabel" type="text" />
            </label>
            <label class="admin-field admin-field-full">
              <span>Cart Empty State</span>
              <textarea v-model="contentDraft.cartPage.emptyStateText" rows="2"></textarea>
            </label>
          </div>
        </article>
      </div>

      <article class="admin-panel admin-panel-products parallax-card" data-depth="0.02">
        <div class="admin-section-head">
          <div>
            <h3>Products</h3>
            <p class="admin-note">Edit the current catalog and add new products. Existing pages will read this saved catalog override.</p>
          </div>
          <button class="btn btn-primary" @click="addProduct">Add Product</button>
        </div>

        <div class="admin-product-list">
          <div class="admin-product-card" v-for="(product, index) in productDrafts" :key="product.localKey">
            <div class="admin-product-head">
              <div>
                <h4>{{ product.title || `Product ${index + 1}` }}</h4>
                <p>{{ product.handle || "new-product" }}</p>
              </div>
              <button class="btn btn-mini" @click="removeProduct(index)">Remove</button>
            </div>

            <div class="admin-form-grid">
              <label class="admin-field">
                <span>Title</span>
                <input v-model="product.title" type="text" @blur="syncProductHandle(product)" />
              </label>
              <label class="admin-field">
                <span>Handle</span>
                <input v-model="product.handle" type="text" />
              </label>
              <label class="admin-field">
                <span>Collection</span>
                <input v-model="product.collection" type="text" />
              </label>
              <label class="admin-field">
                <span>Vendor</span>
                <input v-model="product.vendor" type="text" />
              </label>
              <label class="admin-field">
                <span>Product Type</span>
                <input v-model="product.type" type="text" />
              </label>
              <label class="admin-field">
                <span>Badge</span>
                <input v-model="product.badge" type="text" />
              </label>
              <label class="admin-field">
                <span>Price (Cents)</span>
                <input v-model.number="product.price" type="number" min="0" />
              </label>
              <label class="admin-field">
                <span>Currency</span>
                <input v-model="product.currencyCode" type="text" maxlength="3" />
              </label>
              <label class="admin-field">
                <span>SKU</span>
                <input v-model="product.sku" type="text" />
              </label>
              <label class="admin-field admin-field-full">
                <span>Featured Image URL</span>
                <input v-model="product.featuredImage" type="url" />
              </label>
              <label class="admin-field admin-field-full">
                <span>Gallery Image URLs</span>
                <textarea
                  v-model="product.galleryText"
                  rows="3"
                  placeholder="One URL per line"
                ></textarea>
              </label>
              <label class="admin-field admin-field-full">
                <span>Tags</span>
                <input v-model="product.tagsText" type="text" placeholder="protein, vanilla, organic" />
              </label>
              <label class="admin-field admin-field-checkbox">
                <span>Available</span>
                <input v-model="product.available" type="checkbox" />
              </label>
              <label class="admin-field admin-field-full">
                <span>Description HTML</span>
                <textarea v-model="product.description" rows="4"></textarea>
              </label>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div class="container" v-else>
      <p class="empty-state">Loading admin data...</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import SectionHeader from "../components/common/SectionHeader.vue";
import type { CatalogProduct } from "../contracts/catalog";
import { getAdminSession, loginAdmin, logoutAdmin } from "../services/adminAuth";
import { getCatalogProductsSnapshot, resetCatalogProducts, saveCatalogProducts } from "../services/catalogStore";
import {
  getStorefrontContentSnapshot,
  resetStorefrontContent,
  saveStorefrontContent
} from "../services/storefrontContent";
import type { StorefrontContent } from "../types/content";

interface EditableProductForm {
  localKey: string;
  id: number;
  title: string;
  handle: string;
  collection: string;
  vendor: string;
  type: string;
  badge: string;
  price: number;
  currencyCode: string;
  sku: string;
  featuredImage: string;
  galleryText: string;
  tagsText: string;
  description: string;
  available: boolean;
}

const contentDraft = ref<StorefrontContent | null>(null);
const productDrafts = ref<EditableProductForm[]>([]);
const statusMessage = ref("");
const authReady = ref(false);
const isAuthenticated = ref(false);
const authUsername = ref("");
const loginUsername = ref("");
const loginPassword = ref("");
const isLoggingIn = ref(false);
const authError = ref("");

onMounted(async () => {
  await refreshAdminSession();
});

async function loadDrafts(): Promise<void> {
  contentDraft.value = getStorefrontContentSnapshot();
  productDrafts.value = (await getCatalogProductsSnapshot()).map(toEditableProduct);
}

async function refreshAdminSession(): Promise<void> {
  authReady.value = false;

  const session = await getAdminSession();
  isAuthenticated.value = session.authenticated;
  authUsername.value = session.username ?? "";
  authError.value =
    !session.authenticated && session.error !== "Admin session is not active." ? session.error ?? "" : "";

  if (session.authenticated) {
    await loadDrafts();
  } else {
    contentDraft.value = null;
    productDrafts.value = [];
  }

  authReady.value = true;
}

async function submitLogin(): Promise<void> {
  isLoggingIn.value = true;
  authError.value = "";
  statusMessage.value = "";

  const result = await loginAdmin(loginUsername.value, loginPassword.value);

  if (result.authenticated) {
    isAuthenticated.value = true;
    authUsername.value = result.username ?? loginUsername.value.trim();
    loginPassword.value = "";
    await loadDrafts();
    statusMessage.value = "Admin session started.";
  } else {
    isAuthenticated.value = false;
    authError.value = result.error ?? "Unable to sign in.";
  }

  authReady.value = true;
  isLoggingIn.value = false;
}

async function handleLogout(): Promise<void> {
  await logoutAdmin();
  isAuthenticated.value = false;
  authUsername.value = "";
  contentDraft.value = null;
  productDrafts.value = [];
  loginPassword.value = "";
  authError.value = "";
  statusMessage.value = "Admin session ended.";
}

function addStat(): void {
  contentDraft.value?.stats.push({ value: "", label: "" });
}

function removeStat(index: number): void {
  contentDraft.value?.stats.splice(index, 1);
}

function addValueProp(): void {
  contentDraft.value?.valueProps.items.push({ title: "", text: "" });
}

function removeValueProp(index: number): void {
  contentDraft.value?.valueProps.items.splice(index, 1);
}

function addTestimonial(): void {
  contentDraft.value?.testimonials.items.push({ quote: "", name: "", role: "" });
}

function removeTestimonial(index: number): void {
  contentDraft.value?.testimonials.items.splice(index, 1);
}

function addFaq(): void {
  contentDraft.value?.faq.items.push({
    id: Date.now(),
    question: "",
    answer: ""
  });
}

function removeFaq(index: number): void {
  contentDraft.value?.faq.items.splice(index, 1);
}

function addProduct(): void {
  productDrafts.value.unshift({
    localKey: `new-${Date.now()}`,
    id: 0,
    title: "",
    handle: "",
    collection: "All",
    vendor: "BirdFuel",
    type: "Core Series",
    badge: "Featured",
    price: 0,
    currencyCode: "MXN",
    sku: "",
    featuredImage: "",
    galleryText: "",
    tagsText: "",
    description: "<p>New product description.</p>",
    available: true
  });
}

function removeProduct(index: number): void {
  productDrafts.value.splice(index, 1);
}

function syncProductHandle(product: EditableProductForm): void {
  if (!product.handle.trim()) {
    product.handle = slugify(product.title);
  } else {
    product.handle = slugify(product.handle);
  }
}

function saveContent(): void {
  if (!contentDraft.value) return;

  saveStorefrontContent(contentDraft.value);
  contentDraft.value = getStorefrontContentSnapshot();
  statusMessage.value = "Storefront content saved to local storage.";
}

function resetContentDraft(): void {
  resetStorefrontContent();
  contentDraft.value = getStorefrontContentSnapshot();
  statusMessage.value = "Storefront content reset to defaults.";
}

function saveProducts(): void {
  if (!productDrafts.value.length) {
    statusMessage.value = "Catalog must contain at least one product before it can be saved.";
    return;
  }

  const savedProducts = saveCatalogProducts(productDrafts.value.map(toCatalogProduct));
  productDrafts.value = savedProducts.map(toEditableProduct);
  statusMessage.value = "Catalog saved to local storage.";
}

async function resetProductDrafts(): Promise<void> {
  const defaultProducts = await resetCatalogProducts();
  productDrafts.value = defaultProducts.map(toEditableProduct);
  statusMessage.value = "Catalog reset to the default dataset.";
}

function toEditableProduct(product: CatalogProduct): EditableProductForm {
  return {
    localKey: `${product.id}-${product.handle}`,
    id: product.id,
    title: product.title,
    handle: product.handle,
    collection: product.collection ?? "All",
    vendor: product.vendor,
    type: product.type,
    badge: product.badge ?? "Featured",
    price: product.price,
    currencyCode: product.currency_code ?? "MXN",
    sku: product.variants[0]?.sku ?? "",
    featuredImage: product.featured_image,
    galleryText: product.images.join("\n"),
    tagsText: product.tags.join(", "),
    description: product.description,
    available: product.available
  };
}

function toCatalogProduct(product: EditableProductForm): CatalogProduct {
  const handle = slugify(product.handle || product.title);
  const featuredImage = product.featuredImage.trim();
  const gallery = [featuredImage, ...splitLines(product.galleryText)];

  return {
    id: product.id,
    title: product.title.trim(),
    handle,
    description: product.description.trim(),
    vendor: product.vendor.trim(),
    type: product.type.trim(),
    tags: splitCommaList(product.tagsText),
    price: Number(product.price) || 0,
    available: product.available,
    variants: [
      {
        id: 0,
        title: "Default Title",
        sku: product.sku.trim() || handle.toUpperCase(),
        available: product.available,
        price: Number(product.price) || 0
      }
    ],
    images: gallery.filter(Boolean),
    featured_image: featuredImage,
    options: [
      {
        name: "Title",
        values: ["Default Title"]
      }
    ],
    collection: product.collection.trim() || "All",
    collection_handle: slugify(product.collection),
    badge: product.badge.trim() || "Featured",
    currency_code: product.currencyCode.trim().toUpperCase() || "MXN"
  };
}

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function splitCommaList(value: string): string[] {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function slugify(value: string): string {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
</script>
