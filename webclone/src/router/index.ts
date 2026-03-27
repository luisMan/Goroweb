import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import CollectionPage from "../pages/CollectionPage.vue";
import ProductDetailPage from "../pages/ProductDetailPage.vue";
import CartPage from "../pages/CartPage.vue";
import BlogPage from "../pages/BlogPage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage
    },
    {
      path: "/collections/:handle?",
      name: "collection",
      component: CollectionPage,
      props: true
    },
    {
      path: "/products/:handle",
      name: "product-detail",
      component: ProductDetailPage,
      props: true
    },
    {
      path: "/cart",
      name: "cart",
      component: CartPage
    },
    {
      path: "/blog",
      name: "blog",
      component: BlogPage
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFoundPage
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;

