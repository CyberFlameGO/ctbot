import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command } from './Command';
import { trimIndent } from '../utils';

export default class HelpCommand extends Command {
    builder = new SlashCommandBuilder()
        .setName('help')
        .setDescription('Provides some basic information about ctbot');

    async execute(interaction: CommandInteraction): Promise<void> {
        const embed = this.makeEmbed(interaction)
            .setTitle('ctbot help')
            .setDescription('ctbot is the friendly ChatTriggers bot designed to help you with all of your CT needs!')
            .addField(
                'Commands', 
                trimIndent`
                    \`/links\` - Display some useful CT-related links
                    \`/mcp\` - Lookup obfuscated Minecraft class, method, and field names
                    \`/docs\` - Search the CT docs
                `, 
                false,
            );

        this.send(interaction, embed);
    }
}
