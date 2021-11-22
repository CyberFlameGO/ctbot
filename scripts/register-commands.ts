import './load-env';

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { TOKEN, CLIENT_ID, GUILD_ID } from '../src/config';
import commands from '../src/commands';

const rest = new REST({ version: '9' }).setToken(TOKEN);

const guildCommandsRoute = Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID);

rest.get(guildCommandsRoute)
    .then(commands => {
        if (!Array.isArray(commands))
            throw new Error('expected commands to be an array');
        
        const deletions = [] as Promise<void>[];
        for (const command of commands) {
            const promise: Promise<void> = new Promise((resolve, reject) => {
                console.log(`Deleting command "${command.id}"...`);
                rest.delete(`${guildCommandsRoute}/${command.id}`)
                    .then(() => {
                        console.log(`Deleted command "${command.id}"`);
                        resolve();
                    }).catch(err => {
                        console.error(`Error deleting "${command.id}": ${err}`);
                        reject(err);
                    });
            });
            deletions.push(promise);
        }
        return Promise.all(deletions);
    })
    .then(() => rest.put(guildCommandsRoute, { body: commands.build() }))
    .catch(console.error);
