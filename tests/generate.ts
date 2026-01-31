import * as discord from 'discord.js-selfbot-v13';
import { createTranscript } from '../src';

import { config } from 'dotenv';
config();

const client = new discord.Client();

client.on('ready', async () => {
  console.log('Fetching channel: ', process.env.CHANNEL!);
  const channel = await client.channels.fetch(process.env.CHANNEL!);

  if (!channel || (typeof (channel as any).isTextBased === 'function' ? !(channel as any).isTextBased() : !(['GUILD_TEXT','DM','GROUP_DM'].includes((channel as any).type)))) {
    console.error('Invalid channel provided.');
    process.exit(1);
  }

  console.time('transcript');

  const attachment = await createTranscript(channel, {
    // options go here
  });

  console.timeEnd('transcript');

  await (channel as discord.TextChannel).send({
    content: 'Here is the transcript',
    files: [attachment],
  });

  client.destroy();
  process.exit(0);
});

client.login(process.env.TOKEN!);
