const {MessageEmbed} = require('discord.js');
const {colors} = require('../config')

module.exports = {
    /**
     * @param error axios response error
     * @return {MessageEmbed}
     */
    validationErrorEmbed(error) {
        return new Promise(((resolve, reject) => {
            const validationErrorEmbed = new MessageEmbed()
                .setColor(colors.danger)
                .setTitle(error.response.data?.message)

            if (error.response.data?.errors) {
                const validationErrors = Object.entries(error.response.data.errors);
                for (let i = 0; i < validationErrors.length; i++) {
                    validationErrorEmbed.addField(validationErrors[i][0], validationErrors[i][1][0], false)
                }
            }

            return resolve(validationErrorEmbed)
        }))
    }
}



