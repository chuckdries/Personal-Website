import React from "react";
import { SiblingNavData } from "../PhotoImage";
import classNames from "classnames";
import ChevronLeft from "@spectrum-icons/workflow/ChevronLeft";
import ChevronRight from "@spectrum-icons/workflow/ChevronRight";
import { Link } from "gatsby";

const IconStyle = {
  width: "24px",
  margin: "0 4px",
};

export function OverlayNavArrow({
  navData,
  direction,
  show
}: {
  navData: SiblingNavData | null;
  direction: "left" | "right";
  show: boolean;
}) {
  if (!navData) {
    return <div></div>;
  }
  return (
    <Link
      className={classNames(
        show ? "opacity-70" : 'opacity-0',
        "px-4 flex items-center  h-full z-10",
        "text-white backdrop-blur-sm  transition",
        "hover:opacity-100 hover:backdrop-blur-md hover:bg-black/20",
        "hover-none:pt-2"
      )}
      replace
      state={navData.state}
      to={navData.next}
    >
      {direction === "left" ? (
        <ChevronLeft UNSAFE_style={IconStyle} />
      ) : (
        <ChevronRight UNSAFE_style={IconStyle} />
      )}
    </Link>
  );
}
