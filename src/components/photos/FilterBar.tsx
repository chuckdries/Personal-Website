import { Link as GatsbyLink } from "gatsby";
import React, { ReactNode } from "react";

function Link({ to, children }: {
  to: string;
  children: ReactNode
}) {
  return (
    <GatsbyLink
      activeClassName="bg-white/80"
      className="text-black hover:underline rounded-full py-[5px] px-3"
      to={to}
    >
      {children}
    </GatsbyLink>
  );
}

export function FilterBar() {
  return (
    <div className="flex items-center bg-gradient-to-t from-gray-300/60 to-gray-200/60 rounded-full border shadow overflow-hidden">
      <Link to="/photos">Most Recent</Link>
      <Link to="/photos/favorites/">Favorites</Link>
    </div>
  );
}
