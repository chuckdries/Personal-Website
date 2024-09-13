import React, { useCallback, useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";

import { SiblingNavDatas } from "../PhotoImage";
import { OverlayNavArrow } from "./OverlayNavArrow";

export function NavArrowOverlay({
  siblingNavDatas,
}: {
  siblingNavDatas: SiblingNavDatas;
}) {
  const [show, setShow] = useState(true);
  const timeout = useRef<number | undefined>(undefined);
  // it's my website I do what I want
  // eslint-disable-next-line
  const debouncedSetTimeout = useCallback(
    debounce(() => {
      timeout.current = window.setTimeout(() => {
        setShow(false);
      }, 800);
    }),
    [],
  );
  const tick = useCallback(() => {
    if (!show) {
      setShow(true);
    }
    window.clearTimeout(timeout.current);
    debouncedSetTimeout();
  }, [debouncedSetTimeout, show]);


  useEffect(() => {
    debouncedSetTimeout();
    return () => {
      clearTimeout(timeout.current);
    };
  }, [debouncedSetTimeout]);
  return (
    <div
      className="absolute flex items-stretch justify-between"
      onMouseMove={tick}
      style={{ top: 0, right: 0, bottom: 0, left: 0 }}
    >
      <OverlayNavArrow
        direction="left"
        navData={siblingNavDatas?.left ?? null}
        show={show}
      />
      <OverlayNavArrow
        direction="right"
        navData={siblingNavDatas?.right ?? null}
        show={show}
      />
    </div>
  );
}
