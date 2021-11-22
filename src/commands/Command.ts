import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMemberRoleManager, MessageEmbed } from 'discord.js';
import { BOTLAND_CHANNEL_ID, ALLOWED_ROLES, GUILD_ID } from '../config';

export type BuilderType = Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

export abstract class Command {
    abstract builder: BuilderType;

    abstract execute(interaction: CommandInteraction): Promise<void>;

    makeEmbed(interaction: CommandInteraction) {
        return new MessageEmbed()
            .setColor(0x7b2fb5)
            .setTimestamp()
            .setFooter(`Query by ${interaction.user.username}`);
    }

    send(interaction: CommandInteraction, embed: MessageEmbed) {
        interaction.reply({ embeds: [embed], ephemeral: !this.isAllowed(interaction) });
    }

    isAllowed(interaction: CommandInteraction): boolean {
        if (!interaction.member)
            return true;
        const roles = [...(interaction.member.roles as GuildMemberRoleManager).cache.values()];

        return interaction.guildId !== GUILD_ID 
            || process.env.NODE_ENV !== 'production' 
            || interaction.channelId === BOTLAND_CHANNEL_ID
            || roles.find(role => ALLOWED_ROLES.has(role.id)) !== undefined;
    }
}
