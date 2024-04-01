import React, { useState } from "react";
// import {
//   Label,
//   Slider,
//   SliderOutput,
//   SliderThumb,
//   SliderTrack,
// } from "react-aria-components";
import useDimensions from "react-cool-dimensions";
import { useSliderState } from "react-stately";
import {
  AriaSliderProps,
  mergeProps,
  useFocusRing,
  useNumberFormatter,
  useSlider,
  useSliderThumb,
  VisuallyHidden,
} from "react-aria";
import { useResizeObserver } from "@react-aria/utils";
import classNames from "classnames";

export interface TimelineStop {
  slug: string;
  emphasis: number;
}

interface TimelineSliderProps {
  stops: TimelineStop[];
}

export function TimelineSlider({ stops }: TimelineSliderProps) {
  const props: AriaSliderProps = {
    orientation: "vertical",
    minValue: 0,
    maxValue: 1000,
    step: 1,
  };
  let trackRef = React.useRef<HTMLDivElement>(null);
  let numberFormatter = useNumberFormatter();
  let state = useSliderState({
    ...props,
    numberFormatter,
  });
  let { groupProps, trackProps, labelProps, outputProps } = useSlider(
    props,
    state,
    trackRef,
  );

  const [height, setHeight] = useState(0);
  useResizeObserver({
    ref: trackRef,
    onResize: () => {
      trackRef.current &&
        setHeight(trackRef.current.getBoundingClientRect().height);
    },
  });

  return (
    <div {...groupProps} className={`h-full w-full py-6 relative`}>
      {/* The track element holds the visible track line and the thumb. */}
      <div className="h-full w-full relative">
        <div
          {...trackProps}
          ref={trackRef}
          // className={`track ${state.isDisabled ? 'disabled' : ''}`}
          className="relative h-full w-full z-10"
        >
          <Thumb
            index={0}
            state={state}
            trackRef={trackRef}
            name={props.name}
          />
        </div>
        <div className="absolute top-0 bottom-0 right-0 left-0">
          {stops.map((stop, i) => (
            <div
              key={stop.slug}
              style={{
                top: `${(i / (stops.length)) * 100}%`,
                right: 10,
              }}
              className={classNames(
                "text-white/60 absolute select-none w-full flex items-baseline justify-end",
                // stop.emphasis == 1 ? "font-bold text-sm" : "text-xs",
                "text-xs",
              )}
            >
              {stop.slug} &bull;
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Thumb(props) {
  let { state, trackRef, index, name } = props;
  let inputRef = React.useRef(null);
  let {
    thumbProps: { style, ...thumbProps },
    inputProps,
    isDragging,
  } = useSliderThumb(
    {
      index,
      trackRef,
      inputRef,
      name,
    },
    state,
  );

  let { focusProps, isFocusVisible } = useFocusRing();
  return (
    <div
      {...thumbProps}
      style={{
        top: `${100 - state.getThumbPercent(index) * 100}%`,
      }}
      className="absolute right-0 translate-x-[10px] w-7 h-2 bg-white rounded-full"
    >
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
    </div>
  );
}
