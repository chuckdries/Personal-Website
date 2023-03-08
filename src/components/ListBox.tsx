/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from "react";
import type { AriaListBoxOptions } from "@react-aria/listbox";
import type { ListState } from "react-stately";
import type { Node } from "@react-types/shared";
import { useListBox, useListBoxSection, useOption } from "react-aria";
// import { CheckIcon } from "@heroicons/react/solid";
import Checkmark from '@spectrum-icons/workflow/Checkmark'

interface ListBoxProps extends AriaListBoxOptions<unknown> {
  listBoxRef?: React.RefObject<HTMLUListElement>;
  state: ListState<unknown>;
}

interface SectionProps {
  section: Node<unknown>;
  state: ListState<unknown>;
}

interface OptionProps {
  item: Node<unknown>;
  state: ListState<unknown>;
}

export function ListBox(props: ListBoxProps) {
  let ref = React.useRef<HTMLUListElement>(null);
  let { listBoxRef = ref, state } = props;
  let { listBoxProps } = useListBox(props, state, listBoxRef);

  return (
    <ul
      {...listBoxProps}
      className="w-full max-h-72 overflow-auto outline-none"
      ref={listBoxRef}
    >
      {[...state.collection].map((item) =>
        item.type === "section" ? (
          <ListBoxSection key={item.key} section={item} state={state} />
        ) : (
          <Option item={item} key={item.key} state={state} />
        )
      )}
    </ul>
  );
}

function ListBoxSection({ section, state }: SectionProps) {
  let { itemProps, headingProps, groupProps } = useListBoxSection({
    heading: section.rendered,
    "aria-label": section["aria-label"]
  });

  return (
    <>
      <li {...itemProps} className="pt-2">
        {section.rendered && (
          <span
            {...headingProps}
            className="text-xs font-bold uppercase text-gray-500 mx-3"
          >
            {section.rendered}
          </span>
        )}
        <ul {...groupProps}>
          {[...section.childNodes].map((node) => (
            <Option item={node} key={node.key} state={state} />
          ))}
        </ul>
      </li>
    </>
  );
}

function Option({ item, state }: OptionProps) {
  let ref = React.useRef<HTMLLIElement>(null);
  let { optionProps, isDisabled, isSelected, isFocused } = useOption(
    {
      key: item.key
    },
    state,
    ref
  );

  let text = "text-black";
  if (isFocused || isSelected) {
    text = "text-black";
  } else if (isDisabled) {
    text = "text-gray-200";
  }

  return (
    <li
      {...optionProps}
      className={`p-2 outline-none cursor-default flex items-center justify-between ${text} text-sm ${
        isFocused ? "bg-black/10" : ""
      } ${isSelected ? "font-bold" : ""}`}
      ref={ref}
    >
      {item.rendered}
      {isSelected && (
        <Checkmark UNSAFE_className="mx-1" UNSAFE_style={{ width: '15px' }} aria-hidden="true" />
      )}
    </li>
  );
}
