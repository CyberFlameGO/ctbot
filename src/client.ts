import { Client, Guild, Intents, TextChannel } from 'discord.js';
import { BOTLAND_CHANNEL_ID, GUILD_ID, MODULES_CHANNEL_ID } from './config';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
export default client;

let ctGuild_: Guild | undefined;
let modulesChannel_: TextChannel | undefined;
let botlandChannel_: TextChannel | undefined;

const guild = (): Guild => {
    if (!ctGuild_)
        ctGuild_ = client.guilds.cache.get(GUILD_ID);
    return ctGuild_ as Guild;
};

export const modulesChannel = (): TextChannel => {
    if (!modulesChannel_) {
        const channel = guild().channels.cache.get(MODULES_CHANNEL_ID);
        if (!channel)
            throw new Error('Unable to get #modules');
        modulesChannel_ = channel as TextChannel;
    }

    return modulesChannel_ as TextChannel;
};

export const botlandChannel = (): TextChannel => {
    if (!botlandChannel_) {
        const channel = guild().channels.cache.get(BOTLAND_CHANNEL_ID);
        if (!channel)
            throw new Error('Unable to get #botland');
        botlandChannel_ = channel as TextChannel;
    }

    return botlandChannel_ as TextChannel;
};
