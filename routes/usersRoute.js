const express = require('express');
const router = express.Router();
//const bodyParser = require("body-parser");
const UserDbConnection = require("../repository/users");
const encryption = require("../utils/hashing");
//router.use(bodyParser.json())
//router.use(bodyParser.urlencoded({extended: false}))


router.get('/getUser' , async (req, res) => {
    const username = req.query.username;
    if(await UserDbConnection.isAdmin(username)) {
        let temp = await UserDbConnection.getUser({"username": username})
        let temp2 = temp.password;
        res.send(encryption.decrypt(temp2));
    } else {
        res.sendStatus(403);
    }
})


router.get('/getUsers', async (req, res) => {
    const username = req.query.username;
    if(await UserDbConnection.isAdmin(username)) {
        res.send(UserDbConnection.getUsers());
    } else {
        res.sendStatus(403);
    }
})



module.exports = router;