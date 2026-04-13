import { useEffect, useRef } from "react";

/**
 * Hook that adds IntersectionObserver-based scroll reveal.
 * Returns a ref to attach to the container element.
 * When the element enters the viewport, it gets the "visible" class added.
 *
 * @param {Object} options
 * @param {string} options.threshold - visibility threshold (0-1), default 0.15
 * @param {string} options.rootMargin - root margin, default "0px 0px -40px 0px"
 */
export function useScrollReveal({ threshold = 0.15, rootMargin = "0px 0px -40px 0px" } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el); // animate only once
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}

/**
 * Hook that observes multiple child elements for staggered reveal.
 * Attach to a parent container. Each direct child will animate in sequence.
 */
export function useStaggerReveal({ threshold = 0.1, rootMargin = "0px 0px -30px 0px" } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}
