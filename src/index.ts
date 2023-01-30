/**
 * @fileoverview Defines GitHub action.
 * @copyright Shingo OKAWA 2022
 */
import * as Actions from "@actions/core";
import * as FS from "fs/promises";
import * as Feed from "./feed";
import * as Handlers from "./handlers";
import * as Format from "./format";
import * as API from "twitter-api-v2";

const generate = (posts: Feed.Item[], metadata: Feed.Metadata): Feed.Json => {
  return {
    version: "https://jsonfeed.org/version/1.1",
    ...metadata,
    items: posts,
  };
};

const action = async (): Promise<void> => {
  try {
    const file = Actions.getInput("file");
    const bearer = Actions.getInput("bearer");
    const userid = Actions.getInput("userid");
    const username = Actions.getInput("username");
    const results = Actions.getInput("results");
    const title = Actions.getInput("title");
    const pretty = Actions.getInput("pretty");

    const metadata = {
      title: title,
      timestamp: `${Date.now()}`,
      description: `Tweets of ${username}.`,
    } as Feed.Metadata;

    const client = new API.TwitterApi(bearer);

    // NOTE: As of 30/01/2023, Twitter API cannot handle "max_results" query parameter.
    // I know this is ugly though, I cannot help to implement this way.
    let timeline = await client.v2.userTimeline(userid, {
      max_results: Number(results),
      'tweet.fields': ['created_at'],
    });
    timeline = timeline.tweets.slice(0, Number(results));

    let items: Feed.Item[] | [] = [];
    for (const tweet of timeline) {
      try {
        items.push(Format.feed(tweet, username));
      } catch (e) {
        Handlers.onWarning(e);
      }
    }

    if (!items.length) return;
    const json = generate(items, metadata);
    await FS.writeFile(file, JSON.stringify(json, null, 2));
    Actions.setOutput("STATUS", "success");
  } catch (e) {
    Handlers.onError(e);
  }
};

export default action();
