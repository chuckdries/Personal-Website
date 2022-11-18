import * as React from "react";
import type { AriaSelectProps } from "@react-types/select";
import { useSelectState } from "react-stately";
import {
  useSelect,
  HiddenSelect,
  useButton,
  mergeProps,
  useFocusRing,
} from "react-aria";
import ChevronDown from "@spectrum-icons/workflow/ChevronDown";

import { ListBox } from "./ListBox";
import { Popover } from "./Popover";

export { Item } from "react-stately";

export function Select<T extends object>(props: AriaSelectProps<T>) {
  // Create state based on the incoming props
  let state = useSelectState(props);

  // Get props for child elements from useSelect
  let ref = React.useRef(null);
  let { labelProps, triggerProps, valueProps, menuProps } = useSelect(
    props,
    state,
    ref
  );

  // Get props for the button based on the trigger props from useSelect
  let { buttonProps } = useButton(triggerProps, ref);

  let { focusProps, isFocusVisible } = useFocusRing();

  return (
    <div className="inline-flex flex-col relative">
      <div
        {...labelProps}
        className="block text-xs text-left cursor-default mb-1"
      >
        {props.label}
      </div>
      <HiddenSelect
        label={props.label}
        name={props.name}
        state={state}
        triggerRef={ref}
      />
      <button
        {...mergeProps(buttonProps, focusProps)}
        className={`py-[5px] px-3 w-[150px] flex flex-row items-center justify-between overflow-hidden cursor-default rounded border hover:bg-transparentblack ${
          isFocusVisible ? "border-green-500" : "border-black"
        } ${state.isOpen ? "bg-gray-100" : "bg-white"}`}
        ref={ref}
      >
        <span
          {...valueProps}
          className="text-sm"
        >
          {state.selectedItem
            ? state.selectedItem.rendered
            : "Select an option"}
        </span>
        <ChevronDown
          UNSAFE_className="mx-1"
          UNSAFE_style={{
            width: "15px",
          }}
        />
      </button>
      {state.isOpen && (
        <Popover
          className="w-[150px]"
          placement="bottom start"
          state={state}
          triggerRef={ref}
        >
          <ListBox {...menuProps} state={state} />
        </Popover>
      )}
    </div>
  );
}
