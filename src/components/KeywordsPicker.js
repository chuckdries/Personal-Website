import classNames from "classnames";
import * as React from "react";

const KeywordsPicker = ({ keywords, value, onChange }) => {
  return (
    <div className="mx-2">
      <span className="text-xs text-[#A2A2A2]">Filter by...</span>
      <ul className="flex gap-1 flex-wrap mt-1 mb-2">
        {keywords.map((keyword) => {
          const selected = value === keyword;
          const disabled = value && !selected;
          // if (value && !selected) {
          //   return;
          // }
          return (
            <li key={keyword}>
              <button
                className={classNames(
                  "py-[5px] px-2 rounded-full text-[#C8C8C8] hover:bg-gray-700 bg-[#1A1A1A] border border-[#494949]                  ",
                  selected && "bg-blue-600 hover:bg-blue-800",
                  disabled && "text-[#777777] cursor-default hover:bg-[#1A1A1A]"
                )}
                disabled={disabled}
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
