import fs from "fs";
import { spawn } from "node:child_process";
import { mapInt, ranInt, send, shuffleArray, sleep, solveCaptcha, timeHandler } from "./Extension.js";
import { global } from "../index.js";
import { Configuration } from "./lib/class.js";
import { log } from "./Console.js";
import { Message, MessageEmbed, NewsChannel, TextChannel, WebhookClient } from "discord.js-selfbot-v13";
import { quotes } from "./lib/data.js";

let timeoutChannel = ranInt(17, 51),
  timeoutShift = ranInt(38, 92),
  timeoutPray: number,
  timeoutSleep = mapInt(timeoutShift, 38, 92, 160_000, 1_275_000),
  timeoutHuntbot: Date;

let inv: string[],
  iGem1: number[] | undefined,
  iGem3: number[] | undefined,
  iGem4: number[] | undefined,
  iStar: number[] | undefined;

let dGem1: boolean = false,
  dGem3: boolean = false,
  dGem4: boolean = false,
  dStar: boolean = false;

const isGem1: number[] = [],
  isGem3: number[] = [],
  isGem4: number[] = [],
  isStar: number[] = [];

export const aReload = (force: boolean = false) => {
  if (!global.reloadTime) {
    global.reloadTime = new Date().setUTCHours(24, ranInt(0, 5), ranInt(0, 55));
    return;
  }
  if (global.startTime > global.reloadTime)
    global.reloadTime = new Date(global.reloadTime).setDate(new Date(global.reloadTime).getDate() + 1);
  try {
    iGem1 = undefined;
    iGem3 = undefined;
    iGem4 = undefined;
    iStar = undefined;
    if (Date.now() >= global.reloadTime)
      global.reloadTime = new Date(global.reloadTime).setDate(new Date(global.reloadTime).getDate() + 1);
    global.config = JSON.parse(fs.readFileSync(global.DataPath, "utf-8"))[
      `${global.channel.client.user?.id}`
    ] as Configuration;
    log("Configuration Reloaded Successfully", "i");
    if (force) return true;
  } catch (error) {
    console.log(error);
    log("Failed To Reload The Configuration", "e");
    if (force) return false;
  }
};

const aDaily = async () => {
  await send("daily");
  global.config.autoDaily = false;
};

const aPray = async () => {
  timeoutPray = new Date().setMinutes(new Date().getMinutes() + 5);
  const cmd = `${global.config.autoPray} ${global.config.autoPrayUser ?? ""}`;
  await send(cmd).then(() => global.totalpraycurse++);
};

const aChannel = async () => {
  let arr = global.config.channelID.filter((id) => global.channel.id != id);
  global.channel = global.channel.client.channels.cache.get(arr[ranInt(0, arr.length)]) as TextChannel | NewsChannel;
  log(`Channel Changed To: #${global.channel.name}`, "i");
  timeoutChannel += ranInt(17, 51);
};

const aSleep = async () => {
  log(`Selfbot is taking a break for ${timeHandler(0, timeoutSleep, true)}`, "a");
  await sleep(timeoutSleep);
  const nextShift = ranInt(38, 92);
  timeoutShift += nextShift;
  timeoutSleep = mapInt(nextShift, 38, 92, 160_000, 1_275_000);
};

const aQuote = async () => {
  if (ranInt(0, 3) === 1) {
    const quote = quotes[ranInt(0, quotes.length)];
    if (quote) {
      await send(quote, "quote");
    } else log("Could Not Retrieve Quote From Local Storage!", "e");
  }
};

const setTime = (msg: string) => {
  const matches = msg.match(/\b(\d+H\s*\d+M|\d+H|\d+M)\b/);
  if (matches) {
    const time = matches[0];
    if (time) {
      const timeArray = time.match(/(\d+H)?\s*(\d+M)?/);
      if (timeArray) {
        const hour = matches[1] ? matches[1].replace("H", "") : "0";
        const min = matches[2] ? matches[2].replace("M", "") : "0";
        timeoutHuntbot = new Date();
        timeoutHuntbot.setHours(timeoutHuntbot.getHours() + Number(hour));
        timeoutHuntbot.setMinutes(timeoutHuntbot.getMinutes() + Number(min));
        return;
      }
    }
  }
};

