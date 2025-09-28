const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = [
  {
    name: 'play',
    async execute(message, args) {
      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel) return message.reply('Join voice channel first');

      const perms = voiceChannel.permissionsFor(message.client.user);
      if (!perms.has('Connect') || !perms.has('Speak')) return message.reply('Need permission to join and speak');

      const url = args[0];
      if (!url || !ytdl.validateURL(url)) return message.reply('Provide valid YouTube URL');

      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
      });

      const stream = ytdl(url, { filter: 'audioonly' });
      const resource = createAudioResource(stream);
      const player = createAudioPlayer();

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
      });

      message.channel.send(`Now playing: ${url}`);
    }
  }
];
