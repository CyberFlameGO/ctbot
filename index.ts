import './scripts/load-env';

import Cache from 'node-cache';
import { closeWebsocket } from './src/websocket/websocket';
import client from './src/client';
import commands from './src/commands/index';
import MessageListener from './src/MessageListener';

client.once('ready', () => {
    console.log('Ready!');
});

const commandCache = new Cache();

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand())
        return;

    const cacheEntry = commandCache.get(interaction.member.user.id) as number | undefined;
    if (cacheEntry && cacheEntry > Date.now() - 10_000) {
        interaction.reply({
            content: 'You are entering commands too quickly!',
            ephemeral: true,
        });
        return;
    }

    commandCache.set(interaction.member.user.id, Date.now());

    const command = commands.get(interaction.commandName);
    if (!command)
        return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an internal error while executing this command, please tell <@110615438873853952>.',
            ephemeral: true,
        });
    }
});

client.on('messageCreate', MessageListener.onMessageCreate);

client.on('messageUpdate', MessageListener.onMessageUpdate);

client.login(process.env.DISCORD_TOKEN);

process.on('SIGINT', () => {
    closeWebsocket();
    setTimeout(() => {
        client.destroy();
    }, 500);
});
