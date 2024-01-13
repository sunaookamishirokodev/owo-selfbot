import { Message } from "discord.js-selfbot-v13";
import { timeHandler } from "./Extension.js";
import { global } from "../index.js";
import { log } from "console";
import { main } from "./SelfbotWorker.js";

export function say(message: Message, args: string[]) {
  message.channel.send(args.join(" "));
}

export function stat(message: Message, args: string[]) {
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
}

export function shutdown(message: Message, args: string[]) {
  log("Shutting down...", "a");
  process.emit("SIGINT");
}

export function pause(message: Message, args: string[]) {
  if (global.captchaDetected) {
    message.reply(
      global.paused
        ? "Tool is already paused!"
        : "**ACTION REQUIRED!** You must solve the captcha before pausing the tool"
    );
  } else {
    global.paused = true;
    log("Tool is paused!", "a");
  }
}

export function resume(message: Message, args: string[]) {
  if (global.paused && !global.captchaDetected) {
    global.paused = false;
    log("Tool is resume!", "a");
    main();
  } else
    log(
      global.captchaDetected
        ? "**ACTION REQUIRED!** You must solve the captcha before resuming the tool"
        : "Tool is not paused!",
      "a"
    );
}

export function ping(message: Message, args: string[]) {
  message.reply(`Pong! ${message.client.ws.ping}ms~`);
}

export function help(message: Message, args: string[]) {
  const commands: any = [];
  [
    {
      name: "help",
      desc: "All commands of tool.",
    },
    {
      name: "ping",
      desc: "Ping of tool",
    },
    {
      name: "say",
      desc: "Make selfbot send something.",
    },
    {
      name: "pause",
      desc: "Pause this selfbot.",
    },
    {
      name: "resume",
      desc: "Resume this selfbot.",
    },
    {
      name: "shutdown",
      desc: "Shutdown this selfbot.",
    },
  ].map(({ name, desc }: { name: string; desc: string }, i) => {
    commands.push(`> \`${name}\`: ${desc}`);
  });
  message.reply(`List command:\n${commands.join("\n")}`);
}
