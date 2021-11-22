import './scripts/load-env';

import commands from './src/commands/index'; 
import client from './src/client';
import { closeWebsocket } from './src/websocket/websocket';

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

client.login(process.env.DISCORD_TOKEN);

process.on('SIGINT', () => {
    closeWebsocket();
    setTimeout(() => {
        client.destroy();
    }, 500);
});
