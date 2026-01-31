import {
  DiscordBold,
  DiscordCodeBlock,
  DiscordCustomEmoji,
  DiscordInlineCode,
  DiscordItalic,
  DiscordMention,
  DiscordQuote,
  DiscordSpoiler,
  DiscordTime,
  DiscordUnderlined,
} from '@derockdev/discord-components-react';
import parse from 'discord-markdown-parser';

import { isDMBasedChannel, getChannelTypeFrom } from '../../utils/djsAdapter';
import React from 'react';
import type { ASTNode, SingleASTNode } from 'simple-markdown';
import type { RenderMessageContext } from '../';
import { parseDiscordEmoji } from '../../utils/utils';

export enum RenderType {
  EMBED,
  REPLY,
  NORMAL,
  WEBHOOK,
}

type RenderContentContext = RenderMessageContext & {
  type: RenderType;

  _internal?: {
    largeEmojis?: boolean;
  };
};

/**
 * Renders discord markdown content
 * @param content - The content to render
 * @param context - The context to render the content in
 * @returns
 */
export default async function MessageContent({ content, context }: { content: string; context: RenderContentContext }) {
  if (context.type === RenderType.REPLY && content.length > 180) content = content.slice(0, 180) + '...';

  // parse the markdown
  const parsed = parse(
    content,
    context.type === RenderType.EMBED || context.type === RenderType.WEBHOOK ? 'extended' : 'normal'
  );

  // check if the parsed content is only emojis
  const isOnlyEmojis = parsed.every(
    (node: any) => ['emoji', 'twemoji'].includes(node.type) || (node.type === 'text' && node.content.trim().length === 0)
  );
  if (isOnlyEmojis) {
    // now check if there are less than or equal to 25 emojis
    const emojis = parsed.filter((node: any) => ['emoji', 'twemoji'].includes(node.type));
    if (emojis.length <= 25) {
      context._internal = {
        largeEmojis: true,
      };
    }
  }

  return <MessageASTNodeList nodes={parsed} context={context} />;
}

// This function can probably be combined into the MessageSingleASTNode function
async function MessageASTNodeList({
  nodes,
  context,
}: {
  nodes: ASTNode;
  context: RenderContentContext;
}): Promise<React.JSX.Element> {
  if (Array.isArray(nodes)) {
    return (
      <>
        {nodes.map((node: any, i: number) => (
          <MessageSingleASTNode node={node} context={context} key={i} />
        ))} 
      </>
    );
  } else {
    return <MessageSingleASTNode node={nodes} context={context} />;
  }
}

export async function MessageSingleASTNode({ node, context }: { node: SingleASTNode; context: RenderContentContext }) {
  if (!node) return null;

  const type = node.type as string;

  switch (type) {
    case 'text':
      return node.content;

    case 'link':
      return (
        <a href={node.target}>
          <MessageASTNodeList nodes={node.content} context={context} />
        </a>
      );

    case 'url':
    case 'autolink':
      return (
        <a href={node.target} target="_blank" rel="noreferrer">
          <MessageASTNodeList nodes={node.content} context={context} />
        </a>
      );

    case 'blockQuote':
      if (context.type === RenderType.REPLY) {
        return <MessageASTNodeList nodes={node.content} context={context} />;
      }

      return (
        <DiscordQuote>
          <MessageASTNodeList nodes={node.content} context={context} />
        </DiscordQuote>
      );

    case 'br':
    case 'newline':
      if (context.type === RenderType.REPLY) return ' ';
      return <br />;

    case 'channel': {
      const id = node.id as string;
      const channel = await context.callbacks.resolveChannel(id);

      return (
        <DiscordMention type={channel ? (isDMBasedChannel(channel) ? 'channel' : getChannelTypeFrom(channel.type)) : 'channel'}>
          {channel ? (isDMBasedChannel(channel) ? 'DM Channel' : channel.name) : `<#${id}>`}
        </DiscordMention>
      );
    }

    case 'role': {
      const id = node.id as string;
      const role = await context.callbacks.resolveRole(id);

      return (
        <DiscordMention type="role" color={context.type === RenderType.REPLY ? undefined : role?.hexColor}>
          {role ? role.name : `<@&${id}>`}
        </DiscordMention>
      );
    }

    case 'user': {
      const id = node.id as string;
      const user = await context.callbacks.resolveUser(id);

      return <DiscordMention type="user">{user ? (user.displayName ?? user.username) : `<@${id}>`}</DiscordMention>;
    }

    case 'here':
    case 'everyone':
      return (
        <DiscordMention type={'role'} highlight>
          {`@${type}`}
        </DiscordMention>
      );

    case 'codeBlock':
      if (context.type !== RenderType.REPLY) {
        return <DiscordCodeBlock language={node.lang} code={node.content} />;
      }
      return <DiscordInlineCode>{node.content}</DiscordInlineCode>;

    case 'inlineCode':
      return <DiscordInlineCode>{node.content}</DiscordInlineCode>;

    case 'em':
      return (
        <DiscordItalic>
          <MessageASTNodeList nodes={node.content} context={context} />
        </DiscordItalic>
      );

    case 'strong':
      return (
        <DiscordBold>
          <MessageASTNodeList nodes={node.content} context={context} />
        </DiscordBold>
      );

    case 'underline':
      return (
        <DiscordUnderlined>
          <MessageASTNodeList nodes={node.content} context={context} />
        </DiscordUnderlined>
      );

    case 'strikethrough':
      return (
        <s>
          <MessageASTNodeList nodes={node.content} context={context} />
        </s>
      );

    case 'emoticon':
      return typeof node.content === 'string' ? (
        node.content
      ) : (
        <MessageASTNodeList nodes={node.content} context={context} />
      );

    case 'spoiler':
      return (
        <DiscordSpoiler>
          <MessageASTNodeList nodes={node.content} context={context} />
        </DiscordSpoiler>
      );

    case 'emoji':
    case 'twemoji':
      return (
        <DiscordCustomEmoji
          name={node.name}
          url={parseDiscordEmoji(node as APIMessageComponentEmoji)}
          embedEmoji={context.type === RenderType.EMBED}
          largeEmoji={context._internal?.largeEmojis}
        />
      );

    case 'timestamp':
      return <DiscordTime timestamp={parseInt(node.timestamp) * 1000} format={node.format} />;

    default: {
      console.log(`Unknown node type: ${type}`, node);
      return typeof node.content === 'string' ? (
        node.content
      ) : (
        <MessageASTNodeList nodes={node.content} context={context} />
      );
    }
  }
}

export function getChannelType(channelType: any): 'channel' | 'voice' | 'thread' | 'forum' {
  return getChannelTypeFrom(channelType);
}
