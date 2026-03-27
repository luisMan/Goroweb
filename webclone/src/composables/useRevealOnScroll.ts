import { onMounted, onBeforeUnmount } from "vue";

export function useRevealOnScroll(selector = ".reveal"): void {
  let observer: IntersectionObserver | null = null;
  let mutationObserver: MutationObserver | null = null;

  function observeElements() {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      // Avoid re-observing if already in view
      if (!el.classList.contains("in-view")) {
        observer?.observe(el);
      }
    });
  }

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer?.unobserve(entry.target); // No need to observe after revealing
          }
        });
      },
      { threshold: 0.16 }
    );

    // Initial observation
    observeElements();

    // Watch for new elements being added to the DOM
    mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    mutationObserver?.disconnect();
  });
}

