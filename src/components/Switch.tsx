import * as React from "react";
import { useToggleState } from "react-stately";
import {
  AriaSwitchProps,
  useFocusRing,
  useSwitch,
  VisuallyHidden,
} from "react-aria";

export function Switch(props: AriaSwitchProps) {
  let state = useToggleState(props);
  let ref = React.useRef<HTMLInputElement>(null);
  let { inputProps } = useSwitch(props, state, ref);
  let { isFocusVisible, focusProps } = useFocusRing();

  return (
    <label
      className="text-sm p-[3px]"
      style={{
        display: "flex",
        alignItems: "center",
        opacity: props.isDisabled ? 0.4 : 1,
      }}
    >
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      <svg
        aria-hidden="true"
        className="flex-shrink-0"
        height={24}
        style={{ marginRight: 4 }}
        width={40}
      >
        <rect
          fill={state.isSelected ? "green" : "gray"}
          height={16}
          rx={8}
          width={32}
          x={4}
          y={4}
        />
        <circle cx={state.isSelected ? 28 : 12} cy={12} fill="white" r={5} />
        {isFocusVisible && (
          <rect
            fill="none"
            height={22}
            rx={11}
            stroke="green"
            strokeWidth={2}
            width={38}
            x={1}
            y={1}
          />
        )}
      </svg>
      {props.children}
    </label>
  );
}
