const express = require('express');
const router = express.Router();
//const bodyParser = require("body-parser");
const UserDbConnection = require("../repository/users");
//router.use(bodyParser.json())
//router.use(bodyParser.urlencoded({extended: false}))

router.get('/getUser' , async (req, res) => {
    const username = req.query.username;
    if(await UserDbConnection.isAdmin(username)) {
        res.send(await UserDbConnection.getUser({"username": username}));
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