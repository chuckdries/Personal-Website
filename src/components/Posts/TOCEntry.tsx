import classNames from "classnames";
import React, { useEffect, useMemo } from "react";
import { useId } from "react-aria";

export interface TOCEntry {
  url: string;
  title: string;
  items?: TOCEntry[];
}

export function TocEntry({
  url,
  title,
  isActive,
  onTargetScrollIntoView,
}: TOCEntry & {
  isActive: boolean;
  onTargetScrollIntoView: (url: string) => void;
}) {
  const id = useId();
  const realId = useMemo(() => url.replace("#", ""), [url]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.target.id === realId && entry.isIntersecting) {
            onTargetScrollIntoView(url);
            document.getElementById(id)!.scrollIntoView({ 
              behavior: 'smooth',
            })
          }
        });
      },
      {
        threshold: 0.5,
      },
    );
    const target = document.getElementById(realId)!;
    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [id, url, realId, onTargetScrollIntoView]);
  return (
    <a
      className={classNames(
        "text-black shrink-0 px-2",
        isActive && "font-bold",
      )}
      href={url}
      id={id}
    >
      {title}
    </a>
  );
}
