import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from './Command';
import { classesFromName, fieldsFromName, methodsFromName } from '../mcp';
import { ratio, sanitizeInput, trimIndent } from '../utils';

export default class MCPCommand extends Command {
    builder = new SlashCommandBuilder()
        .setName('mcp')
        .setDescription('Lookup obfuscated Minecraft class, method, and field names')
        .addStringOption(option => option
            .setName('type')
            .setDescription('The type of mapping to search for')
            .addChoices([['class', 'class'], ['method', 'method'], ['field', 'field']])
            .setRequired(true))
        .addStringOption(option => option
            .setName('name')
            .setDescription('The name to search for, either obfuscated or non-obfuscated. Does not have to be an exact match.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('owner')
            .setDescription('The owning class of the mapping to search for. Does not have to be an exact match')
            .setRequired(false));

    async execute(interaction: CommandInteraction): Promise<void> {
        const type = interaction.options.getString('type', true);
        const name = interaction.options.getString('name', true);
        const owner = interaction.options.getString('owner', false);

        const isObf = name.startsWith('func_') || name.startsWith('field_');
        const embed = this.makeEmbed(interaction);

        if (type === 'field') {
            const fields = fieldsFromName(name, isObf);
            const sorted = owner ? fields.sort((a, b) => ratio(b.owner, owner) - ratio(a.owner, owner)) : fields;

            const title = `MCP field search results for "${sanitizeInput(name)}"`;
            const description = sorted.map(field => {
                const firstName = isObf ? field.obfName : field.name;
                const secondName = isObf ? field.name : field.obfName;

                return trimIndent`
                    **•** \`${firstName}\` → \`${secondName}\`
                    \u2002\u2002 Owner: \`${field.owner}\`
                `;
            }).join('\n\n');

            embed.setTitle(title).setDescription(description);
        } else if (type === 'method') {
            const methods = methodsFromName(name, isObf);
            const sorted = owner ? methods.sort((a, b) => ratio(b.owner, owner) - ratio(a.owner, owner)) : methods;

            const title = `MCP method search results for "${sanitizeInput(name)}"`;
            const description = sorted.map(method => {
                const firstName = isObf ? method.obfName : method.name;
                const secondName = isObf ? method.name : method.obfName;
                
                return trimIndent`
                    **•** \`${firstName}\` → \`${secondName}\`
                    \u2002\u2002 Owner: \u2002\u2002\`${method.owner}\`
                    \u2002\u2002 Signature: \`${method.signature}\`
                `;
            }).join('\n\n');

            embed.setTitle(title).setDescription(description);
        } else {
            const classes = classesFromName(name);

            const title = `MCP class search results for "${name}"`;
            const description = classes.map(clazz => {
                return `**•** \`${clazz.path}\``;
            }).join('\n');

            embed.setTitle(title).setDescription(description);
        }

        this.send(interaction, embed);
    }
}
