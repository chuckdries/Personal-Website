import React from "react";
// @ts-ignore
import { BlueskyComments } from "bluesky-comments";
import "bluesky-comments/bluesky-comments.css";

export function BlueskyCommentsWrapper({ uri }: { uri: string }) {
  return <BlueskyComments uri={uri} />;
}
