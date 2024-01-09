import { NewsChannel, TextChannel } from "discord.js-selfbot-v13";
import inquirer, { Question, ListQuestion, CheckboxQuestion, InputQuestion, ConfirmQuestion } from "inquirer";

type Answers = Record<string, any>;

class InquirerQuestion<T extends Answers = Answers, U = T[keyof T]> {
  private question: Question<T>;

  constructor(question: Question<T>) {
    if (!question.name) question.name = "answer";
    if (!question.message?.toString().endsWith(": ")) question.message += ": ";
    this.question = question;
  }

  async prompt(): Promise<U> {
    const answers = await inquirer.prompt([this.question]);
    return answers[this.question.name as keyof T] as U;
  }
}

class InquirerListQuestion<T extends Answers = Answers, U = T[keyof T]> extends InquirerQuestion<T, U> {
  constructor(question: ListQuestion<T>) {
    super(question);
  }

  async prompt(): Promise<U> {
    const answer = await super.prompt();
    return answer as U;
  }
}

class InquirerCheckboxQuestion<T extends Answers = Answers, U = T[keyof T]> extends InquirerQuestion<T, U> {
  constructor(question: CheckboxQuestion<T>) {
    super(question);
  }

  async prompt(): Promise<U> {
    const answer = await super.prompt();
    return answer as U;
  }
}

class InquirerInputQuestion<T extends Answers = Answers, U = T[keyof T]> extends InquirerQuestion<T, U> {
  constructor(question: InputQuestion<T>) {
    super(question);
  }

  async prompt(): Promise<U> {
    const answer = await super.prompt();
    return answer as U;
  }
}

class InquirerConfirmQuestion<T extends Answers = Answers, U = T[keyof T]> extends InquirerQuestion<T, U> {
  constructor(question: ConfirmQuestion<T>) {
    super(question);
  }

  async prompt(): Promise<U> {
    const answer = await super.prompt();
    return answer as U;
  }
}

interface Configuration {
  tag: string;
  token: string;
  guildID: string;
  channelID: string[];
  wayNotify: string;
  musicPath?: string;
  webhookURL?: string;
  userNotify?: string;
  captchaAPI: number;
  apiUser?: string;
  apiKey?: string;
  apiNCAI?: string;
  cmdPrefix?: string;
  botPrefix?: string;
  autoPray: string;
  autoPrayUser: string;
  autoGem: number;
  gemType: string[];
  useSpecialGem: boolean;
  autoCrate: boolean;
  autoOwO: boolean;
  autoHunt: boolean;
  upgradeTrait?: number;
  autoSac: string[];
  otherCmd: string;
  autoSell: string[];
  autoQuote: boolean;
  autoDaily: boolean;
  autoSleep: boolean;
  autoReload: boolean;
  autoResume: boolean;
}

interface Tool {
  owoID: string;
  DataPath: string;
  startTime: number;
  lastTime?: number;
  reloadTime?: number;
  error?: string[];
  totalhunt: number;
  totalbattle: number;
  totalowo: number;
  totalOtherCmd: number;
  totalpraycurse: number;
  totaltxt: number;
  paused: boolean;
  captchaDetected: boolean;
  channel: TextChannel | NewsChannel;
  config: Configuration;
  commands: {
    [key: string]: any;
  };
}

const resolveData = (
  tag: string,
  token: string,
  guildID: string,
  channelID: string[],
  wayNotify: string,
  musicPath: string,
  webhookURL: string,
  userNotify: string,
  captchaAPI: number,
  apiUser: string,
  apiKey: string,
  apiNCAI: string,
  botPrefix: string,
  cmdPrefix: string,
  autoPray: string,
  autoPrayUser: string,
  autoGem: number,
  gemType: string[],
  useSpecialGem: boolean,
  autoCrate: boolean,
  autoHunt: boolean,
  upgradeTrait: number,
  autoSac: string[],
  autoQuote: boolean,
  autoOwO: boolean,
  autoDaily: boolean,
  autoSell: string[],
  otherCmd: string,
  autoSleep: boolean,
  autoReload: boolean,
  autoResume: boolean
) => {
  return {
    tag,
    token,
    guildID,
    channelID,
    wayNotify,
    musicPath,
    webhookURL,
    userNotify,
    captchaAPI,
    apiUser,
    apiKey,
    apiNCAI,
    botPrefix,
    cmdPrefix,
    autoPray,
    autoPrayUser,
    autoGem,
    gemType,
    useSpecialGem,
    autoCrate,
    autoHunt,
    upgradeTrait,
    autoSac,
    autoQuote,
    autoOwO,
    autoDaily,
    autoSell,
    otherCmd,
    autoSleep,
    autoReload,
    autoResume,
  } as Configuration;
};

export type { Configuration, Tool };
export {
  InquirerQuestion,
  InquirerListQuestion,
  InquirerInputQuestion,
  InquirerCheckboxQuestion,
  InquirerConfirmQuestion,
  resolveData,
};
