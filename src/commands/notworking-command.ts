import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command } from './Command';
import { trimIndent } from '../utils';

export default class NotWorkingCommand extends Command {
    builder = new SlashCommandBuilder()
        .setName('notworking')
        .setDescription('"help, my code doesn\'t work"');

    async execute(interaction: CommandInteraction): Promise<void> {
        const embed = this.makeEmbed(interaction)
            .setTitle('Is something not working?')
            .setDescription(
                trimIndent`
                    Hello! If your code isn't functioning in the way you think it should, you've come to the right place! \
                    The members of the CT discord are happy to help you, but we aren't mind readers. \
                    In order for us to support you, we'll need some information. \
                    Most importantly, we need to see your code and an error message if one exists. \
                    To check for error messages, type \`/ct console js\` into Minecraft.
                `,
            );

        this.send(interaction, embed);
    }
}
