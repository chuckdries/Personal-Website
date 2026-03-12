import React from "react";
import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface SiblingNavData {
  next: string;
  state: {
    context: string[];
    selfIndex: number;
  };
}

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
    <a
      className={classNames(
        show ? "opacity-70" : 'opacity-0',
        "px-4 flex items-center  h-full z-10",
        "text-black/20 backdrop-blur-0  transition",
        "hover:opacity-100 hover:backdrop-blur hover:bg-black/20 hover:text-black",
        "hover-none:pt-2"
      )}
      href={navData.next}
      onClick={(e) => {
        e.preventDefault();
        window.history.pushState(navData.state, "", navData.next);
        window.location.href = navData.next;
      }}
    >
      {direction === "left" ? (
        <ChevronLeft />
      ) : (
        <ChevronRight />
      )}
    </a>
  );
}
