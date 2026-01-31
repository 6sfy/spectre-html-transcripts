import { version, type Channel, type Message } from 'discord.js-selfbot-v13';
import DiscordMessages from './generator';
import {
  ExportReturnType,
  type CreateTranscriptOptions,
  type GenerateFromMessagesOptions,
  type ObjectType,
} from './types';
import { TranscriptImageDownloader, type ResolveImageCallback } from './downloader/images';
import { isTextBasedChannel, isDMBasedChannel } from './utils/djsAdapter';

// re-exports
export { default as DiscordMessages } from './generator/transcript';
export { TranscriptImageDownloader } from './downloader/images';

// version check
const versionPrefix = version.split('.')[0];

if (versionPrefix !== '14' && versionPrefix !== '15' && versionPrefix !== '3') {
  console.error(
    `[spectre-html-transcripts] Versions v3.x.x of spectre-html-transcripts are only compatible with discord.js v14.x.x, v15.x.x, and discord.js-selfbot-v13 (v3.x.x). You are using v${version}.` +
      `    For older v13 support, please install spectre-html-transcripts v2.x.x using "npm install spectre-html-transcripts@^2"`
  );
  process.exit(1);
}

/**
 *
 * @param messages The messages to generate a transcript from
 * @param channel  The channel the messages are from (used for header and guild name)
 * @param options  The options to use when generating the transcript
 * @returns        The generated transcript
 */
export async function generateFromMessages<T extends ExportReturnType = ExportReturnType.Attachment>(
  messages: Message[] | any,
  channel: Channel,
  options: GenerateFromMessagesOptions<T> = {}
): Promise<ObjectType<T>> {
  // turn messages into an array
  const transformedMessages = messages && typeof (messages as any).values === 'function' ? Array.from((messages as any).values()) : messages;

  // figure out how the user wants images saved
  let resolveImageSrc: ResolveImageCallback = options.callbacks?.resolveImageSrc ?? ((attachment) => attachment.url);
  if (options.saveImages) {
    if (options.callbacks?.resolveImageSrc) {
      console.warn(
        `[spectre-html-transcripts] You have specified both saveImages and resolveImageSrc, please only specify one. resolveImageSrc will be used.`
      );
    } else {
      // If the channel's client exposes a token (selfbot), attach it so private CDN images can be fetched
      const token = (channel.client as any)?.token;
      const downloader = new TranscriptImageDownloader();
      if (token) downloader.withToken(token);

      resolveImageSrc = downloader.build();
      console.log('Using default downloader');
    }
  }

  // render the messages
  const html = await DiscordMessages({
    messages: transformedMessages,
    channel,
    saveImages: options.saveImages ?? true,
    callbacks: {
      resolveImageSrc,
      resolveChannel: async (id) => channel.client.channels.fetch(id).catch(() => null),
      resolveUser: async (id) => channel.client.users.fetch(id).catch(() => null),
      resolveRole: isDMBasedChannel(channel) ? () => null : async (id) => channel.guild?.roles.fetch(id).catch(() => null),

      ...(options.callbacks ?? {}),
    },
    poweredBy: options.poweredBy ?? true,
    footerText: options.footerText ?? 'Exported {number} message{s}.',
    favicon: options.favicon ?? 'guild',
    hydrate: options.hydrate ?? false,
  });

  // get the time it took to render the messages
  // const renderTime = process.hrtime(startTime);
  // console.log(
  //   `[discord-html-transcripts] Rendered ${transformedMessages.length} messages in ${renderTime[0]}s ${
  //     renderTime[1] / 1000000
  //   }ms`
  // );

  // return the html in the specified format
  if (options.returnType === ExportReturnType.Buffer) {
    return Buffer.from(html) as unknown as ObjectType<T>;
  }

  if (options.returnType === ExportReturnType.String) {
    return html as unknown as ObjectType<T>;
  }

  // Return a lightweight attachment-like object to avoid depending on a runtime MessageAttachment export
  return { attachment: Buffer.from(html), name: options.filename ?? `transcript-${channel.id}.html` } as ObjectType<T>;
}

/**
 *
 * @param channel The channel to create a transcript from
 * @param options The options to use when creating the transcript
 * @returns       The generated transcript
 */
export async function createTranscript<T extends ExportReturnType = ExportReturnType.Attachment>(
  channel: any,
  options: CreateTranscriptOptions<T> = {}
): Promise<ObjectType<T>> {
  // validate type
  if (!isTextBasedChannel(channel)) {
    throw new TypeError(`Provided channel must be text-based, received ${channel.type}`);
  }

  // fetch messages
  let allMessages: Message[] = [];
  let lastMessageId: string | undefined;
  const { limit, filter } = options;
  const resolvedLimit = typeof limit === 'undefined' || limit === -1 ? Infinity : limit;

  // until there are no more messages, keep fetching

  while (true) {
    // create fetch options
    const fetchLimitOptions = { limit: 100, before: lastMessageId };
    if (!lastMessageId) delete fetchLimitOptions.before;

    // fetch messages
    const messages = await channel.messages.fetch(fetchLimitOptions);
    const filteredMessages = typeof filter === 'function' ? messages.filter(filter) : messages;

    // add the messages to the array
    allMessages.push(...filteredMessages.values());
    // Get the last key of 'messages', not 'filteredMessages' because you will be refetching the same messages
    lastMessageId = messages.lastKey();

    // if there are no more messages, break
    if (messages.size < 100) break;

    // if the limit has been reached, break
    if (allMessages.length >= resolvedLimit) break;
  }

  if (resolvedLimit < allMessages.length) allMessages = allMessages.slice(0, limit);

  // generate the transcript
  return generateFromMessages<T>(allMessages.reverse(), channel, options);
}

export default {
  createTranscript,
  generateFromMessages,
  TranscriptImageDownloader,
  ExportReturnType,
  isTextBasedChannel,
  isDMBasedChannel,
  DiscordMessages,
  version,
};
export * from './types';
export * from './utils/djsAdapter';
