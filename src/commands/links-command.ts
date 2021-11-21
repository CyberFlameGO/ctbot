import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command } from './Command';
import { trimIndent } from '../utils';

export default class LinksCommand extends Command {
    builder = new SlashCommandBuilder()
        .setName('links')
        .setDescription('Display some useful CT-related links');

    async execute(interaction: CommandInteraction): Promise<void> {
        const embed = this.makeEmbed(interaction)
            .setTitle('Links')
            .setDescription(
                trimIndent`
                    [CT Website](https://www.chattriggers.com/)
                    [CT Modules](https://www.chattriggers.com/modules)
                    [Learn JavaScript](https://www.w3schools.com/js/)
                    [CT GitHub Repo](https://github.com/ChatTriggers/ChatTriggers)
                    [CT GitHub Organization](https://github.com/ChatTriggers)
                `,
            );

        this.send(interaction, embed);
    }
}
