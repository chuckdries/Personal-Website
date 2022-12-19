import * as React from "react";
import classNames from "classnames";
import Checkmark from "@spectrum-icons/workflow/Checkmark";

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
              <button
                className={classNames(
                  `py-[5px] px-3 rounded-full`,
                  `text-black border border-black`,
                  selected
                    ? "bg-transparentblack font-bold"
                    : `bg-white
                    hover:bg-transparentblack`
                )}
                onClick={() => (selected ? onChange(null) : onChange(keyword))}
                type="button"
              >
                {keyword}{" "}
                {/* {selected && (
                  <Checkmark
                    UNSAFE_className="mx-1"
                    UNSAFE_style={{ width: "15px" }}
                    aria-hidden="true"
                  />
                )} */}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default KeywordsPicker;