let isSac: boolean = false;
export const aHuntbot = async () => {
  await send("hb");

  global.channel
    .createMessageCollector({
      filter: (msg) =>
        msg.author.id == global.owoID &&
        msg.embeds[0] &&
        msg.embeds[0].author !== null &&
        msg.embeds[0].author.name.includes(msg.guild?.members.me?.displayName!),
      max: 1,
      time: 15_000,
    })
    .once("collect", async (message: Message) => {
      if (!global.config.autoHunt) return;
      if (timeoutHuntbot && new Date() < timeoutHuntbot) return;

      if (!message.embeds[0] && message.content.includes("BEEP BOOP. I AM BACK")) aHuntbot(); // gọi lại func khi huntbot trả pet

      const embed = message.embeds[0];
      const quality = embed.fields[7];
      const progress = embed.fields[8];

      if (progress) {
        // Nếu đang chạy dở thì set lại time rồi thoát
        setTime(progress.value);
        return;
      }

      if (!isSac && global.config.autoSac && global.config.autoSac.length !== 0) {
        await send(`sc ${getPet(global.config.autoSac).join(" ")}`);
        isSac = true;
        return aHuntbot();
      }

      if (global.config.upgradeTrait && global.config.upgradeTrait !== 0) {
        // nâng cấp
        const trait = embed.fields[global.config.upgradeTrait].value;
        if (trait.includes(`[MAX]`)) {
          // nếu max thì bỏ qua
          global.config.upgradeTrait = 0;
          return log("Trait Max Level Reached, Auto Upgrade Trait has been Disabled", "i");
        }

        const arr = trait.match(/\[(\d+)\/(\d+)\]/);
        if (arr) {
          const essenceNeed = parseInt(arr[2], 10) - parseInt(arr[1], 10);
          const essenceHave = quality.name.match(/<a:essence:451638978299428875> Animal Essence - `(\d+)`/i);
          if (typeof essenceHave === "number") {
            if (essenceHave - essenceNeed < 0) {
              // nếu cung < cầu thì hủy
              return log("Insufficient Essence, Auto Upgrade Trait has been Skipped", "e");
            } else {
              let traitName: string;
              switch (global.config.upgradeTrait) {
                case 1:
                  traitName = "efficiency";
                  break;
                case 2:
                  traitName = "time";
                  break;
                case 3:
                  traitName = "cost";
                  break;
                case 4:
                  traitName = "gain";
                  break;
                case 5:
                  traitName = "exp";
                  break;
                case 6:
                  traitName = "radar";
                  break;
              }
              send(`upg ${traitName!} all`);
            }
          }
        }
      }

      await send("hb 1");
      global.channel
        .createMessageCollector({
          filter: (msg) =>
            msg.author.id == global.owoID &&
            msg.content.includes(msg.guild?.members.me?.displayName!) &&
            msg.attachments.first() != undefined &&
            msg.content.includes("Here is your password!"),
          max: 1,
          time: 15_000,
        })
        .on("collect", async (msg: Message) => {
          if (!msg) aHuntbot();
          const imageUrl = msg.attachments.first()?.url;
          if (!imageUrl) throw new Error("Could Not Retrieve Captcha Image URL");
          await solveCaptcha(imageUrl, async (data: string) => {
            const answer = data;
            console.log(answer);
            if (!answer || /\d/.test(answer)) {
              throw new Error(
                answer ? `Captcha Solving Returns Invalid Answer: ${answer}` : "Could Not Retrieve Captcha Answer"
              );
            }
            await send(`hb 24h ${answer}`);
            global.channel
              .createMessageCollector({
                filter: (_msg) =>
                  _msg.author.id === global.owoID && _msg.content.includes(_msg.guild?.members.me?.displayName!),
                max: 1,
                time: 15_000,
              })
              .once("collect", async (_msg) => {
                if (_msg.content.includes("BEEP BOOP. Chloe, YOU SPENT")) {
                  setTime(_msg.content);
                  if (timeoutHuntbot) {
                    const timeDiff = timeoutHuntbot.valueOf() - new Date().valueOf();
                    timeHandler(0, timeDiff, true);
                  }
                } else {
                  log("I have error when solve password of huntbot!!", "e");
                }
              });
          });
        });
    });
};

