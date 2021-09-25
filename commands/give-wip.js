const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const axios = require('../axios')
const {colors} = require('../config')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Give a user credits')
        .addUserOption(option => option
            .setName('target')
            .setDescription('Select a user'))
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription('Enter amount'))

    ,
    async execute(interaction) {
        try {
            const giveEmbed = new MessageEmbed()
                .setColor(colors.primary)
                .setTitle(`Given '' '' credits`)
                .setFooter(`command: /give`, interaction.client.user.displayAvatarURL() );

            await interaction.reply({embeds: [giveEmbed] , ephemeral: interaction.options.getBoolean('private') ?? false })

        } catch (error) {
            console.log(error)
            interaction.reply('error')
        }

    },
};
