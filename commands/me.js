const {SlashCommandBuilder} = require('@discordjs/builders');
const axios = require('../axios')
const errorHandler = require('../helpers/errorHandler')
const createUserEmbed = require('../embeds/userEmbed')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('me')
        .setDescription('Fetch your information from controlpanel (no personal details)')
        .setDefaultPermission(true) //make sure default permissions is set to true when not using the permissions property
        .addBooleanOption(option =>
            option.setName('private')
                .setDescription("Set to private if you don't want other users to see this")
                .setRequired(false))
    ,
    async execute(interaction) {
        try {
            let userResult = await axios.get(`/users/${interaction.user.id}?include=serversCount,vouchersCount`)
            let userData = userResult.data

            //get users embed
            const userEmbed = createUserEmbed(userResult, userData, interaction);
            await interaction.reply({embeds: [userEmbed], ephemeral: interaction.options.getBoolean('private') ?? false})

        } catch (error) {
            await errorHandler(error, interaction);
        }
    },
};