const aGem = async (useGem1: boolean, useGem3: boolean, useGem4: boolean, useStar: boolean) => {
  await send("inv");

  global.channel
    .createMessageCollector({
      filter: (msg: Message<boolean>) =>
        global.config.autoGem !== 0 &&
        msg.author.id == global.owoID &&
        msg.content.includes(msg.guild?.members.me?.displayName!) &&
        /Inventory/.test(msg.content),
      max: 1,
      time: 15_000,
    })
    .once("collect", async (msg) => {
      inv = msg.content.split("`");

      if (global.config.autoCrate && !inv.includes("050")) {
        log("Disabled auto open lootbox(s) because i couldn't find lootbox!", "a");
        global.config.autoCrate = false;
      }
      iGem1 = inv.filter((elm) => /^05[1-7]$/.test(elm)).map(Number);
      iGem3 = inv.filter((elm) => /^(06[5-9]|07[0-1])$/.test(elm)).map(Number);
      iGem4 = inv.filter((elm) => /^07[2-8]$/.test(elm)).map(Number);
      iStar = inv.filter((elm) => /^(079|08[0-5])$/.test(elm)).map(Number);

      global.config.gemType.forEach((v) => {
        switch (v) {
          case "common":
            isGem1.push(Number(`051`));
            isGem3.push(Number(`065`));
            isGem4.push(Number(`072`));
            isStar.push(Number(`079`));
            break;
          case "uncommon":
            isGem1.push(Number(`052`));
            isGem3.push(Number(`066`));
            isGem4.push(Number(`073`));
            isStar.push(Number(`080`));
            break;
          case "rare":
            isGem1.push(Number(`053`));
            isGem3.push(Number(`067`));
            isGem4.push(Number(`074`));
            isStar.push(Number(`081`));
            break;
          case "epic":
            isGem1.push(Number(`054`));
            isGem3.push(Number(`068`));
            isGem4.push(Number(`075`));
            isStar.push(Number(`082`));
            break;
          case "mythical":
            isGem1.push(Number(`055`));
            isGem3.push(Number(`069`));
            isGem4.push(Number(`076`));
            isStar.push(Number(`083`));
            break;
          case "legendary":
            isGem1.push(Number(`056`));
            isGem3.push(Number(`070`));
            isGem4.push(Number(`077`));
            isStar.push(Number(`084`));
            break;
          case "fabled":
            isGem1.push(Number(`057`));
            isGem3.push(Number(`071`));
            isGem4.push(Number(`078`));
            isStar.push(Number(`085`));
            break;
        }
      });

      const gem1 = iGem1.filter((element) => isGem1.indexOf(element) !== -1);
      const gem3 = iGem3.filter((element) => isGem3.indexOf(element) !== -1);
      const gem4 = iGem4.filter((element) => isGem4.indexOf(element) !== -1);
      const star = iStar.filter((element) => isStar.indexOf(element) !== -1);

      if (
        gem1.length === 0 ||
        gem3.length === 0 ||
        gem4.length === 0 ||
        (global.config.useSpecialGem ? star.length === 0 : false)
      ) {
        if (global.config.autoCrate) {
          await send("lb all");
          return aGem(useGem1, useGem3, useGem4, useStar);
        } else {
          if (gem1.length === 0 && !dGem1) {
            dGem1 = true;
            log("Disabled gem 1", "a");
          }
          if (gem3.length === 0 && !dGem3) {
            dGem3 = true;
            log("Disabled gem 3", "a");
          }
          if (gem4.length === 0 && !dGem4) {
            dGem4 = true;
            log("Disabled gem 4", "a");
          }
          if (global.config.useSpecialGem && star.length === 0 && !dStar) {
            dStar = true;
            log("Disabled star gem", "a");
          }
        }
      }
      const gem = gem1.length + gem3.length + gem4.length + (global.config.useSpecialGem ? star.length : 0);
      log(`Found ${gem} Hunting ${gem > 1 ? "Gems" : "Gem"} in your Inventory`, "i");

      let ugem1 =
        useGem1 && !dGem1 && gem1.length !== 0
          ? global.config.autoGem === 1
            ? Math.max(...gem1)
            : Math.min(...gem1)
          : undefined;
      let ugem3 =
        useGem3 && !dGem3 && gem3.length !== 0
          ? global.config.autoGem === 1
            ? Math.max(...gem3)
            : Math.min(...gem3)
          : undefined;
      let ugem4 =
        useGem4 && !dGem4 && gem4.length !== 0
          ? global.config.autoGem === 1
            ? Math.max(...gem4)
            : Math.min(...gem4)
          : undefined;
      let ustar = undefined;
      if (global.config.useSpecialGem)
        ustar =
          useStar && !dStar && star.length !== 0
            ? global.config.autoGem === 1
              ? Math.max(...star)
              : Math.min(...star)
            : undefined;
      if (!ugem1 && !ugem3 && !ugem4 && !ustar) return;
      await send(`use ${ugem1 ?? ""} ${ugem3 ?? ""} ${ugem4 ?? ""} ${ustar ?? ""}`.replace(/\s+/g, " "));
    });
  await sleep(ranInt(4800, 6200));
};

