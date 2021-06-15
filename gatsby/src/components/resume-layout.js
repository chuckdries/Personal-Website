import * as React from 'react';
import classnames from 'classnames';

import '../styles/resume.css';

const ResumeLayout = ({ pageContext, children }) => {
  console.log('pc', pageContext);
  return (<div className={classnames('font-serif container mx-auto resume')}>{children}</div>);
};

// TODO: can I use custom components for just this layout/page?

export default ResumeLayout;
