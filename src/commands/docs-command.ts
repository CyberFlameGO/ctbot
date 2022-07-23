import { readFileSync } from 'fs';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from './Command';
import { sanitizeInput, extractTop } from '../utils';

interface Term {
    name: string;
    descriptor: string;
    url: string;
}

let terms: Term[] | undefined;

export default class DocsCommand extends Command {
    builder = new SlashCommandBuilder()
        .setName('docs')
        .setDescription('Search the CT docs')
        .addStringOption(option => option
            .setName('search-term')
            .setDescription('The term to search the CT docs for')
            .setRequired(true));

    async execute(interaction: CommandInteraction): Promise<void> {
        if (terms === undefined) {
            const termsPath = process.env.TERMS_PATH;
            if (termsPath === undefined)
                throw new Error('TERMS_PATH environment variable not found');
            terms = JSON.parse(readFileSync(termsPath, 'utf8'));
        }

        const term = interaction.options.getString('search-term', true);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const top = extractTop(term, terms!, s => s.name, 5);
        const title = `Search results for "${sanitizeInput(term)}"`;
        const description = top.map(term => {
            const url = `https://chattriggers.com/javadocs/${term.url}`;
            return `[${term.descriptor}](${url})`;
        }).join('\n');

        const embed = this.makeEmbed(interaction)
            .setTitle(title)
            .setDescription(description);

        this.send(interaction, embed);
    }
}
