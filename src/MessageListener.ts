import { Message, PartialMessage } from 'discord.js';
import { BOTLAND_CHANNEL_ID, NO_EMOJI_ROLE_ID, NO_QUOTES_ROLE_ID } from './config';

type MaybePartialMessage = Message | PartialMessage;

const emojiRegex = /<a?:.+:\d+>/;
const quoteRegex = /> .+\n<@[!&#]?[0-9]{16,18}>/;

const containsEmoji = (message: string) => message.match(emojiRegex);
const containsQuotes = (message: string) => message.match(quoteRegex);

class MessageListener {
    onMessageCreate(message: Message) {
        if (message.channelId === BOTLAND_CHANNEL_ID && message.content === 'bot') {
            message.reply('land');
        } else {
            const roles = [...(message.member?.roles.cache.values() ?? [])].map(role => role.id);
            if (roles.indexOf(NO_EMOJI_ROLE_ID) !== -1 && containsEmoji(message.content)) {
                message.delete();
            } else if (roles.indexOf(NO_QUOTES_ROLE_ID) !== -1 && containsQuotes(message.content)) {
                message.delete();
            }
        }
    }

    onMessageUpdate(oldMessage: MaybePartialMessage, newMessage: MaybePartialMessage) {
        if (!newMessage.content)
            return;
        const roles = [...(newMessage.member?.roles.cache.values() ?? [])].map(role => role.id);
        if (roles.indexOf(NO_EMOJI_ROLE_ID) !== -1 && containsEmoji(newMessage.content)) {
            newMessage.delete();
        } else if (roles.indexOf(NO_QUOTES_ROLE_ID) !== -1 && containsQuotes(newMessage.content)) {
            newMessage.delete();
        }
    }
}

export default new MessageListener();
