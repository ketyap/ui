"use client";

import { useCallback, useEffect, useState } from "react";

export const useMeasure = <T extends HTMLElement = HTMLDivElement>() => {
  const [element, setElement] = useState<T | null>(null);
  const [size, setSize] = useState({ height: 0, width: 0 });
  const ref = useCallback((node: T | null) => {
    setElement(node);
  }, []);
  useEffect(() => {
    if (!element) {
      return;
    }
    const update = () => {
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      setSize((previous) =>
        previous.width === width && previous.height === height
          ? previous
          : { height, width }
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
  return { ref, ...size };
};
