import React from "react";
import useDimensions from "react-cool-dimensions";

interface PostImageGroupProps {
  children: React.ReactNode;
  label: React.ReactNode;
}

export function PostImageGroup({ children, label }: PostImageGroupProps) {
  const { observe: observeChildren, height: childrenHeight, width: containerWidth } = useDimensions();
  const {observe: observeInner, width: innerWidth} = useDimensions()
  return (
    <div style={{ height: `calc(${childrenHeight}px + 4em)` }}>
      {/* <div className="h-screen"> */}
      <div
        className="justify-center w-screen absolute left-0 right-0 flex  overflow-y-hidden"
        ref={observeChildren}
      >
        <div className="flex flex-nowrap items-center overflow-x-auto w-fit px-2 lg:px-6 gap-6" ref={observeInner}>
          <p className="text-nowrap">scroll &rarr;</p>
          {/* <p>{innerWidth} &gt; {containerWidth}</p> */}
          {children}
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
