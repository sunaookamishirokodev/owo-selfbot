import { Answers } from "inquirer";
import moment from "moment-timezone";
import { InquirerConfirmQuestion, InquirerQuestion } from "./lib/class.js";

type LogType = "u" | "s" | "i" | "a" | "e" | "f" | "d" | 'w' | "PROMISE.ERROR";
const log = (text: string, type: LogType = "s") => {
  let logType: string;
  switch (type) {
    case "u":
      logType = "\x1b[93m[UNKNOWN]";
      break;
    case "i":
      logType = "\x1b[34m[INFO]";
      break;
    case "a":
      logType = "\x1b[35m[ALERT]";
      break;
    case "e":
      logType = "\x1b[31m[ERROR]";
      break;
    case "s":
      logType = "\x1b[92m[SENT]";
      break;
    case "f":
      logType = "\x1b[38;5;49m[FINISHED.TURN]";
      break;
    case "d":
      logType = "\x1b[38;5;57m[DEBUG]";
      break;
    case "w":
      logType = "\x1b[38;5;33m[WARNING]";
      break;
    default:
      logType = "\x1b[36m" + `[${type.toUpperCase()}]`;
      break;
  }
  return console.log(`\x1b[43m${moment().format("YYYY-MM-DD HH:mm:ss")}\x1b[0m ${logType}\x1b[0m ${text}\x1b[0m`);
};

const getResult = <T extends Answers, U extends T[keyof T] = T[keyof T]>(
  question: InquirerQuestion<T, U>,
  text?: string
) => {
  console.clear();
  if (text) console.log(text);
  return question.prompt();
};

const trueFalse = (question: string, defaultValue: boolean = true) => {
  return new InquirerConfirmQuestion<{ answer: boolean }>({
    type: "confirm",
    message: question,
    default: defaultValue,
  });
};

export { getResult, trueFalse, log };
