import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, [isClient]);

  useEffect(() => {
    if (!observeInner.current || !isClient) {
      return;
    }
    if (observeInner.current?.scrollWidth > observeInner.current?.clientWidth) {
      setScrollPrompt(true);
    } else {
      setScrollPrompt(false);
    }
  }, [containerWidth, isClient]);

  return (
    <div style={{ height: childrenHeight ? childrenHeight : "90vh" }}>
      {/* <div className="h-screen"> */}
      <div
        className="justify-center absolute left-0 right-0 flex overflow-y-hidden"
        ref={observeChildren}
      >
        <div
          className="flex flex-nowrap items-center overflow-x-auto w-fit pr-3 lg:pr-6 gap-6 pb-2"
          ref={observeInner}
        >
          {showScrollPrompt && (
            <p className="text-nowrap lg:text-lg lg:mr-6 pr-3 pl-6 lg:pl-8 py-8 italic opacity-40 bg-[var(--tw-prose-body)] text-white rounded-r-full">
              <span className="pointer-coarse:hidden">scroll &rarr;</span><span className="pointer-fine:hidden">swipe &larr;</span>
            </p>
          )}
          {/* <p>{innerWidth} &gt; {containerWidth}</p> */}
          {children}
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
