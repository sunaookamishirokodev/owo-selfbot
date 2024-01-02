import { Message } from "discord.js-selfbot-v13";
import { aHuntbot } from "../SelfbotWorker.js";
import { global } from "../../index.js";
import { log } from "../Console.js";

export default {
  info: "Call huntbot function",
  callback: (message: Message, ...args: string[]) => {
    console.log(args)
    if (args.length === 0) aHuntbot();
    // if (args[1] === "disable" || "d") {
    //   global.config.autoHunt = false
    //   log("Disabled auto huntbot!", 'a')
    // };
  },
};
