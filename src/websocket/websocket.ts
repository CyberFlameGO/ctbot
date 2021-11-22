import { Channel, MessageEmbed, TextChannel } from 'discord.js';
import WebSocket from 'ws';
import client, { modulesChannel } from '../client';
import { BOTLAND_CHANNEL_ID, GUILD_ID } from '../config';
import { truncate } from '../utils';
import { Event } from './types';

const isTextChannel = (channel: Channel | undefined): channel is TextChannel => {
    if (!channel)
        return false;
    return (channel as TextChannel).send !== undefined;
};

const ws = new WebSocket('ws://chattriggers.com/api/events');

let heartbeatTimeout: NodeJS.Timer;

let manuallyClosed = false;

export const closeWebsocket = () => {
    manuallyClosed = true;
    ws.terminate();
    clearInterval(heartbeatTimeout);
};

const heartbeat = () => {
    ws.ping('still alive');
};

ws.on('open', () => {
    console.log('WebSocket opened');
    heartbeatTimeout = setInterval(heartbeat, 50_000);
});

ws.on('close', (code, reason) => {
    console.log(`WebSocket closed. code=${code} reason=${reason.toString()}`);
    clearInterval(heartbeatTimeout);
    if (manuallyClosed)
        return;

    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild)
        throw new Error('Cannot find CT guild');

    const channel = guild.channels.cache.get(BOTLAND_CHANNEL_ID);
    if (!isTextChannel(channel))
        throw new Error('Cannot find #botland');

    channel.send('<@110615438873853952> WebSocket unexpectedly closed');
});

ws.on('error', err => {
    console.log(`WebSocket error: ${err.message}`);
});

ws.on('message', data => {
    const event = JSON.parse(data.toString()) as Event;
    const channel = modulesChannel();
    
    const embed = new MessageEmbed()
        .setColor(0x7b2fb5)
        .setTimestamp();

    if (event.type === 'module_created') {
        const { module } = event;

        embed.setTitle(`Module created: ${module.name}`)
            .setURL(`https://www.chattriggers.com/modules/v/${module.name}`)
            .addField('Author', module.owner.name, true);

        if (module.tags.length > 0)
            embed.addField('Tags', module.tags.join(', '), true);

        const description = truncate(module.description.trim(), 600);
        if (description.length > 0)
            embed.addField('Description', description, false);

        const image = module.image.trim();
        if (image.length > 0)
            embed.setImage(image);
    } else if (event.type === 'module_deleted') {
        embed.setTitle(`Module deleted: ${event.module.name}`);
    } else {
        const { module, release } = event;

        embed.setTitle(`Release created for module: ${module.name}`)
            .setURL(`https://www.chattriggers.com/modules/v/${module.name}`)
            .addField('Author', module.owner.name, true);

        embed.addField('Release Version', release.releaseVersion, true);
        embed.addField('Mod Version', release.modVersion, true);

        const changelog = truncate(release.changelog.trim(), 600);
        if (changelog.length > 0) 
            embed.addField('Changelog', changelog, false);
    }

    channel.send({ embeds: [embed] });
});
