const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const axios = require('../axios')
const {primaryColor, adminRoleId, pterodactyl_url} = require('../config')
const errorHandler = require('../helpers/errorHandler')
const linkedButtons = require('../buttons/linkedButtons')
const createUserEmbed = require('../embeds/userEmbed')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Fetch an users information and servers')
        .setDefaultPermission(false) //make sure default permissions is set to false when using the permissions property
        .addUserOption(option => option
            .setName('target')
            .setRequired(true)
            .setDescription('Select a user'))
        .addBooleanOption(option =>
            option.setName('private')
                .setDescription("Set to private if you don't want other users to see this")
                .setRequired(false))
    ,
    permissions: [
        {
            id: adminRoleId,
            type: 'ROLE',
            permission: true,
        },
    ],
    getButtonDetails: function (userData) {
        return userData.servers.map(server => {
            return {
                name: server.name.substring(0, 16),
                url: pterodactyl_url + `/server/${server.identifier}`
            }
        });
    },
    async execute(interaction) {
        try {
            let target = interaction.options.getUser('target')
            let userResult = await axios.get(`/users/${target.id}?include=serversCount,vouchersCount,servers`)
            let userData = userResult.data

            const userEmbed = createUserEmbed(userResult, userData, interaction);
            let interactionOptions = {
                embeds: [userEmbed],
                ephemeral: interaction.options.getBoolean('private') ?? false
            };

            //add servers links to pterodactyl
            if (userData?.servers.length > 0) {
                let buttonDetails = this.getButtonDetails(userData)
                let buttons = await linkedButtons(buttonDetails);

                const serverEmbed = new MessageEmbed()
                    .setColor(primaryColor)
                    .setTitle(`Listing available servers`)
                    .setDescription('Links to pterodactyl server page')

                interactionOptions.embeds.push(serverEmbed)
                interactionOptions.components = [buttons]
            }

            return await interaction.reply(interactionOptions)

        } catch (error) {
            await errorHandler(error, interaction);
        }
    },
};
