import { Message } from "discord.js-selfbot-v13";
import { global } from "../../index.js";
import { log } from "../Console.js";

export default {
  info: "Toggle send quotes",
  callback: (message: Message, ...args: string[]) => {
    global.config.autoHunt = !global.config.autoHunt;
    log("Toggle auto huntbot successfully!", "a");
  },
};
