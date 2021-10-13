const validationError = require("../embeds/validationError");
const {ExecutingUserNotLinkedError} = require("../embeds/notLinkedErrors");

module.exports = async function (error, interaction) {
    if (error?.response?.status === 400) {
        const validationErrorEmbed = await validationError.validationErrorEmbed(error);
        return await interaction.reply({embeds: [validationErrorEmbed], ephemeral: true})
    }

    if (error?.response?.status === 404) {
        return await interaction.reply({embeds: [ExecutingUserNotLinkedError], ephemeral: true})
    }

    console.error(error)
    return await interaction.reply({content: `Error: \`${error?.message}\``, ephemeral: true})
}
