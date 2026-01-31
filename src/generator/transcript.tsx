import { DiscordHeader, DiscordMessages as DiscordMessagesComponent } from '@derockdev/discord-components-react';
import React from 'react';
import type { RenderMessageContext } from '.';
import { isDMBasedChannel, isThreadChannel, isVoiceBasedChannel } from '../utils/djsAdapter';
import MessageContent, { RenderType } from './renderers/content';
import DiscordMessage from './renderers/message';
import { globalStyles } from './renderers/components/styles';

/**
 * The core transcript component.
 * Expects window.$discordMessage.profiles to be set for profile information.
 *
 * @param props Messages, channel details, callbacks, etc.
 * @returns
 */
export default async function DiscordMessages({ messages, channel, callbacks, ...options }: RenderMessageContext) {
  return (
    <DiscordMessagesComponent style={{ minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <DiscordHeader
        guild={isDMBasedChannel(channel) ? 'Direct Messages' : channel.guild?.name}
        channel={
          isDMBasedChannel(channel)
            ? (channel.recipient?.tag ?? 'Unknown Recipient')
            : channel.name
        }
        icon={isDMBasedChannel(channel) ? undefined : (channel.guild?.iconURL?.({ size: 128 }) ?? undefined)}
      >
        {isThreadChannel(channel) ? (
          `Thread channel in ${channel.parent?.name ?? 'Unknown Channel'}`
        ) : isDMBasedChannel(channel) ? (
          `Direct Messages`
        ) : isVoiceBasedChannel(channel) ? (
          `Voice Text Channel for ${channel.name}`
        ) : 'topic' in channel && channel.topic ? (
          <MessageContent
            content={channel.topic}
            context={{ messages, channel, callbacks, type: RenderType.REPLY, ...options }}
          />
        ) : (
          `This is the start of #${channel.name} channel.`
        )}
      </DiscordHeader>
      {/* body */}
      {messages.map((message) => (
        <DiscordMessage message={message} context={{ messages, channel, callbacks, ...options }} key={message.id} />
      ))}
      {/* footer */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        {options.footerText
          ? options.footerText
              .replaceAll('{number}', messages.length.toString())
              .replaceAll('{s}', messages.length > 1 ? 's' : '')
          : `Exported ${messages.length} message${messages.length > 1 ? 's' : ''}.`}{' '}
        {options.poweredBy ? (
          <span style={{ textAlign: 'center' }}>
            Powered by{' '}
            <a href="https://github.com/ItzDerock/discord-html-transcripts" style={{ color: 'lightblue' }}>
              spectre-html-transcripts
            </a>
            .
          </span>
        ) : null}
      </div>
    </DiscordMessagesComponent>
  );
}
