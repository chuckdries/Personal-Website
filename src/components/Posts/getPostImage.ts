import { PageProps } from "gatsby";

export function getPostImage(
  props: PageProps<Queries.PostPageQuery>,
  index: number,
) {
  const img = props.data.mdx?.frontmatter?.galleryImages?.[index];
  return img;
}
