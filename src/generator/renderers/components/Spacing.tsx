import React from 'react';
import { SeparatorSpacingSize } from 'discord.js-selfbot-v13';

function DiscordSeparator({ divider, spacing }: { divider: boolean; spacing: any }) {
  return (
    <div
      style={{
        width: '100%',
        height: divider ? '1px' : '0px',
        backgroundColor: '#4f5359',
        margin: spacing === (SeparatorSpacingSize as any)?.Large ? '8px 0' : '0',
      }}
    />
  );
}

export default DiscordSeparator;
