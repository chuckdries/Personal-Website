import * as React from "react";
import classNames from "classnames";
import Checkmark from "@spectrum-icons/workflow/Checkmark";
import { Link } from "gatsby";

interface KeywordsPickerProps {
  keywords: string[];
  value: string | null;
  onChange: (val: string | null) => void;
}
const KeywordsPicker = ({ keywords, value, onChange }: KeywordsPickerProps) => {
  return (
    <div className="mx-2 mt-2">
      <span className="text-xs text-black">
        Collections
      </span>
      <ul className="flex gap-1 flex-wrap mt-1 mb-2">
        {keywords.map((keyword) => {
          const selected = value === keyword;
          return (
            <li key={keyword}>
              <Link
                className={classNames(
                  `py-[5px] px-3 rounded-full text-sm block`,
                  `text-black border border-gray-400`,
                  selected
                    ? "bg-black/10 font-bold"
                    : `bg-white
                    hover:bg-black/10`
                )}
                to={selected ? '/photogallery/' : `?filter=${encodeURIComponent(keyword)}`}
                // onClick={() => (selected ? onChange(null) : onChange(keyword))}
              >
                {keyword}{" "}
                {/* {selected && (
                  <Checkmark
                    UNSAFE_className="mx-1"
                    UNSAFE_style={{ width: "15px" }}
                    aria-hidden="true"
                  />
                )} */}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default KeywordsPicker;
