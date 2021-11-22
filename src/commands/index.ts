import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types';
import { Command } from './Command';
import DocsCommand from './docs-command';
import FormattingCommand from './formatting-command';
import HelpCommand from './help-command';
import LearnJSCommand from './learn-js-command';
import LinksCommand from './links-command';
import MCPCommand from './mcp-command';
import NotWorkingCommand from './notworking-command';

class Commands {
    private commands = new Map<string, Command>();

    register(command: Command) {
        this.commands.set(command.builder.name, command);
    }

    get(name: string): Command | undefined {
        return this.commands.get(name);
    }

    build(): RESTPostAPIApplicationCommandsJSONBody[] {
        return [...this.commands.values()].map(c => c.builder.toJSON());
    }
}

const commands = new Commands();

commands.register(new LearnJSCommand());
commands.register(new DocsCommand());
commands.register(new HelpCommand());
commands.register(new LinksCommand());
commands.register(new NotWorkingCommand());
commands.register(new MCPCommand());
commands.register(new FormattingCommand());

export default commands;
