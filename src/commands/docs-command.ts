import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from './Command';
import { sanitizeInput, extractTop } from '../utils';
import terms from '../../kdoc/dist/terms.json';

export default class DocsCommand extends Command {
    builder = new SlashCommandBuilder()
        .setName('docs')
        .setDescription('Search the CT docs')
        .addStringOption(option => option
            .setName('search-term')
            .setDescription('The term to search the CT docs for')
            .setRequired(true));

    async execute(interaction: CommandInteraction): Promise<void> {
        const term = interaction.options.getString('search-term', true);
        const top = extractTop(term, terms, s => s.name, 5);
        const title = `Search results for "${sanitizeInput(term)}"`;
        const description = top.map(term => `[${term.descriptor}](${term.url})`).join('\n');

        const embed = this.makeEmbed(interaction)
            .setTitle(title)
            .setDescription(description);

        this.send(interaction, embed);
    }
}
