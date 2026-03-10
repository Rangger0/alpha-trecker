import { useEffect, useRef, useState } from "react";

interface UseDeferredVisibilityOptions {
  minDelay?: number;
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
}

export function useDeferredVisibility<T extends HTMLElement>({
  minDelay = 0,
  rootMargin = "220px 0px",
  threshold = 0.08,
  once = true,
}: UseDeferredVisibilityOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    if (isVisible && once) return undefined;

    let timeoutId: number | undefined;

    const reveal = () => {
      if (timeoutId !== undefined) return;
      timeoutId = window.setTimeout(() => {
        setIsVisible(true);
      }, minDelay);
    };

    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      reveal();
      return () => {
        if (timeoutId !== undefined) {
          window.clearTimeout(timeoutId);
        }
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;

        if (entry.isIntersecting) {
          reveal();
          if (once) observer.disconnect();
          return;
        }

        if (!once) {
          if (timeoutId !== undefined) {
            window.clearTimeout(timeoutId);
            timeoutId = undefined;
          }
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isVisible, minDelay, once, rootMargin, threshold]);

  return { ref, isVisible };
}
