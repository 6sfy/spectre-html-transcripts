// Minimal shims for editor/TS server to avoid missing types during development

declare module 'discord.js-selfbot-v13' {
  // common types / values used in the codebase
  export type Message = any;
  export type Channel = any;
  export type TextChannel = any;
  export type TextBasedChannel = any;
  export type User = any;
  export type Role = any;
  export type GuildMember = any;
  export type Embed = any;
  export type EmbedField = any;
  export type Emoji = any;
  export type MessageAttachment = any;
  export type Collection<K = any, V = any> = any;

  export type ButtonComponent = any;
  export type ThumbnailComponent = any;
  export type MessageActionRowComponent = any;
  export type MediaGalleryComponent = any;

  export const Client: any;
  // GatewayIntentBits are exported here for compatibility with tests/examples.
  // NOTE: Selfbots typically do not need explicit gateway intents; do not rely on them in runtime library code.
  export const GatewayIntentBits: any;
  export const Events: any;
  export const MessageType: any;
  export const MessageFlags: any;
  export const ButtonStyle: any;
  export const UserFlags: any;
  export const SeparatorSpacingSize: any;

  export const version: string;
  const _default: any;
  export default _default;
}

declare module 'discord-api-types/v10' {
  export const ComponentType: any;
  const _default: any;
  export default _default;
}

declare module '@derockdev/discord-components-react' {
  // export the react components used in the project as "any"
  export const DiscordAttachment: any;
  export const DiscordAttachments: any;
  export const DiscordEmbed: any;
  export const DiscordEmbedDescription: any;
  export const DiscordEmbedField: any;
  export const DiscordEmbedFields: any;
  export const DiscordEmbedFooter: any;
  export const DiscordMessage: any;
  export const DiscordMessages: any;
  export const DiscordHeader: any;
  export const DiscordReaction: any;
  export const DiscordReactions: any;
  export const DiscordReply: any;
  export const DiscordSpoiler: any;
  export const DiscordCommand: any;
  export const DiscordThread: any;
  export const DiscordThreadMessage: any;
  export const DiscordSystemMessage: any;
  export const DiscordQuote: any;
  export const DiscordBold: any;
  export const DiscordItalic: any;
  export const DiscordUnderlined: any;
  export const DiscordInlineCode: any;
  export const DiscordCodeBlock: any;
  export const DiscordCustomEmoji: any;
  export const DiscordTime: any;
  export const DiscordButton: any;
  export const DiscordActionRow: any;
  export const DiscordSelect: any;
  export const DiscordMention: any;
  export const DiscordSection: any;
  export const DiscordContainer: any;
  export const DiscordSeparator: any;
  export const DiscordThumbnail: any;
  const _default: any;
  export default _default;
}

declare module '@derockdev/discord-components-core/hydrate' {
  export function renderToString(html: string, options?: any): Promise<{ html: string }>;
  const _default: any;
  export default _default;
}

declare module 'react-dom/static' {
  export function prerenderToNodeStream(node: any): Promise<{ prelude: any }>;
  const _default: any;
  export default _default;
}

declare module 'discord-markdown-parser' {
  const parse: any;
  export default parse;
}

declare module 'simple-markdown' {
  export type ASTNode = any;
  export type SingleASTNode = any;
  export const ASTNode: any;
  const _default: any;
  export default _default;
}

declare module 'twemoji' {
  const twemoji: any;
  export default twemoji;
}

declare module 'fs' {
  export function readFileSync(path: string, encoding?: string): string;
}

declare module 'path' {
  export function join(...args: string[]): string;
}

declare module 'undici' {
  export function request(url: string, options?: any): Promise<any>;
}

declare module 'sharp' {
  export type WebpOptions = any;
  const sharp: any;
  export default sharp;
}

declare module 'debug' {
  function debugFactory(namespace: string): (...args: any[]) => void;
  const _default: typeof debugFactory;
  export default _default;
}

/* Node/global shims used in this project */
declare var process: any;
declare var __dirname: string;
declare var Buffer: any;

declare namespace NodeJS {
  interface ReadableStream {
    on(...args: any[]): any;
  }
}

/* Minimal JSX typing so JSX expressions compile without react types */
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

/* helper type used in content rendering for emoji nodes */
type APIMessageComponentEmoji = { id?: string; name?: string; animated?: boolean };
