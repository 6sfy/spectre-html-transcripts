import React from 'react';
import type { ButtonComponent, ThumbnailComponent } from 'discord.js-selfbot-v13';
import { Component } from '../../components';
import SectionContent from './SectionContent';
import SectionAccessory from './SectionAccessory';

interface DiscordSectionProps {
  children: React.ReactNode;
  accessory?: ButtonComponent | ThumbnailComponent;
  id: number;
  key?: React.Key;
}

function DiscordSection({ children, accessory, id }: DiscordSectionProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        maxWidth: '500px',
      }}
    >
      <SectionContent>{children}</SectionContent>
      <SectionAccessory>{accessory && <Component component={accessory} id={id} />}</SectionAccessory>
    </div>
  );
}

export default DiscordSection;
