import * as React from 'react';

import {useToggleState} from 'react-stately';
import {AriaToggleButtonProps, useToggleButton} from 'react-aria';
import {useRef} from 'react';
import classNames from 'classnames';

export function ToggleButton(props: AriaToggleButtonProps) {
  let ref = useRef(null);
  let state = useToggleState(props);
  let { buttonProps, isPressed } = useToggleButton(props, state, ref);

  return (
    <button
      {...buttonProps}
      className={classNames(buttonProps.className, "py-[3px] px-2 mx-1 rounded")}
      ref={ref}
      style={{
        background: isPressed
          ? state.isSelected ? 'darkgreen' : 'gray'
          : state.isSelected
          ? 'green'
          : 'lightgray',
        color: state.isSelected ? 'white' : 'black',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        border: 'none'
      }}
    >
      {props.children}
    </button>
  );
}