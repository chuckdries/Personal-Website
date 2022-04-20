import { useRef, useEffect, useCallback, RefObject, useState, useMemo } from 'react';
import { isSSR, getRefElement } from './utils';
import { throttle } from 'throttle-debounce';

interface UseEventListener {
  type: keyof DocumentEventMap;
  listener: EventListener;
  element?: RefObject<Element> | Document | Window | null;
  options?: AddEventListenerOptions;
}

export const useEventListener = ({
  type,
  listener,
  element = isSSR ? undefined : window,
  options
}: UseEventListener): void => {
  const savedListener = useRef<EventListener>();

  useEffect(() => {
    savedListener.current = listener;
  }, [listener]);

  const handleEventListener = useCallback((event: Event) => {
    savedListener.current?.(event);
  }, []);

  useEffect(() => {
    const target = getRefElement(element);
    target?.addEventListener(type, handleEventListener, options);
    return () => target?.removeEventListener(type, handleEventListener);
  }, [type, element, options, handleEventListener]);
};


interface Scroll {
  y?: number;
  x?: number;
  direction?: 'up' | 'right' | 'down' | 'left';
}

interface UseScroll {
  wait?: number;
  element?: RefObject<Element> | Window | null;
}

export const useScroll = (options?: UseScroll): Scroll => {
  const { wait, element } = useMemo<UseScroll>(
    () => ({
      wait: 250,
      element: isSSR ? undefined : window,
      ...options
    }),
    [options]
  );

  const getScrollOffset = useCallback(
    (direction: 'y' | 'x') => {
      const target = getRefElement(element);

      if (isSSR || !target) {
        return undefined;
      }

      if ('window' in target) {
        return direction === 'y' ? target.pageYOffset : target.pageXOffset;
      }

      if ('nodeType' in target) {
        return direction === 'y' ? target.scrollTop : target.scrollLeft;
      }
    },
    [element]
  );

  const [scroll, setScroll] = useState<Scroll>({
    y: getScrollOffset('y'),
    x: getScrollOffset('x'),
    direction: undefined
  });

  const setDirection = useCallback(
    ({ y, x }: Scroll) => {
      const yOffset = getScrollOffset('y');
      const xOffset = getScrollOffset('x');

      if (
        y !== undefined &&
        x !== undefined &&
        yOffset !== undefined &&
        xOffset !== undefined
      ) {
        if (y > yOffset) return 'up';
        if (y < yOffset) return 'down';
        if (x > xOffset) return 'left';
        if (x < xOffset) return 'right';
      }
    },
    [getScrollOffset]
  );

  const scrollFunc = useCallback(() => {
    const yOffset = getScrollOffset('y');
    const xOffset = getScrollOffset('x');

    setScroll((prev) => ({
      y: yOffset,
      x: xOffset,
      direction: setDirection(prev)
    }));
  }, [getScrollOffset, setDirection]);

  const handleScroll = useMemo(
    () =>
      wait && wait !== 0 ? throttle(wait, () => scrollFunc()) : () => scrollFunc(),
    [wait, scrollFunc]
  );

  useEventListener({
    type: 'scroll',
    listener: handleScroll,
    element,
    options: { passive: true }
  });

  return scroll;
};
