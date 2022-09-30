/**
 * @fileoverview Defines format.
 * @copyright Shingo OKAWA 2022
 */
import * as Actions from "@actions/core";
import * as Feed from "./feed";
import * as Handlers from "./handlers";
import * as Clean from "./clean";

const clean = (value: string | undefined): string => {
  let cleaned = Clean.emoji(value);
  if (cleaned) cleaned = Clean.hashtags(cleaned);
  if (cleaned) return cleaned;
  return "";
};

export const feed = (tweet: Feed.Tweet, creator: string): Feed.Item => {
  const title =  clean(tweet.text);
  const link = `https://twitter.com/ognis1205/status/${tweet.id}`;
  const pubDate = new Date(tweet.created_at || "").toUTCString();
  const content = clean(tweet.text);
  const contentSnippet = tweet.text;
  const guid = tweet.id;
  const isoDate = tweet.created_at || "";

  return {
    title: title,
    link: link,
    pubDate: pubDate,
    creator: creator,
    content: content,
    contentSnippet: contentSnippet,
    guid: guid,
    isoDate: isoDate,
    imgSrc: "",
  } as Feed.Item;
};
