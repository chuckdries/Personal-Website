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
      className="text-sm p-2"
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
        className="flex-shrink-0"
        width={40}
        height={24}
        aria-hidden="true"
        style={{ marginRight: 4 }}
      >
        <rect
          x={4}
          y={4}
          width={32}
          height={16}
          rx={8}
          fill={state.isSelected ? "orange" : "gray"}
        />
        <circle cx={state.isSelected ? 28 : 12} cy={12} r={5} fill="white" />
        {isFocusVisible && (
          <rect
            x={1}
            y={1}
            width={38}
            height={22}
            rx={11}
            fill="none"
            stroke="orange"
            strokeWidth={2}
          />
        )}
      </svg>
      {props.children}
    </label>
  );
}
