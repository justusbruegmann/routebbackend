const MongoClient = require('mongodb').MongoClient;
const Utils = require("../utils/utils")
const encryption = require("../utils/encryption")
const url = process.env.DATABASE_URL;

class UserDbConnection {
    /**
     * @param {object} data,
     * @param {String} apikey
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
                console.log("1 document inserted with id: " + r.insertedId);
            });
        })
    }

    /**
     * @param {String} username
     * @param {String} password
     * @returns {object}
     **/
    static getUser(username, password) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, (err) => {
                if (err) reject("error");
            }).then(client => {
                const dbconnect = client.db("routeplaner");
                dbconnect.collection("users").findOne({"username": username}, function (err) {
                    if (err) reject("error");
                }).then(async r => {
                    await client.close();
                    if (encryption.decrypt(r.password) === password) {
                        resolve(r);
                    } if (typeof r === "undefined") {
                        resolve("user not found");
                    } else {
                        resolve(403);
                    }
                    //console.log("1 document found");

                })
            })
        })
    }


    /**
     * @returns {Array.<object>} data
     */
    static async getUsers() {
        return await new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err) {
                if (err) {
                    reject("error");
                }
            }).then(client => {
                const dbconnect = client.db("routeplaner");
                dbconnect.collection("users").find().toArray((err) => {
                    if (err) reject("error");
                }).then(async res => {
                    await client.close();
                    console.log("1 document found");
                    resolve(res);
                })
            })
        })
    }

    static async isAdmin(username) {
        return await new Promise((resolve, reject) => {
            MongoClient.connect(process.env.DATABASE_URL, function (err, db) {
                if (err) {
                    reject(err);
                }
            }).then(client => {
                const dbconnect = client.db("routeplaner");
                dbconnect.collection("users").findOne({"username": username}, function (err, res) {
                    if (err) throw err;
                }).then(r => {
                    client.close();
                    console.log("1 document found");
                    resolve(r.isAdmin);
                }).catch(err => {
                    console.log("usernot found", err);
                    resolve(false);
                })
            })
        })
    }

    static async checkApiKeyDB(username, papiKey) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err) {
                if (err) reject(err);
            }).then(client => {
                const dbconnect = client.db("routeplaner");
                dbconnect.collection("users").findOne({"username": username, "apiKey.apiKey": papiKey}, function (err) {
                    if (err) reject("error");
                }).then(async r => {
                    await client.close();
                    //console.log("1 document found");
                    if (r === null) {
                        resolve(false)
                    }else {
                        console.log(r.apiKey.date)
                        let date = r.apiKey.date
                        if(date === Utils.getDate()) {
                            resolve(true);
                        }else {
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
    // FIXME: change alot of stuff test needed in every endpoint from timetable and user
    static async updateApiKey(username, apikey) {
        return new Promise(async (resolve, reject) => {
            MongoClient.connect(url, function (err) {
                if (err) reject(err);
            }).then(async client => {
                const dbconnect = client.db("routeplaner");
                dbconnect.collection("users").updateOne({"username": username}, {$set: {"apiKey": apikey}}, function (err) {
                    if (err) reject("error");
                }).then(async r => {
                    await client.close();
                    console.log("1 document updated");
                    resolve(true);
                }).catch(err => {
                    console.log("usernot found", err);
                    resolve(false);
                })
            })
        })
    }


}

module.exports = UserDbConnection;