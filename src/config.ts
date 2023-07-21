import * as dotenv from "dotenv";
import { parse } from "yaml";
import fs from "fs";
import { IConfig, IAccount } from "./interface";
import { createClient } from 'redis';
dotenv.config();

// If config file exist read config file. else read config from environment variables.
let configFile: any = {};

let redisHost = process.env.REDIS_HOST;

if (fs.existsSync("./config.yaml")) {
  const file = fs.readFileSync("./config.yaml", "utf8");
  configFile = parse(file);
} else {
  configFile = {
    chatGPTAccountPool: [
      {
        email: process.env.CHAT_GPT_EMAIL,
        password: process.env.CHAT_GPT_PASSWORD,
      },
    ],
    chatGptRetryTimes: Number(process.env.CHAT_GPT_RETRY_TIMES),
    chatPrivateTiggerKeyword: process.env.CHAT_PRIVATE_TRIGGER_KEYWORD,
    openAIProxy: process.env.OPENAI_PROXY,
    clearanceToken: process.env.CF_CLEARANCE,
    userAgent: process.env.USER_AGENT,
    accessToken: process.env.ACCESS_TOKEN,
    parentMessageId: process.env.PARENT_MESSAGE_ID,
    conversationId: process.env.CONVERSATION_ID,
    apiReverseProxyUrl: process.env.API_REVERSE_PROXY_URL,
  };
}

export const redisClient = createClient({url: 'redis://' + redisHost});

export const config: IConfig = {
  chatGPTAccountPool: configFile.chatGPTAccountPool as Array<IAccount>,
  chatGptRetryTimes: configFile.chatGptRetryTimes || 3,
  chatPrivateTiggerKeyword:
    configFile.chatPrivateTiggerKeyword ||
    // Try compatible with previous designs
    (configFile?.botConfig as Array<Map<string, string>>)?.reduce(
      (prev: string, curr: Map<string, string>) =>
        curr.get("trigger_keywords") || "",
      ""
    ) ||
    "",
  // Support openai-js use this proxy
  openAIProxy: configFile.openAIProxy,
  clearanceToken: configFile.clearanceToken,
  userAgent: configFile.userAgent,
  parentMessageId: configFile.parentMessageId,
  accessToken: configFile.accessToken,
  conversationId: configFile.conversationId,
  apiReverseProxyUrl: configFile.apiReverseProxyUrl,
};

export async function initRedisConfig() {
  await redisClient.connect();
  for (let key in config) {
    let value = await redisClient.get(key);
    if (value) {
      config[key] = value;
    }
  }
}
