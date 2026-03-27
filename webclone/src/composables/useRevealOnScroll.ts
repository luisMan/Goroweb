import { onMounted, onBeforeUnmount } from "vue";

export function useRevealOnScroll(selector = ".reveal"): void {
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    const elements = document.querySelectorAll(selector);
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.16 }
    );

    elements.forEach((element) => observer?.observe(element));
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
  });
}

