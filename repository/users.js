const MongoClient = require('mongodb').MongoClient;


/**
 * @param {object} data
 **/
function createUser(data) {
    MongoClient.connect(process.env.DATABASE_URL, function (err, db) {
        if (err) throw err;

    }).then(client => {
        const dbconnect = client.db("routeplaner");
        dbconnect.collection("users").insertOne(data, function (err, res) {
            if (err) throw err;

        }).then(r => {
            client.close();
            console.log("1 document inserted with id: " + r.insertedId);
        });
    })
}

/**
 * @param {object} data
 * @returns {object} data
 **/
function getUser(data) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(process.env.DATABASE_URL, (err, db) => {
            if (err) reject(err);
        }).then(client => {
            const dbconnect = client.db("routeplaner");
            dbconnect.collection("users").findOne(data, function (err, res) {
                if (err) throw err;
            }).then(r => {
                client.close();
                console.log("1 document found");
                resolve(r);
            })
        })
    })
}


/**
 * @returns {Array.<object>} data
 */
async function getUsers() {
    return await new Promise((resolve, reject) => {
        MongoClient.connect(process.env.DATABASE_URL, function (err, db) {
            if (err) {
                reject(err);
            }
        }).then(client => {
            const dbconnect = client.db("routeplaner");
            dbconnect.collection("users").find().toArray((err, res) => {
                if (err) reject(err);
            }).then(async res => {
                client.close();
                console.log("1 document found");
                await console.log(res);
                resolve(res);
            })
        })
    })
}

module.exports = {createUser, getUser, getUsers};