import * as React from 'react';
import classnames from 'classnames';
import { MDXProvider } from '@mdx-js/react';

import '../styles/resume.css';

const MyH1 = props => <h1 style={{ color: 'tomato' }} {...props} />;
const MyParagraph = props => (
  <p style={{ fontSize: '18px', lineHeight: 1.6 }} {...props} />
);

const components = {
  h1: MyH1,
  p: MyParagraph,
};


const ResumeLayout = ({ pageContext, children }) => {
  console.log('pc', pageContext);
  return (
    <MDXProvider components={components}>
      <div className={classnames('font-serif container mx-auto resume')}>{children}</div>
    </MDXProvider>
  );
};

// TODO: can I use custom components for just this layout/page?

export default ResumeLayout;
