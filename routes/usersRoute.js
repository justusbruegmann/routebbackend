const express = require('express');
const router = express.Router();
//const bodyParser = require("body-parser");
const UserDbConnection = require("../repository/usersRepository");
const encryption = require("../utils/hashing");
//router.use(bodyParser.json())
//router.use(bodyParser.urlencoded({extended: false}))
//creation of an user that IS the app to add security
const appUser = {
    username: "admin",
    password: {
        iv: '732ef2d91ec2f65a92fba2217819b360',
        encryptedData: 'c1b6283d11341ac280bbee805714bb38'
    },
    studentId: null,
    isAdmin: false,
    isApp: true
}

router.get('/getUser' , async (req, res) => {
    const username = req.query.username;
    if(appUser.isApp) {
        let temp = await UserDbConnection.getUser({"username": username})
        let temp2 = temp.password;
        res.send(encryption.decrypt(temp2));
    } else {
        res.sendStatus(403);
    }
})

router.get('/getUsers', async (req, res) => {
    if(appUser.isApp ) {
        res.send(UserDbConnection.getUsers());
    } else {
        res.sendStatus(403);
    }
})



module.exports = router;