const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = [
    {
        name: 'play',
        description: 'Play music from YouTube URL',
        async execute(message, args) {
            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) return message.reply('Join a voice channel first.');

            const permissions = voiceChannel.permissionsFor(message.client.user);
            if (!permissions.has('Connect') || !permissions.has('Speak')) {
                return message.reply('I need permissions to join and speak!');
            }

            const url = args[0];
            if (!url || !ytdl.validateURL(url)) return message.reply('Provide a valid YouTube URL.');

            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
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
