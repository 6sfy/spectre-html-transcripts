# `spectre-html-transcripts` (Selfbot v13)

[![Discord](https://img.shields.io/discord/1402994225108488213?label=discord)](https://discord.gg/WxG8XWjvmX)
[![npm downloads](https://img.shields.io/npm/dt/spectre-html-transcripts)](https://www.npmjs.com/package/spectre-html-transcripts)
![GitHub package.json version](https://img.shields.io/github/package-json/v/6sfy/spectre-html-transcripts)
![GitHub Repo stars](https://img.shields.io/github/stars/6sfy/spectre-html-transcripts?style=social)

Spectre HTML Transcripts is a node.js module to generate nice looking HTML transcripts. Processes discord markdown like **bold**, _italics_, ~~strikethroughs~~, and more. Nicely formats attachments and embeds. Built in XSS protection, preventing users from inserting arbitrary html tags.

This module can format the following:

- Discord flavored markdown
  - Uses [discord-markdown-parser](https://github.com/ItzDerock/discord-markdown-parser)
  - Allows for complex markdown syntax to be parsed properly
- Embeds
- System messages
  - Join messages
  - Message Pins
  - Boost messages
- Slash commands
  - Will show the name of the command in the same style as Discord
- Buttons
- Reactions
- Attachments
  - Images, videos, audio, and generic files
- Replies
- Mentions
- Threads

**This fork targets [discord.js-selfbot-v13](https://github.com/aiko-chan-ai/discord.js-selfbot-v13) (selfbot) and supports its v3.x releases.**

Styles from [@derockdev/discord-components](https://github.com/ItzDerock/discord-components).
Behind the scenes, this package uses React SSR to generate a static site.

## Selfbot (discord.js-selfbot-v13) notes ⚠️

**This fork is tailored to work with `discord.js-selfbot-v13` (v3.x).** Install it in your project and ensure it's available as a peer dependency:

```bash
npm install discord.js-selfbot-v13@^3.7.1
```

> **Note:** Using selfbots may violate Discord's Terms of Service. Use at your own risk.

---

## Credits

This package is a complete overhaul (a fork) of the original `discord-html-transcripts` project by ItzDerock. All credits for the original concept and base code go to him. Please give the original project a star ⭐ and/or support the original creator on [Ko-fi](https://ko-fi.com/derock).

---

## 👋 Support

For support, please open a thread on [this](https://discord.gg/WxG8XWjvmX) server or send a DM to `qorp` on Discord. / Pour tout support, ouvrez un thread sur ce serveur ou envoyez un DM à `qorp` sur Discord.

## 🖨️ Example Output

![output](https://derock.media/r/6G6FIl.gif)

## 📝 Usage

### Example usage using the built in message fetcher.

```js
const spectreTranscripts = require('spectre-html-transcripts');
// or (if using typescript) import * as spectreTranscripts from 'spectre-html-transcripts';

const channel = message.channel; // or however you get your TextChannel

// Must be awaited
const attachment = await spectreTranscripts.createTranscript(channel);

channel.send({
  files: [attachment],
});
```

### Or if you prefer, you can pass in your own messages.

```js
const spectreTranscripts = require('spectre-html-transcripts');
// or (if using typescript) import * as spectreTranscripts from 'spectre-html-transcripts';

const messages = someWayToGetMessages(); // Must be Collection<string, Message> or Message[]
const channel = someWayToGetChannel(); // Used for ticket name, guild icon, and guild name

// Must be awaited
const attachment = await spectreTranscripts.generateFromMessages(messages, channel);

channel.send({
  files: [attachment],
});
```

## ⚙️ Configuration

Both methods of generating a transcript allow for an option object as the last parameter.
**All configuration options are optional!**

### Built in Message Fetcher

```js
const attachment = await discordTranscripts.createTranscript(channel, {
    limit: -1, // Max amount of messages to fetch. `-1` recursively fetches.
    returnType: 'attachment', // Valid options: 'buffer' | 'string' | 'attachment' Default: 'attachment' OR use the enum ExportReturnType
    filename: 'transcript.html', // Only valid with returnType is 'attachment'. Name of attachment.
    saveImages: false, // Download all images and include the image data in the HTML (allows viewing the image even after it has been deleted) (! WILL INCREASE FILE SIZE !)
    footerText: "Exported {number} message{s}", // Change text at footer, don't forget to put {number} to show how much messages got exported, and {s} for plural
    callbacks: {
      // register custom callbacks for the following:
      resolveChannel: (channelId: string) => Awaitable<Channel | null>,
      resolveUser: (userId: string) => Awaitable<User | null>,
      resolveRole: (roleId: string) => Awaitable<Role | null>,
      resolveImageSrc: (
        attachment: APIAttachment,
        message: APIMessage
      ) => Awaitable<string | null | undefined>
    },
    poweredBy: true, // Whether to include the "Powered by spectre-html-transcripts" footer
    hydrate: true, // Whether to hydrate the html server-side
    filter: (message) => true // Filter messages, e.g. (message) => !message.author.bot
});
```

### Providing your own messages

```js
const attachment = await discordTranscripts.generateFromMessages(messages, channel, {
  // Same as createTranscript, except no limit or filter
});
```

### Compressing images

If `saveImages` is set to `true`, all images will be downloaded and stored in the file _as-is_. You can optionally enable compression by installing the `sharp` module and setting the following options:

```js
callbacks: {
  resolveImageSrc: new TranscriptImageDownloader()
    .withMaxSize(5120) // 5MB in KB
    .withCompression(40, true) // 40% quality, convert to webp
    .build(),
},
```

Note that, in a more advanced setup, you could store a copy of the files and return an entirely new URL pointing to your own image hosting site by implementing a custom `resolveImageSrc` function.

## 🤝 Enjoy the package?

Give it a star ⭐ and/or support the original creator on [Ko-fi](https://ko-fi.com/derock).

This package is a complete overhaul (fork) of the original `discord-html-transcripts` project by ItzDerock. All credits for the original concept and base code go to him. Thanks !
