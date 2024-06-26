import * as djs from 'discord.js';
import Base from './Base';
import CommandMetadata from './CommandMetadata';

interface Command {
    cooldown?: number;
    defaultCommand?: string;
    disableDM?: boolean;
    [key: string]: any;
}

/**
 * Abstract class for Command classes
 * @abstract Command
 * @extends Base
 */
abstract class Command extends Base {
    public name: string;
    public abstract aliases: string[];
    public abstract description: string;
    public abstract usage: string|string[];
    public abstract example: string|string[];
    public abstract expectedArgs: number;

    public abstract execute(e: CommandMetadata): Promise<any>;

    public ensureInterface() {
		// required properties
		if (this.aliases == undefined) {
			throw new Error(`${this.constructor.name} command must define aliases property.`);
		}
		if (this.description == undefined) {
			throw new Error(`${this.constructor.name} command must define description property.`);
		}
		if (this.usage == undefined) {
			throw new Error(`${this.constructor.name} command must define usage property.`);
		}

		// required methods
		if (this.execute == undefined) {
			throw new Error(`${this.constructor.name} command must have an execute method.`);
		}

		// warnings
		if (this.expectedArgs == undefined) {
			this.logger.warn(`${this.constructor.name} should defined the expectedArgs property.`);
		}
		this.expectedArgs = this.expectedArgs || 0;
	}

    public help(message: djs.Message): Promise<any> {
        const msg: string[] = [];
        const command: any = this;
        const name = this.name;
        const description = `**Description:**`

        msg.push(description);

        if (command.cooldown) {
            msg.push(`**Cooldown:** ${command.cooldown / 1000} seconds`);
        }
        
        if (command.usage) {
            msg.push(`**Usage:** ${command.usage}`);
        }

        if (command.example) {
            msg.push(`**Example:** ${command.example}`);
        }

        const embed = {
            title: `**Command:** ${name}`,
            description: msg.join('\n')
        };

        return this.sendMessage(message.channel, { embeds: [embed] });
    }

    public _execute(e: CommandMetadata): Promise<any> {
        const { message, args, command } = e;

        if ((this.expectedArgs && args!.length < this.expectedArgs) || (args && args[0] == 'help')) {
            return this.help(message);
        }

        return this.execute(e).then(() => {
        })
    }
}

export default Command;