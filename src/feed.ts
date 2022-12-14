/**
 * @fileoverview Defines feed.
 * @copyright Shingo OKAWA 2022
 */
export type Tweet = {
  id: string;
  text: string;
  created_at?: string;
};

export type Metadata = {
  title: string;
  description: string;
  timestamp: string;
};

export type Item = {
  title: string;
  link: string;
  pubDate: string;
  creator: string;
  content: string;
  contentSnippet: string;
  guid: string;
  isoDate: string;
  imgSrc: string;
};

export type Json = {
  version: string;
  title: string;
  description: string;
  timestamp: string;
  items: Item[];
};
