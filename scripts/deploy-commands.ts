import './load-env';

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { TOKEN, CLIENT_ID, GUILD_ID } from '../src/config';
import commands from '../src/commands';

const rest = new REST({ version: '9' }).setToken(TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands.build() })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
