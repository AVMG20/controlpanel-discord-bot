const axios = require('axios')
const httpAdapter = require('axios/lib/adapters/http');
const settle = require('axios/lib/core/settle');
const NodeCache = require("node-cache");
const RequestCache = new NodeCache();
const {controlpanel_url, controlpanel_api_key, controlpanel_api_location, requestCacheDuration, app_env} = require('./config')

const customAdapter = (config) => {
    if (app_env.toLowerCase() !== 'development' && config.method === 'get') {
        let result = RequestCache.get(config.url)
        if (result) {
            return new Promise((resolve, reject) => {
                let response = {
                    data: result,
                    cached: true
                };
                resolve(response)
            })
        }
    }

    return new Promise(function (resolve, reject) {
        httpAdapter(config).then(response => {
            if (response.status === 200 && response.config.method === 'get') {
                RequestCache.set(response.config.url, response.data, requestCacheDuration)
            }
            settle(resolve, reject, response);
        });
    })
}

let customAxios = axios.create()

customAxios.defaults.headers.Authorization = 'Bearer ' + controlpanel_api_key;
customAxios.defaults.baseURL = controlpanel_url + '/' + controlpanel_api_location


module.exports = customAxios
