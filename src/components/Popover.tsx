import type { OverlayTriggerState } from "react-stately";
import type { AriaPopoverProps } from "@react-aria/overlays";
import * as React from "react";
import { usePopover, DismissButton, Overlay } from "@react-aria/overlays";

interface PopoverProps extends Omit<AriaPopoverProps, "popoverRef"> {
  children: React.ReactNode;
  state: OverlayTriggerState;
  className?: string;
  popoverRef?: React.RefObject<HTMLDivElement>;
}

export function Popover(props: PopoverProps) {
  let ref = React.useRef<HTMLDivElement>(null);
  let { popoverRef = ref, state, children, className, isNonModal } = props;

  let { popoverProps, underlayProps } = usePopover(
    {
      ...props,
      popoverRef
    },
    state
  );

  return (
    <Overlay>
      {!isNonModal && <div {...underlayProps} className="fixed inset-0" />}
      <div
        {...popoverProps}
        className={`z-10 shadow border-gray-400 bg-white/70 backdrop-blur-lg rounded-xl overflow-hidden mt-1 ${className}`}
        ref={popoverRef}
      >
        {!isNonModal && <DismissButton onDismiss={state.close} />}
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
}
