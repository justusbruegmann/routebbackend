const MongoClient = require('mongodb').MongoClient;


class UserDbConnection {
    /**
     * @param {object} data
     **/
    static createUser(data) {
        MongoClient.connect(process.env.DATABASE_URL, function (err) {
            if (err) throw err;

        }).then(client => {
            const dbconnect = client.db("routeplaner");
            dbconnect.collection("users").insertOne(data, function (err) {
                if (err) throw err;

            }).then(async r=> {
                await client.close();
                console.log("1 document inserted with id: " + r.insertedId);
            });
        })
    }

    /**
     * @param {object} data
     * @returns {object}
     **/
    static getUser(data) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(process.env.DATABASE_URL, (err) => {
                if (err) reject("error");
            }).then(client => {
                const dbconnect = client.db("routeplaner");
                dbconnect.collection("users").findOne(data, function (err) {
                    if (err) reject("error");
                }).then(async r => {
                   await client.close();
                    //console.log("1 document found");
                    resolve(r);
                })
            })
        })
    }


    /**
     * @returns {Array.<object>} data
     */
    static async getUsers() {
        return await new Promise((resolve, reject) => {
            MongoClient.connect(process.env.DATABASE_URL, function (err) {
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
}

module.exports = UserDbConnection;