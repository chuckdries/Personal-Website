import * as React from 'react';
import classnames from 'classnames';

export const HeroA = ({
  href,
  children,
  className,
  ...linkProps
}) => (
  <a
    className={classnames('text-muted-light mx-1 hover:text-vibrant-light underline', className)}
    href={href}
    {...linkProps}
  >{children}</a>
);
