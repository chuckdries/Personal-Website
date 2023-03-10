import * as React from "react";
import classNames from "classnames";
import { Link } from "gatsby";

interface KeywordsPickerProps {
  keywords: string[];
  value: string | null;
  getHref: (value: string | null, selected: boolean) => string;
  onPick: (value: string | null) => void;
}
const KeywordsPicker = ({ keywords, value, getHref, onPick }: KeywordsPickerProps) => {
  return (
    <div className="mx-2 mt-2">
      <span className="text-xs text-black">Collections</span>
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
                onClick={() => onPick(keyword)}
                replace={false}
                to={getHref(keyword, selected)}
              >
                {keyword}{" "}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default KeywordsPicker;
