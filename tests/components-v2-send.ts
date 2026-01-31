import { Client, Events, TextChannel, ComponentType, MessageFlags } from 'discord.js-selfbot-v13';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client();

/**
 * Runs all component tests sequentially in the specified channel.
 * @param channel The text channel to send messages to.
 */
async function runAllTests(channel: TextChannel) {
  console.log(`🚀 Starting component tests in #${channel.name}...`);

  // --- Test 1: Basic Components (Action Row) ---
  const buttons = [
    {
      type: ComponentType.ActionRow,
      components: [
        { type: ComponentType.Button, custom_id: 'primary_btn', label: 'Primary', style: 1 },
        { type: ComponentType.Button, custom_id: 'secondary_btn', label: 'Secondary', style: 2 },
        { type: ComponentType.Button, custom_id: 'success_btn', label: 'Success', style: 3 },
        { type: ComponentType.Button, custom_id: 'danger_btn', label: 'Danger', style: 4 },
        { type: ComponentType.Button, label: 'Link', url: 'https://discord.com', style: 5, emoji: '🔗' },
      ],
    },
  ];

  const selectMenu = [
    {
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.StringSelect,
          custom_id: 'string_select',
          placeholder: 'Make a selection!',
          options: [
            { label: 'Option 1', description: 'The first option.', value: 'option_1', emoji: '1️⃣' },
            { label: 'Option 2', description: 'The second option.', value: 'option_2', emoji: '2️⃣' },
          ],
        },
      ],
    },
  ];

  await channel.send({
    content: 'Testing standard buttons and a string select menu.',
    components: [buttons, selectMenu],
  });

  // --- Test 2: Media Gallery ---
  await channel.send({
    flags: MessageFlags.IsComponentsV2,
    components: [
      {
        type: ComponentType.Container,
        components: [
          {
            type: ComponentType.MediaGallery,
            items: [
              { media: { url: 'https://placehold.co/400x800.png?text=Tall' }, description: 'Image 1' },
              { media: { url: 'https://placehold.co/400x400.png?text=Square+1' }, description: 'Image 2' },
              { media: { url: 'https://placehold.co/400x400.png?text=Square+2' }, description: 'Image 3' },
            ],
          },
        ],
      },
    ],
  });

  await channel.send({
    flags: MessageFlags.IsComponentsV2,
    components: [
      {
        type: ComponentType.Container,
        components: [
          {
            type: ComponentType.MediaGallery,
            items: [
              ...Array.from({ length: 10 }, (_, i) => ({
                media: { url: `https://placehold.co/300x300.png?text=Image+${i + 1}` },
                description: `Image ${i + 1}`,
              })),
            ],
          },
        ],
      },
    ],
  });

  // --- Test 3: Rich Layout Components ---
  await channel.send({
    flags: MessageFlags.IsComponentsV2,
    components: [
      {
        type: ComponentType.Container, // Container
        components: [
          {
            type: ComponentType.TextDisplay,
            content: 'Hello world',
          },
          {
            type: ComponentType.Section, // Section
            components: [
              {
                type: ComponentType.TextDisplay,
                content: '**This is a Section Header**\nThis section has a button accessory.',
              },
            ],
            accessory: { type: ComponentType.Button, style: 1, label: 'Click Me', custom_id: 'section_btn_1' },
          },
          { type: ComponentType.Separator, divider: true, spacing: 2 }, // Separator
          {
            type: ComponentType.Section, // Section
            components: [
              { type: ComponentType.TextDisplay, content: 'This section has a `Thumbnail` with _markdown_.' },
            ],
            accessory: {
              type: ComponentType.Thumbnail,
              media: { url: 'https://placehold.co/85.png?text=Thumb' },
            },
          },
          {
            type: ComponentType.ActionRow, // Action Row
            components: [
              { type: ComponentType.Button, style: 2, label: 'Final Action', custom_id: 'final_action_btn' },
            ],
          },
        ],
      },
    ],
  });

  console.log('Sent all test messages.');
}

client.once(Events.ClientReady, async (c) => {
  console.log(`🚀 Logged in as ${c.user.tag}`);

  const channelId = process.env.CHANNEL;
  if (!channelId) {
    console.error('Error: CHANNEL environment variable is not set.');
    process.exit(1);
  }

  try {
    const channel = await client.channels.fetch(channelId);

    if (channel && channel instanceof TextChannel) {
      await runAllTests(channel);
    } else {
      console.error(`Could not find channel with ID ${channelId}, or it is not a text channel.`);
    }
  } catch (error) {
    console.error('Failed to run tests:', error);
  } finally {
    console.log('Shutting down bot.');
    client.destroy();
  }
});

const token = process.env.TOKEN;
if (!token) {
  console.error('Error: TOKEN environment variable is not set.');
  process.exit(1);
}

client.login(token);
