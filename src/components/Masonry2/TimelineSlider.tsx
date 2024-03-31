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

export function TimelineSlider(props: AriaSliderProps & TimelineSliderProps) {
  let trackRef = React.useRef<HTMLDivElement>(null);
  let numberFormatter = useNumberFormatter();
  let state = useSliderState({
    ...props,
    orientation: "vertical",
    numberFormatter,
  });
  console.log("🚀 ~ TimelineSlider ~ state:", state);
  let { groupProps, trackProps, labelProps, outputProps } = useSlider(
    {
      ...props,
      orientation: "vertical",
    },
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
      {/* Create a container for the label and output element. */}
      {/* {props.label &&
        (
          <div className="label-container">
            <label {...labelProps}>{props.label}</label>
            <output {...outputProps}>
              {state.getThumbValueLabel(0)}
            </output>
          </div>
        )} */}
      {/* The track element holds the visible track line and the thumb. */}
      <div className="h-full w-full relative">
        <div
          {...trackProps}
          ref={trackRef}
          // className={`track ${state.isDisabled ? 'disabled' : ''}`}
          className="relative h-full w-full translate-x-[30px] z-10"
        >
          <Thumb
            index={0}
            state={state}
            trackRef={trackRef}
            name={props.name}
          />
        </div>
        <div className="absolute top-0 bottom-0 right-0 left-0">
          {props.stops.map((stop, i) => (
            <div
              key={stop.slug}
              style={{
                top: `${(i / (props.stops.length + 1)) * 100}%`,
                right: 10,
              }}
              className={classNames(
                "text-white/60 absolute select-none w-full flex items-baseline justify-end",
                // stop.emphasis == 1 ? "font-bold text-sm" : "text-xs",
                "text-xs"
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
  console.log("🚀 ~ Thumb ~ state:", state);
  let inputRef = React.useRef(null);
  let { thumbProps, inputProps, isDragging } = useSliderThumb(
    {
      index,
      trackRef,
      inputRef,
      name,
    },
    state,
  );
  console.log("🚀 ~ Thumb ~ thumbProps:", thumbProps);

  let { focusProps, isFocusVisible } = useFocusRing();
  return (
    <div
      {...thumbProps}
      className="w-7 h-2 right-0 translate-y-[50%] relative bg-white rounded-full"
      // className={`thumb ${isFocusVisible ? 'focus' : ''} ${
      //   isDragging ? 'dragging' : ''
      // }`}
    >
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
    </div>
  );
}

// export function RACTimelineSlider({ stops }: TimelineSliderProps) {
//   const { observe, width, height } = useDimensions();
//   return (
//     <div className="h-full w-full" ref={observe}>
//       <Slider
//         orientation="vertical"
//         defaultValue={30}
//         className="h-full w-full"
//       >
//         {/* <div className="flex text-white">
//           <Label className="flex-1">Opacity</Label>
//           <SliderOutput />
//         </div> */}
//         <SliderTrack className="relative h-full w-7 flex flex-col items-end">
//           {({ state }) => (
//             <>
//               {/* track */}
//               <div className="absolute right-[2px] h-full top-[50%] translate-y-[-50%] w-2 border-l-2 border-dashed border-white/40" />
//               {/* fill */}
//               {/* <div
//                 className="absolute h-2 top-[50%] translate-y-[-50%] rounded-full bg-white"
//                 style={{ width: state.getThumbPercent(0) * 100 + "%" }}
//               /> */}
//               <SliderThumb className="h-3 w-7 top-[50%] right-[-60%] bg-white rounded-full transition outline-none focus-visible:ring-2 ring-blue-500" />
//             </>
//           )}
//         </SliderTrack>
//       </Slider>
//     </div>
//   );
// }
