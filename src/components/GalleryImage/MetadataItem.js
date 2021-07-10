import classNames from 'classnames';
import React from 'react';

const MetadataItem = ({
  aspectRatio,
  icon,
  data,
  title,
}) => data ? (
  <div className={classNames('flex items-baseline ml-2 text-lg',
    aspectRatio <= 1 ? 'flex-row-reverse' : 'portrait:flex-row-reverse')}
  title={title}
  >
    <span className="icon-offset mr-1">
      <ion-icon name={icon}></ion-icon>
    </span>
    <span className="mr-1">f/{data}</span>
  </div>
) : null;

export default MetadataItem;