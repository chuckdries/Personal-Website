import React, { useMemo } from "react";
import { graphql, PageProps } from "gatsby";
import { MDXProvider } from "@mdx-js/react";
import { Link } from "gatsby";
import { PostsLayout } from "./PostsLayout";
import { useDateFormatter } from "react-aria";
import { parseDate } from "@internationalized/date";

const shortcodes = { Link }; // Provide common components here

export default function PageTemplate({
  data,
  children,
}: PageProps<Queries.PostPageQuery>) {
  const date = useMemo(
    () => data.mdx?.frontmatter?.date && new Date(data.mdx!.frontmatter!.date),
    [data.mdx],
  );
  const df = useDateFormatter({
    timeZone: "utc",
  });
  return (
    <PostsLayout>
      <div className="prose lg:prose-xl max-w-[1200px] px-4 md:px-6 mx-auto">
        <h1 style={date ? { marginBottom: 0} : {}}>{data.mdx!.frontmatter!.title}</h1>
        {date && <p style={{ marginTop: 0}}>{df.format(date)}</p>}
        <div className="prose lg:prose-xl">
          <MDXProvider components={shortcodes}>{children}</MDXProvider>
        </div>
      </div>
    </PostsLayout>
  );
}

export const query = graphql`
  query PostPage($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        date
        slug
      }
    }
  }
`;