const aOwO = async () => {
  await send(ranInt(0, 3) === 1 ? "uwu" : "owo", "non-prefix").then(() => global.totalowo++);
};

const aOther = async () => {
  await send(global.config.otherCmd, "non-prefix").then(() => global.totalOtherCmd++);
};

const emergencyStop = async () => {
  global.paused = true;
  await sleep(300_000);
  global.paused = false;
  console.log("RUNNING AGAIN!");
  if (!global.paused) main();
};

const getPet = (data: Array<string>, msg?: string, isSigint: boolean = false) => {
  const arr: string[] = [];
  global.config.autoSell.forEach((v) => {
    if (global.config.autoSell.includes("skip")) {
      if (msg) log(msg, "a");
      if (isSigint) process.emit("SIGINT");
      return;
    } else {
      switch (v) {
        case "common":
          arr.push("c");
          break;
        case "uncommon":
          arr.push("u");
          break;
        case "rare":
          arr.push("r");
          break;
        case "epic":
          arr.push("e");
          break;
        case "mythical":
          arr.push("m");
          break;
        case "legendary":
          arr.push("l");
          break;
        case "fabled":
          arr.push("f");
          break;
        case "gem":
          arr.push("g");
          break;
        case "distorted":
          arr.push("d");
          break;
        case "special":
          arr.push("s");
          break;
        case "patreon":
          arr.push("p");
          break;
        case "cpatreon":
          arr.push("cp");
          break;
      }
    }
  });
  return arr;
};

export const main = async () => {
  if (global.paused) return;
  if (global.captchaDetected) return;
  if (global.lastTime && Date.now() - global.lastTime < 15_000) return;

  global.channel
    .awaitMessages({ filter: (msg: Message): boolean => msg.author.id === global.owoID, time: 17_000 })
    .then(async (collected) => {
      if (collected.size === 0) {
        global.error?.push(
          "Tool paused because OwO didn't respond to your command! I will restart the tool after 5 minutes."
        );
        await emergencyStop();
      }
    });

  await send("b", "normalCommand").then(async () => {
    global.totalbattle++;
    await send("h", "normalCommand").then(async () => {
      global.totalhunt++;
    });

    global.channel
      .createMessageCollector({
        filter: (msg: Message<boolean>) =>
          msg.author.id == global.owoID &&
          msg.content.includes(msg.guild?.members.me?.displayName!) &&
          msg.content.includes("You don't have enough cowoncy!"),
        max: 1,
        time: 10_000,
      })
      .on("collect", async (msg) => {
        send(`sell ${getPet(global.config.autoSell, "Cowoncy Ran Out, Stopping Selfbot", true).join(" ")}`);
      });

    global.channel
      .createMessageCollector({
        filter: (msg: Message<boolean>) =>
          global.config.autoGem !== 0 &&
          msg.author.id == global.owoID &&
          msg.content.includes(msg.guild?.members.me?.displayName!) &&
          /hunt is empowered by|spent 5 \S+ and caught/.test(msg.content),
        max: 1,
        time: 10_000,
      })
      .on("collect", async (msg: Message) => {
        let param1: boolean, param2: boolean, param3: boolean, param4: boolean;
        param1 = !msg.content.includes("gem1") && !dGem1;
        param2 = !msg.content.includes("gem3") && !dGem3;
        param3 = !msg.content.includes("gem4") && !dGem4;
        param4 = global.config.useSpecialGem ? !msg.content.includes("star") && !dStar : false;
        if (param1 || param2 || param3 || param4) await aGem(param1, param2, param3, param4);
      });
  });

  global.lastTime = Date.now();
  const commands = [
    { condition: global.config.autoOwO, action: aOwO },
    { condition: global.config.otherCmd.length !== 0, action: aOther },
    {
      condition: global.config.autoPray.length > 0 && (!timeoutPray || Date.now() - timeoutPray >= 360_000),
      action: aPray,
    },
    { condition: global.config.autoDaily, action: aDaily },
    // { condition: global.config.autoHunt && (!timeoutHuntbot || new Date() > timeoutHuntbot), action: aHuntbot },
    // { condition: true && (!timeoutHuntbot || new Date() > timeoutHuntbot), action: aHuntbot },
    { condition: global.config.autoSleep && global.totalbattle + global.totalhunt > timeoutShift, action: aSleep },
    {
      condition: global.config.channelID.length > 1 && global.totalbattle + global.totalhunt > timeoutChannel,
      action: aChannel,
    },
    { condition: global.config.autoReload && (!global.reloadTime || Date.now() > global.reloadTime), action: aReload },
    { condition: global.config.autoQuote, action: aQuote },
  ];

  for (const { condition, action } of shuffleArray(commands)) {
    if (condition) await action();
    const generalDelay = ranInt(17_000, 32_000) / commands.length;
    await sleep(ranInt(generalDelay - 700, generalDelay + 1300));
  }
  if (global.error?.length !== 0) {
    global.error?.forEach((e) => log(e, "f"));
    global.error = [];
  } else {
    log("No error was found!", "f");
  }
  main();
};

