const MongoClient = require('mongodb').MongoClient;
const Utils = require("../utils/utils")
const encryption = require("../utils/encryption")
const url = process.env.DATABASE_URL;

class UserDbConnection {
    /**
     * this funtion is the DB connection for creating a User which the whole data is defined in the route
     * @param {object} data,
     * @param {object} apikey
     *
     **/
    static async createUser(data , apikey) {
        let userData = data
        let apiKey = apikey
        userData.apiKey = apiKey
        MongoClient.connect(url, function (err) {
            if (err) throw err;

        }).then(client => {
            const dbconnect = client.db("routeplaner");
            dbconnect.collection("users").insertOne(userData, function (err) {
                if (err) throw err;

            }).then(async r => {
                await client.close();
            });
        })
    }

    /**
     * with this funtion it is for getting a user authenticated by the username and password
     * @param {String} username
     * @param {String} password
     * @returns {object}
     **/
    static getUser(username, password) {
        // promise is for the callback that the calling function is waiting for the fulfilled response
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, (err) => {
                if (err) reject("error");
            }).then(client => {
                const dbconnect = client.db("routeplaner");
                dbconnect.collection("users").findOne({"username": username}, function (err) {
                    if (err) reject("error");
                }).then(async r => {
                    await client.close();
                    //if user in database check with the password it's the right
                    if (encryption.decrypt(r.password) === password) {
                        resolve(r);
                    } if (typeof r === "undefined")
                        // if r is undefined there is no user with the username in the database
                    {
                        resolve("user not found");
                    } else
                        // the password is incorrect so the user gets a forbidden http code back
                    {
                        resolve(403);
                    }
                })
            })
        })
    }

    /**
     * is for getting the student id
     * @param username
     * @returns {Promise<unknown>}
     */
    static getStudentId(username) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, (err) => {
                if (err) reject("error");
            }).then(client => {
                const dbconnect = client.db("routeplaner");
                dbconnect.collection("users").findOne({"username": username}, function (err) {
                    if (err) reject("error");
                }).then(async r => {
                    await client.close();
                    // the user dont have an id or there is no user
                    if (typeof r === "null" || typeof r === "undefined") {
                        resolve("user not found");
                    } else {
                        resolve(Number(r.studentId));
                    }
                    //console.log("1 document found");

                })
            })
        })
    }


    /**
     * this funtion is to check if the provided internal api key ist valid in the database with the correct User
     * @param username
     * @param pApiKey
     * @returns {Promise<unknown>}
     */
    static async checkApiKeyDB(username, pApiKey) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err) {
                if (err) reject(err);
            }).then(client => {
                const dbconnect = client.db("routeplaner");
                dbconnect.collection("users").findOne({"username": username, "apiKey.apiKey": pApiKey}, function (err) {
                    if (err) reject("error");
                }).then(async r => {
                    await client.close();
                    // if null no user with the apikey so no acces
                    if (r === null) {
                        resolve(false)
                    }else {
                        // if apikey in database check with the current date it's still valid
                        let date = r.apiKey.date
                        if(date === Utils.getDate()) {
                            resolve(true);
                        }else {
                            // wrong date so its invalid
                            resolve(false);
                        }
                    }
                }).catch(err => {

                    console.log("usernot found", err);
                    resolve(false);
                })
            })
        })
    }

    /**
     * this funtion update the Api key which is only on day working
     * @param username
     * @param apikey
     * @returns {Promise<unknown>}
     */
    static async updateApiKey(username, apikey) {
        return new Promise(async (resolve, reject) => {
            MongoClient.connect(url, function (err) {
                if (err) reject(err);
            }).then(async client => {
                const dbconnect = client.db("routeplaner");
                // update the apikey to a new one and set the new date to the current
                dbconnect.collection("users").updateOne({"username": username}, {$set: {"apiKey": apikey}}, function (err) {
                    if (err) reject("error");
                }).then(async r => {
                    // succesfull update
                    await client.close();
                    resolve(true);
                }).catch(err => {
                    // there is no user with this username
                    resolve(false);
                })
            })
        })
    }


}

module.exports = UserDbConnection;