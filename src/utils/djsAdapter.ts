/**
 * Small adapter utilities to provide compatibility between discord.js v14+ (enum/numeric APIs)
 * and discord.js-selfbot-v13 (string-based channel types and missing helper methods).
 */

export function isTextBasedChannel(channel: any): boolean {
  if (!channel) return false;
  if (typeof channel.isTextBased === 'function') return channel.isTextBased();
  const t = channel.type;
  return ['GUILD_TEXT', 'DM', 'GROUP_DM', 'GUILD_NEWS', 'GUILD_FORUM'].includes(t);
}

export function isDMBasedChannel(channel: any): boolean {
  if (!channel) return false;
  if (typeof channel.isDMBased === 'function') return channel.isDMBased();
  const t = channel.type;
  return t === 'DM' || t === 'GROUP_DM';
}

export function isThreadChannel(channel: any): boolean {
  if (!channel) return false;
  if (typeof channel.isThread === 'function') return channel.isThread();
  const t = channel.type;
  return t && t.toString().toUpperCase().includes('THREAD');
}

export function isVoiceBasedChannel(channel: any): boolean {
  if (!channel) return false;
  if (typeof channel.isVoiceBased === 'function') return channel.isVoiceBased();
  const t = channel.type;
  return t === 'GUILD_VOICE' || t === 'GUILD_STAGE_VOICE';
}

export function getChannelTypeFrom(type: any): 'channel' | 'voice' | 'thread' | 'forum' {
  // Accept both numeric enums (v14) and string types (v13)
  if (typeof type === 'number') {
    // Common mapping for v14 numeric values
    switch (type) {
      // category / text-like
      case 4: // GuildCategory
      case 15: // GuildAnnouncement
      case 0: // GuildText
      case 1: // DM
      case 3: // GroupDM
      case 14: // GuildDirectory
      case 16: // GuildMedia
        return 'channel';
      case 2: // GuildVoice
      case 13: // GuildStageVoice
        return 'voice';
      case 11: // PublicThread
      case 12: // PrivateThread
      case 10: // AnnouncementThread
        return 'thread';
      case 15: // GuildForum (overlaps in enums across versions)
        return 'forum';
      default:
        return 'channel';
    }
  }

  if (typeof type === 'string') {
    switch (type) {
      case 'DM':
      case 'GROUP_DM':
      case 'GUILD_TEXT':
      case 'GUILD_ANNOUNCEMENT':
      case 'GUILD_CATEGORY':
      case 'GUILD_DIRECTORY':
      case 'GUILD_MEDIA':
        return 'channel';
      case 'GUILD_VOICE':
      case 'GUILD_STAGE_VOICE':
        return 'voice';
      case 'GUILD_PUBLIC_THREAD':
      case 'GUILD_PRIVATE_THREAD':
      case 'GUILD_NEWS_THREAD':
        return 'thread';
      case 'GUILD_FORUM':
        return 'forum';
      default:
        return 'channel';
    }
  }

  return 'channel';
}
