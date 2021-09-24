require('dotenv').config()

module.exports = {
    token: process.env.BOT_TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,

    controlpanel_url: process.env.CONTROLPANEL_URL,
    controlpanel_api_key: process.env.CONTROLPANEL_API_KEY,
    controlpanel_api_location : 'api',

    //cache results from get request to the api
    requestCacheDuration : 60 * 30, //30 mins

    primaryColor : '#575fcf'
}