export const selfbotNotify = async (message: Message<boolean>, failed = false) => {
  const content = `${
    global.config.userNotify ? `<@${global.config.userNotify}>` : ""
  } Captcha Found in Channel: ${message.channel.toString()}`;
  const attachment = message.attachments.first();

  if (global.config.wayNotify.includes(0))
    try {
      let command: string;
      switch (process.platform) {
        case "win32":
          command = `start ""`;
          break;
        case "linux":
          command = `xdg-open`;
          break;
        case "darwin":
          command = `afplay`;
          break;
        case "android":
          command = `termux-media-player play`;
          break;
        default:
          throw new Error("Unsupported Platform");
      }
      command += `${global.config.musicPath}`;
      spawn(command, {
        shell: true,
        detached: true,
        stdio: "ignore",
      }).unref();
    } catch (error) {
      console.log(error);
      log("Failed to Play Sound", "e");
    }

  if (global.config.wayNotify.includes(1)) {
    let embed: MessageEmbed | undefined;
    if (attachment) {
      embed = new MessageEmbed()
        .setTitle(`DMs ${global.config.userNotify ? "Selfbot Account" : "OwO Bot"} (Captcha Answer Only)`)
        .setDescription(failed ? "**UNSOLVED**" : "SOLVED")
        .setColor("#00ddff")
        .setImage(attachment.url)
        .setFooter({
          text: "Node.js Selfbot © 2023",
          iconURL: message.guild?.iconURL({ format: "png" }) ?? "https://i.imgur.com/EqChQK1.png",
        })
        .setTimestamp();
    }
    try {
      const webhook = new WebhookClient({
        url: global.config.webhookURL!,
      });
      await webhook.send({
        avatarURL: message.client.user?.avatarURL({ dynamic: true }) ?? "https://i.imgur.com/9wrvM38.png",
        username: "Captcha Detector",
        content,
        embeds: embed ? [embed] : embed,
      });
    } catch (error) {
      console.log(error);
      log("Could Not Send The Notification via Webhook URL", "e");
    }
  }

  if (global.config.wayNotify.includes(2) || global.config.wayNotify.includes(3)) {
    try {
      const target = message.client.relationships.friendCache.get(global.config.userNotify!);
      if (!target) throw new Error("Notification Recipient Not Found");
      if (!target.dmChannel) await target.createDM();
      if (global.config.wayNotify.includes(2)) {
        target
          .send({
            content,
            files: attachment ? [attachment] : undefined,
          })
          .catch((e) => {
            console.log(e);
            log("Could Not DMs The Notification Recipient", "e");
          });
      } else {
        const calling = await target.dmChannel?.call();
        if (!calling) throw new Error("Could Not Call The Notification Recipient");
        setTimeout(() => {
          if (calling) calling.disconnect();
        }, 30_000);
      }
    } catch (error) {
      log(`${error}`, "e");
    }
  }
};
