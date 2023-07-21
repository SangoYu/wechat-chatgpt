import { WechatyBuilder, Wechaty } from "wechaty";
import QRCode from "qrcode";
import { ChatGPTBot } from "./bot.js";
import { initRedisConfig } from "./config.js";

let chatGPTBot: ChatGPTBot;

let bot: Wechaty;

// get a Wechaty instance

async function main() {
  await chatGPTBot.startGPTBot();
  bot
    .on("scan", async (qrcode, status) => {
      const url = `https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`;
      console.log(`Scan QR Code to login: ${status}\n${url}`);
      console.log(
        await QRCode.toString(qrcode, { type: "terminal", small: true })
      );
    })
    .on("login", async (user) => {
      console.log(`User ${user} logged in`);
      chatGPTBot.setBotName(user.name());
    })
    .on("message", async (message) => {
      if (!chatGPTBot.ready) {
        return;
      }
      if (Date.now() - new Date(message.date()).getTime() > 10000) {
        return;
      }
      if (message.text().startsWith("/ping")) {
        await message.say("pong");
        return;
      }
      try {
        console.log(message.date());
        console.log(`Message: ${message}`);
        await chatGPTBot.onMessage(message);
      } catch (e) {
        console.error(e);
      }
    });
  try {
    await bot.start();
  } catch (e) {
    console.error(
      `⚠️ Bot start failed, can you log in through wechat on the web?: ${e}`
    );
  }
}

async function start() {
  await initRedisConfig();
  bot = WechatyBuilder.build({
    name: "wechat-assistant", // generate xxxx.memory-card.json and save login data for the next login
  });
  chatGPTBot = new ChatGPTBot();
  main();
}

start();
