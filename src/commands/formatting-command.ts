import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command } from './Command';

export default class FormattingCommand extends Command {
    builder = new SlashCommandBuilder()
        .setName('formatting')
        .setDescription('Display instructions for properly formatting JS code blocks');

    async execute(interaction: CommandInteraction): Promise<void> {
        interaction.reply({ 
            content: 'When pasting JS code into discord, please format it properly. See the image below for an example.',
            files: ['./assets/formatting.png'],
            ephemeral: !this.isAllowed(interaction),
        });
    }
}
