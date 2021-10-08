const fs = require('fs');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const {Collection , ApplicationCommandPermissionData} = require('discord.js');
const {clientId, guildId, token} = require('./config');


class CommandDeployer {
    constructor() {
        this.commands = new Collection();
        this.commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        for (const file of this.commandFiles) {
            const command = require(`./commands/${file}`);
            // Set a new item in the Collection
            // With the key as the command name and the value as the exported module
            this.commands.set(command.data.name, command);
        }

        this.slashCommands = this.commands.map(command => command.data.toJSON())

        this.rest = new REST({version: '9'}).setToken(token);
    }

    setClient(client) {
        this.client = client
    }

    loadCommands() {
        return new Promise(((resolve, reject) => {
            this.rest.put(Routes.applicationGuildCommands(clientId, guildId), {body: this.slashCommands})
                .then(() => {
                    console.log('Successfully registered application commands.')
                    resolve(true)
                })
                .catch(error => {
                    reject(error)
                    console.error(error)
                });
        }))
    }

    async setPermissions() {
        let commands = await this.client.guilds.cache.get(guildId)?.commands.fetch()
        for (let command of commands) {
            for (let commandBuilder of this.commands) {
                if (command[1].name === commandBuilder[0]) {
                    let matchingCommand = commands.get(command[1].id)
                    if (commandBuilder[1]?.permissions) {
                        await matchingCommand.permissions.add({permissions : commandBuilder[1].permissions}).catch(console.error)
                        console.log(`command: '${commandBuilder[1]?.data?.name}' | ${commandBuilder[1].permissions.length} permissions set!`)
                    }
                }
            }
        }
    }
}

module.exports = new CommandDeployer()


// let commands = new Collection();
// const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
//
// for (const file of commandFiles) {
//     const command = require(`./commands/${file}`);
//     // Set a new item in the Collection
//     // With the key as the command name and the value as the exported module
//     commands.set(command.data.name, command);
//     if(command.permissions) console.log(commands.get(command.data.name))
// }
//
// let slashCommands = commands.map(command => command.data.toJSON())
//
// const rest = new REST({ version: '9' }).setToken(token);

// rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: slashCommands })
//     .then(() => {
//         console.log('Successfully registered application commands.')
//
//     })
//     .catch(console.error);



