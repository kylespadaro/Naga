const Eris = require('eris');
const config = require('../configs/config.json');
const secret = require('../configs/secret.json');
const { readFileSync, writeFileSync } = require('fs');
const topics = require('./assets/topics.json');

const COMMAND_COOLDOWN = 600000;

const Constants = Eris.Constants;

class CommandHandler {
    constructor() {
        const bot = new Eris(secret.bot.token, {
            intents: [ 
                'guilds',  
                'guildBans', 
                'guildEmojis', 
                'guildIntegrations',
                'guildWebhooks',
                'guildInvites',
                'guildVoiceStates',
                'guildMessages',
                'guildMessageReactions',
                'guildMessageTyping',
                'directMessages',
                'directMessageReactions',
                'directMessageTyping',
                'guildPresences',
                'guildMembers'
            ]
        });

        bot.on("ready", async () => { // When the bot is ready
            console.log("Slash command handler ready!"); // Log "Ready!"

            //Note: You should use guild commands to test, as they update instantly. Global commands can take up to an hour to update.

            const commands = await bot.getCommands();

            if(!commands.length) {
                bot.createCommand({
                    name: "topic",
                    description: "Topic",
                    type: Constants.ApplicationCommandTypes.CHAT_INPUT //Not required for Chat input type, but recommended
                }); //Create a chat input command
            }
        });

        bot.on("error", (err) => {
            console.error(err); // or your preferred logger
        });

        function handleCooldown() {
            let data = readFileSync('src/assets/cooldown.json');
            let lastUsed = JSON.parse(data);

            const timeLeft = Date.now() - lastUsed;
            if (timeLeft <= COMMAND_COOLDOWN) {
                let time = Math.ceil((600000 - timeLeft) / 100) / 10
                let minutes = Math.floor(time / 60);
                let seconds = Math.ceil(time - minutes * 60);
                if (minutes === 0) {
                    return `${seconds} sec`;
                } else {
                    return `${minutes} minutes ${seconds} seconds`;
                }
            } else return false;
        }

        function getColor(color) {
            let colors = {
            red: 15747399,
            yellow: 16439902,
            green: 4437377,
            blue: 9031664,
            darkblue: 26544,
            spotify: 1947988
            }
    
            return colors[color];
        }

        bot.on("interactionCreate", (interaction) => {
            if(interaction instanceof Eris.CommandInteraction) {
                switch(interaction.data.name) {
                    case "topic":
                        let timeRemaining = handleCooldown();
                        if (timeRemaining !== false) {
                            return interaction.createMessage(`This command has already been used recently!\nTry again in **${timeRemaining}**!`);
                        }
                        const topic = Math.floor(Math.random() * topics.length);
                        
                        return interaction.createMessage({
                            embed: {
                                color: getColor('blue'),
                                description: topics[topic],
                                footer: { text: 'Check out our new Legend of Korra topics - n.topic korra'}
                            }
                        }).then(writeFileSync('src/assets/cooldown.json', JSON.stringify(msg.createdAt)));
                    default: {
                        return interaction.createMessage("test");
                    }
                }
            }
        });

        bot.connect(); // Get the bot to connect to Discord
    }
}

module.exports = CommandHandler;