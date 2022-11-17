import * as React from "react";
import classNames from "classnames";

interface KeywordsPickerProps {
  keywords: string[];
  value: string | null;
  onChange: (val: string | null) => void;
}
const KeywordsPicker = ({ keywords, value, onChange }: KeywordsPickerProps) => {
  return (
    <div className="mx-2 mt-2">
      <span className="text-xs text-[var(--spectrum-fieldlabel-text-color,var(--spectrum-alias-label-text-color))]">
        Collections
      </span>
      <ul className="flex gap-1 flex-wrap mt-1 mb-2">
        {keywords.map((keyword) => {
          const selected = value === keyword;
          return (
            <li key={keyword}>
              <button
                className={classNames(
                  "transition",
                  `py-[5px] px-3 rounded-full`,
                  `text-[var(--spectrum-fieldbutton-text-color,var(--spectrum-alias-text-color))]

                   border border-[var(--spectrum-fieldbutton-border-color,var(--spectrum-alias-border-color))]`,
                  selected
                    ? "bg-green-500 hover:bg-green-300"
                    : `bg-[var(--spectrum-fieldbutton-background-color,var(--spectrum-global-color-gray-75))]
                    hover:bg-[var(--spectrum-fieldbutton-background-color-down,var(--spectrum-global-color-gray-200))]`
                )}
                onClick={() => (selected ? onChange(null) : onChange(keyword))}
                type="button"
              >
                {keyword}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default KeywordsPicker;
