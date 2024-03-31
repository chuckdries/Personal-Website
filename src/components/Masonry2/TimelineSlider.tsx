import React from "react";
import {
  Label,
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";
import useDimensions from "react-cool-dimensions";

export interface TimelineStop {
  slug: string;
  emphasis: number;
}

interface TimelineSliderProps {
  stops: TimelineStop[];
}

export function TimelineSlider({ stops }: TimelineSliderProps) {
  const { observe, width, height } = useDimensions();
  return (
    <div className="h-full w-full" ref={observe}>
      <Slider
        orientation="vertical"
        defaultValue={30}
        className="h-full w-full"
      >
        {/* <div className="flex text-white">
          <Label className="flex-1">Opacity</Label>
          <SliderOutput />
        </div> */}
        <SliderTrack className="relative h-full w-7 flex flex-col items-end">
          {({ state }) => (
            <>
              {/* track */}
              <div className="absolute right-[2px] h-full top-[50%] translate-y-[-50%] w-2 border-l-2 border-dashed border-white/40" />
              {/* fill */}
              {/* <div
                className="absolute h-2 top-[50%] translate-y-[-50%] rounded-full bg-white"
                style={{ width: state.getThumbPercent(0) * 100 + "%" }}
              /> */}
              <SliderThumb className="h-3 w-7 top-[50%] right-[-60%] bg-white rounded-full transition outline-none focus-visible:ring-2 ring-blue-500" />
            </>
          )}
        </SliderTrack>
      </Slider>
    </div>
  );
}
