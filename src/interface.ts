import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from "chatgpt";
export interface AccountWithUserInfo {
  password: string;
  email: string;
  isGoogleLogin: boolean;
}

// Account will be one in the session token or email and password
export type IAccount = AccountWithUserInfo;

export interface IChatGPTItem {
  chatGpt: ChatGPTAPI;
  account: IAccount;
}

export interface IChatUnOffItem{
  chatGpt:ChatGPTUnofficialProxyAPI;
  account: IAccount;
}
export interface IConversationItem {
  conversation: ChatGPTAPI;
  account: IAccount;
  conversationId?: string;
  messageId?: string;
}

export interface IConversationUnOffItem {
  conversation: ChatGPTUnofficialProxyAPI;
  account: IAccount;
  conversationId?: string;
  messageId?: string;
}

export interface IConfig {
  chatGPTAccountPool: IAccount[];
  chatGptRetryTimes: number;
  chatPrivateTiggerKeyword: string;
  openAIProxy?: string;
  clearanceToken: string;
  userAgent: string;
}
