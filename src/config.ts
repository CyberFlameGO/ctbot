export const TOKEN = process.env.DISCORD_TOKEN as string;
export const CLIENT_ID = process.env.DISCORD_CLIENT_ID as string;
export const GUILD_ID = process.env.DISCORD_GUILD_ID as string;
export const BOTLAND_CHANNEL_ID = process.env.DISCORD_BOTLAND_CHANNEL_ID as string;
export const MODULES_CHANNEL_ID = process.env.DISCORD_MODULES_CHANNEL_ID as string;

export const NO_EMOJI_ROLE_ID = '745047588381917216';
export const NO_QUOTES_ROLE_ID = '746096240978296953';

export const ALLOWED_ROLES = new Set([
    '436707819752783872', // Admin
    '119493795434856448', // Developer
    '271357115006713858', // Moderator
    '270252320611106817', // Creator
    '420668245725413377', // Patreon Supporter
]);
