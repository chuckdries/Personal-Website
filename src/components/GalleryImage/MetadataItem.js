import React from "react";

const MetadataItem = ({ icon, data, title }) =>
  data ? (
    <div className="flex justify-end items-end mr-2">
      <div className="flex flex-col items-end my-2">
        <span className="font-mono text-sm opacity-60 m-0 ">{title}</span>
        <span className="text-lg leading-4">{data}</span>
      </div>
      <span className="icon-offset ml-2 mt-1 text-2xl">
        <ion-icon name={icon} title={title}></ion-icon>
      </span>
    </div>
  ) : null;

export default MetadataItem;
