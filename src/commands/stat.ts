import { Message } from "discord.js-selfbot-v13";
import { global } from "../../index.js";
import { timeHandler } from "../Extension.js";

export default {
  info: "Stat Information",
  callback: (message: Message, ...args: string[]) => {
    const msg: {}[] = [];
    [
      {
        title: "Time",
        content: timeHandler(global.startTime, Date.now()),
      },
      {
        title: "Status",
        content: global.captchaDetected ? (global.paused ? "**PAUSED**" : "**PENDING CAPTCHA SOLVING**") : "HUNTING",
      },
      {
        title: "Hunt(s)",
        content: global.totalhunt,
      },
      {
        title: "Battle(s)",
        content: global.totalbattle,
      },
      {
        title: "OwO/UwU",
        content: global.totalowo,
      },
      {
        title: "Quote(s)",
        content: global.totaltxt,
      },
      {
        title: "Other command(s)",
        content: global.totalOtherCmd,
      },
      {
        title: "Pray/Curse(s)",
        content: global.totalpraycurse,
      },
    ].map(({ title, content }, i) => msg.push(`__${title}__: **${content}**`));
    message.reply(`Currently stat:\n${msg.join("\n")}`);
  },
};
