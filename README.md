# ADVANCED DISCORD OWO TOOL FARM

This is a community version and currently in progress

Please report bugs and keep on track with our announcement!

    This tool was completely edited by me from the original version of LongAKolangle. So the original copyright belongs to him.
    If you have any question/suggestion, feel free to submit your idea to us.
    Please report if you have any issue/bugs/error while using, I will try my best to help with my responsibility.

## Requirement

**Node.js Version:** > v18.0.0

For laptop and PC: Windows 8/8.1/10 or higher, Linux and MacOS

For Android: Download and install [Termux](https://f-droid.org/en/packages/com.termux/)

For IOS: Not yet (please tell us if you know any supporting method)

**Note:** Termux from Google Play Store is unsupported.

If you are using Termux and notification via playing music, please download **termux-api** package to be installed for the `termux-media-player` command to work

This can be done by running command:

```bash
pkg install termux-api
```

## Installation

Please make sure that you have installed [Node.js LTS](https://nodejs.org/en/download) on your devices.

![Imgur](https://i.imgur.com/swvzF0k.png)

On Termux, run the following commands:

```bash
apt update
apt upgrade
apt install nodejs-lts
apt install git
```

Download and extract the module or clone/pull it using [Git](https://git-scm.com/downloads):

```bash
git clone https://github.com/sunaookamishirokodev/owo-selfbot.git
```

Now [open the terminal inside folder](https://www.groovypost.com/howto/open-command-window-terminal-window-specific-folder-windows-mac-linux/) where you downloaded the selfbot and run the following command:

```bash
npm run init
```

This will install all the requirements (libraries) for the selfbot to run correctly.

## Usage

For running selfbot, please use the following command (inside selfbot folder)

```bash
npm start
```

If you see the following warning

![Imgur](https://i.imgur.com/pwIISzV.png)

Congratulation, you have installed our selfbot successfully.

Type "Y", enter and enjoy your time! (The selfbot will exit if you press enter only)

## Account Login

We support 3 ways to login: via token, via QR Code, and via Password

![Imgur](https://i.imgur.com/rmPfpza.png)

### Via token:

#### **- Step 1: Get your discord account token**

Method 1: Follow [this instruction](https://pcstrike.com/how-to-get-discord-token/) to get your account token.

Method 2: Press **Ctrl + Shift + I** and paste the following function.

```javascript
window.webpackChunkdiscord_app.push([
  [Math.random()],
  {},
  (req) => {
    if (!req.c) return;
    for (const m of Object.keys(req.c)
      .map((x) => req.c[x].exports)
      .filter((x) => x)) {
      if (m.default && m.default.getToken !== undefined) {
        return copy(m.default.getToken());
      }
      if (m.getToken !== undefined) {
        return copy(m.getToken());
      }
    }
  },
]);
console.log("%cWorked!", "font-size: 50px");
console.log(`%cYou now have your token in the clipboard!`, "font-size: 16px");
```

#### **- Step 2: Simply paste your token into the toolfarm, this will take a while**

![Imgur](https://i.imgur.com/YarZy6A.png)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsunaookamishirokodev%2Fowo-selfbot.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsunaookamishirokodev%2Fowo-selfbot?ref=badge_shield)

### Via QR Code

Simply scan the QR Code on the screen by your discord mobile and wait patiently...

![Imgur](https://i.imgur.com/ksbSk5j.png)

If success, a list of joined servers will be shown up.

**A full tutorial on how to use the selfbot will be uploaded to Youtube soon!**

### Via Password

Simply submit your Email/Phone Number, Password, MFA Code (Backup/3rd party app Code)

**Note:** We do **NOT** support code auth via Phone Number/Email, **ONLY** Backup / Google Authenticator Code

## Caution

Recently, there have been reports of hacked accounts and lost currency associated with the use of certain tools. For your safety, it is advised to avoid any kind of obfuscated or suspicious code. Prioritize security and exercise caution when using external code or tools. Stay informed, trust reliable sources, and adopt good security practices to protect your accounts and data.

![Imgur](https://i.imgur.com/dWFr5uv.png)

## Achievements

✔ Attempt to solve captcha by using 3rd party captcha-api website

✔ Solve captcha by DMs selfbot account

✔ Selfbot Commands

✔ Send notification via webhook/DMs/Call

✔ Cool Activities

✔ Prompt sent command with time

✔ Level up with random quotes locally

✔ Unhandled Rejection Handler

✔ Double/Triple spam error Handler

✔ Automatic resume on captcha solved

✔ Automatic loot boxes and use gems (special gems)

✔ Automatic claim daily reward

✔ Automatic sell animals once cash runs out

X Automatic sacrifice animals when running huntbot (Server Error)

X Automatic send/receive, upgrade trait huntbot (Server Error)

✔ Automatic reload configuration daily

✔ Automatic check for update

✔ Open source

**-- Coming soon list --**

⬜ Selfbot captcha solving API (No longer 3rd party)

⬜ Huntbot captcha solving API (No longer 3rd party)

⬜ Clean code

⬜ HCaptcha solving (in testing)

⬜ Automatic vote OwO on top.gg (in testing)

⬜ Automatic claim/handle quest and checklog

⬜ Application with UI support

## Sparkling Soul

We greatly appreciate your support and consideration! Your belief in the power of a star as a donation truly resonates with us. Each click represents not just a simple action, but a meaningful contribution towards our journey.

Your stars serve as fuel for our spirits, igniting our passion and dedication to make a positive impact. With every milestone we achieve, we come closer to realizing our vision of creating a better non-profit endeavors.

Your stars inspire us to keep pushing boundaries, overcome challenges, and bring about meaningful change.

[![Star History Chart](https://api.star-history.com/svg?repos=sunaookamishirokodev/owo-selfbot&type=Date)](https://star-history.com/#sunaookamishrokodev/owo-selfbot&Date)

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

As we are looking for translators to make the selfbot and instruction multi-language supports, please open a discussion with translator labels if you'd like to join in!

Please make sure to update tests as appropriate.

## Contact

**Facebook:** [Sunaookami Shiroko](https://www.facebook.com/sunaookamishirokodev)

**Discord:** [Sunaookami Shiroko](https://discord.com/users/962375717465763961)

**Join our discord server:** [Join now](https://discord.gg/BueTaePGMH)

## Acknowledgments

**SPECIAL THANKS TO:**Eternityy, Aiko-chan-ai, iamz4ri, keepmeside, gillcoder, AmiiUwU.

## License

✨ Licensed under the MIT license.

⛱️ Copyright © Shiroko x EternityVN x aiko-chan-ai 2023

💖 Made by Vietnamese with love

💫 We are Elaina Team

**Tag:** Discord selfbot, OwO selfbot, Tool Farm OwO, Advanced OwO Selfbot, Selfbot Farm OwO, Discord OwO bot selfbot, Discord OwO selfbot, etc.


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsunaookamishirokodev%2Fowo-selfbot.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsunaookamishirokodev%2Fowo-selfbot?ref=badge_large)