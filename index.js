const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const CommandDeployer = require('./deploy-commands')
const { token, guildId } = require('./config');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

//commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}


// When the client is ready, run this code (only once)
client.once('ready', async () => {
    if (process.env.LOAD_SLASH_COMMANDS.toLowerCase() === 'true') {
        CommandDeployer.setClient(client)
        await CommandDeployer.loadCommands()
        await CommandDeployer.setPermissions()
    }

    await client.user.setActivity('slash commands' , { type: 'LISTENING' });
    await client.user.setStatus('online');

    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Login to Discord with your client's token
client.login(token);
