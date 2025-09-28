module.exports = [
  {
    name: 'kick',
    async execute(message, args) {
      if (!message.member.permissions.has('KickMembers')) return message.reply('No permission');
      const member = message.mentions.members.first();
      if (!member) return message.reply('Mention user to kick');
      if (!member.kickable) return message.reply('Cannot kick this user');
      await member.kick();
      message.channel.send(`${member.user.tag} was kicked.`);
    }
  },
  {
    name: 'ban',
    async execute(message, args) {
      if (!message.member.permissions.has('BanMembers')) return message.reply('No permission');
      const member = message.mentions.members.first();
      if (!member) return message.reply('Mention user to ban');
      if (!member.bannable) return message.reply('Cannot ban this user');
      await member.ban();
      message.channel.send(`${member.user.tag} was banned.`);
    }
  },
  {
    name: 'mute',
    async execute(message, args) {
      if (!message.member.permissions.has('MuteMembers')) return message.reply('No permission');
      const member = message.mentions.members.first();
      if (!member) return message.reply('Mention user to mute');
      let muteRole = message.guild.roles.cache.find(r => r.name === 'Muted');
      if (!muteRole) {
        try {
          muteRole = await message.guild.roles.create({ name: 'Muted', permissions: [] });
          message.guild.channels.cache.forEach(channel => {
            channel.permissionOverwrites.edit(muteRole, {
              SendMessages: false,
              Speak: false,
              AddReactions: false
            });
          });
        } catch {
          return message.reply('Failed to create Muted role.');
        }
      }
      await member.roles.add(muteRole);
      message.channel.send(`${member.user.tag} was muted.`);
    }
  }
];
