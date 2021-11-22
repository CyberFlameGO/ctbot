import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { BOTLAND_CHANNEL_ID } from '../config';
import { Command } from './Command';

export default class BotCommand extends Command {
    builder = new SlashCommandBuilder()
        .setName('bot')
        .setDescription('bot');

    async execute(interaction: CommandInteraction): Promise<void> {
        if (interaction.channelId === BOTLAND_CHANNEL_ID)
            interaction.reply('land');
    }
}
