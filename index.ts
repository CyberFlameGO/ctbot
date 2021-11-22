import './scripts/load-env';

import { Client, Intents } from 'discord.js';
import commands from './src/commands/index';
import MessageListener from './src/MessageListener';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand())
        return;

    const command = commands.get(interaction.commandName);
    if (!command)
        return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an internal error while executing this command, please tell @Matt.',
            ephemeral: true,
        });
    }
});

client.on('messageCreate', MessageListener.onMessageCreate);

client.on('messageUpdate', MessageListener.onMessageUpdate);

client.login(process.env.DISCORD_TOKEN);

process.on('SIGINT', () => {
    client.destroy();
});
