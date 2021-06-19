import * as React from 'react';
import classnames from 'classnames';

export const HeroA = ({
  href,
  children,
  className,
  isClient,
  ...linkProps
}) => (
  <a
    className={classnames('mx-2 underline', isClient && 'text-muted-light hover:text-vibrant-light', className)}
    href={href}
    {...linkProps}
  >{children}</a>
);
