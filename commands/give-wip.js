const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const axios = require('../axios')
const {colors} = require('../config')
const {SearchedUserNotLinked} = require('../embeds/notLinkedErrors')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Give a user credits')
        .addUserOption(option => option
            .setName('target')
            .setRequired(true)
            .setDescription('Select a user'))
        .addIntegerOption(option => option
            .setName('amount')
            .setRequired(true)
            .setDescription('Enter amount'))
        .addBooleanOption(option =>
            option.setName('private')
                .setDescription("Set to private if you don't want other users to see this")
                .setRequired(false))
    ,
    async execute(interaction) {
        try {
            let target = interaction.options.getUser('target')
            let amount = interaction.options.getInteger('amount')

            let result = await axios.patch(`/users/${target.id}/increment`, {
                credits: amount
            })
            let userData = result.data

            const giveEmbed = new MessageEmbed()
                .setColor(colors.primary)
                .setTitle(`Given '${target.username}', '${amount}' credits!`)
                .setFooter(`command: /give`, interaction.client.user.displayAvatarURL())
                .setDescription('User information: ')
                .addFields(
                    {name: 'Name', value: `\`${userData.name}\``, inline: false},
                    {name: 'Previous Credits', value: `\`${(Math.round(userData.credits * 100) / 100 - amount).toString()}\``, inline: true},
                    {name: 'Current Credits', value: `\`${(Math.round(userData.credits * 100) / 100).toString()}\``, inline: true},
                )

            await interaction.reply({embeds: [giveEmbed], ephemeral: interaction.options.getBoolean('private') ?? false})

        } catch (error) {
            if (error.response.status === 404) interaction.reply({embeds: [SearchedUserNotLinked], ephemeral: true})
            else interaction.reply({content: 'error', ephemeral: true})
        }

    },
};
