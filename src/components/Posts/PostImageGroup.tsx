import React, { useEffect, useRef, useState } from "react";
import useDimensions from "react-cool-dimensions";

interface PostImageGroupProps {
  children: React.ReactNode;
  label: React.ReactNode;
}

export function PostImageGroup({ children, label }: PostImageGroupProps) {
  const {
    observe: observeChildren,
    height: childrenHeight,
    width: containerWidth,
  } = useDimensions();
  const observeInner = useRef<HTMLDivElement>(null);
  const [showScrollPrompt, setScrollPrompt] = useState(false);

  useEffect(() => {
    if (!observeInner.current) {
      return;
    }
    if (observeInner.current?.scrollWidth > observeInner.current?.clientWidth) {
      setScrollPrompt(true);
    } else {
      setScrollPrompt(false);
    }
  }, [containerWidth]);

  return (
    <div style={{ height: childrenHeight ? childrenHeight : '80vh' }}>
      {/* <div className="h-screen"> */}
      <div
        className="justify-center w-screen absolute left-0 right-0 flex overflow-y-hidden"
        ref={observeChildren}
      >
        <div
          className="flex flex-nowrap items-center overflow-x-auto w-fit px-3 lg:px-6 gap-6 pb-2"
          ref={observeInner}
        >
          {showScrollPrompt && <p className="text-nowrap lg:mx-[3vw]">scroll &rarr;</p>}
          {/* <p>{innerWidth} &gt; {containerWidth}</p> */}
          {children}
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
