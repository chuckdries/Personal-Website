import React from "react";

const MetadataItem = ({ icon, data, title }) =>
  data ? (
    <div className="flex justify-end items-end mr-2 font-mono">
      <div className="flex flex-col items-end my-2">
        <span className="text-sm opacity-60 m-0 ">{title}</span>
        <span className="md:text-lg leading-4">{data}</span>
      </div>
      <span className="ml-2 pb-2 text-2xl">
        {icon}
      </span>
    </div>
  ) : null;

export default MetadataItem;
