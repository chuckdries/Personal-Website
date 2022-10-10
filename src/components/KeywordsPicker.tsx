import * as React from "react";
import classNames from "classnames";

interface KeywordsPickerProps {
  keywords: string[];
  value: string | null;
  onChange: (val: string | null) => void;
}
const KeywordsPicker = ({ keywords, value, onChange }: KeywordsPickerProps) => {
  return (
    <div className="mx-2">
      <span className="text-xs text-[#A2A2A2]">Collections</span>
      <ul className="flex gap-1 flex-wrap mt-1 mb-2">
        {keywords.map((keyword) => {
          const selected = value === keyword;
          return (
            <li key={keyword}>
              <button
                className={classNames(
                  "py-[5px] px-2 rounded-full text-[#C8C8C8] hover:bg-gray-700 bg-[#1A1A1A] border border-[#494949]                  ",
                  selected && "bg-blue-600 hover:bg-blue-800"
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
