import React from "react";
import { Helmet } from "react-helmet";

export function PhotoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Helmet>
        <body className="bg-black text-white" />
      </Helmet>
      {children}
    </div>
  );
}
