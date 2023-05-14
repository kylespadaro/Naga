const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const ModUtils = require('../ModUtils');

class SendHotline extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'sendhotline';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'sendhotline',
            description: 'Gives the Self Care Resources role to a member',
            usage: 'sendhotline [member',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            cooldown: 5000,
            guildOnly: true,
        });

        this.modUtils = ModUtils;

        /**
         * @type {CommandPermissions}
        */
        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.dailis,
                bypass: this.axon.staff.owners,
            },
        });
    }

     /**
     * @param {import('axoncore').CommandEnvironment} env
     */

      async execute({ msg, args }) {
        const guild = msg.channel.guild;

        const member = this.utils.resolveUser(guild, args[0]);
        profile.findById(member.id, (err, doc) => {
            const roles = [...member.roles];

            if (roles.includes('388121551779921930')) {
                doc.data.flags.push('SERIOUS_LOCK');
                doc.save();
            };
        });

        await guild.addMemberRole(member.id, '1106789319240335460', 'Given access to self-care resources');
    }   
}

module.exports = SendHotline;