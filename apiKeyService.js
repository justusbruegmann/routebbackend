const userDBConnection = require("../repository/usersRepository")
const Utils = require("../utils/utils")
const encryption = require("../utils/encryption")
const crypto = require('crypto');

class ApiKeyService {
    // create an random 20 string hexbytes for the key
    static async createApiKey() {
        let apiKey = crypto.randomBytes(20).toString('hex');
        let date = Utils.getDate()
        return new Promise(resolve => {
            resolve({apiKey: apiKey, date: date})
        })
    }

    //check if the key is valid in database
    static async checkApiKey(username, apikey) {
        return new Promise(async resolve => {
            let check = await userDBConnection.checkApiKeyDB(username, apikey)
            if (check) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
    }

    //update the apikey date and key it self
    static async updateApiKey(username) {
        return new Promise(async resolve => {
            let data = await this.createApiKey()
            let check = await userDBConnection.updateApiKey(username,data)
            if (check) {
                resolve(data.apiKey)
            } else {
                resolve(false)
            }
        })
    }
}

module.exports = ApiKeyService;