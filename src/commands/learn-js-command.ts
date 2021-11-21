import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { trimIndent } from '../utils';
import { Command } from './Command';

export default class LearnJSCommand extends Command {
    builder = new SlashCommandBuilder()
        .setName('learnjs')
        .setDescription('Display some useful resources for learning JavaScript');

    async execute(interaction: CommandInteraction): Promise<void> {
        const embed = this.makeEmbed(interaction)
            .setTitle('JavaScript Links')
            .setDescription(
                trimIndent`
                    You need some basic JavaScript knowledge to use ChatTriggers, and the best place to do that is a \
                    dedicated JavaScript tutorial. Here are some good places to start!
                    [Official Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
                    [Tutorial with Interactive Editor](https://www.codecademy.com/learn/introduction-to-javascript)
                `,
            );

        this.send(interaction, embed);
    }
}
