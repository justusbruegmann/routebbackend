const express = require('express');
const router = express.Router();
//const bodyParser = require("body-parser");
const UserDbConnection = require("../repository/usersRepository");
const encryption = require("../utils/encryption");
const CookieService = require('../service/cookieService')
//router.use(bodyParser.json())
//router.use(bodyParser.urlencoded({extended: false}))
//creation of an user that IS the app to add security

router.post('/user', async (req,res) => {
    //get password and username of user
    let username = req.header("username");
    let password = req.header("password");
    //if not an valid input send bad request to the frontend
    if (typeof username === "undefined" && typeof password === "undefined") {
        res.sendStatus(400)
    }
    // look if the username and password is an valid account on the GHSE untis or there is an error
    const data = await CookieService.register(username,password)
    if (data.status === "success") {
        // create an user in the Database
        await UserDbConnection.createUser({"username" : username, "password" : encryption.encrypt(password), "studentId": data.studentId }, data.apiKey)
        res.send(data);
    } else if (data.status === "failed") {
        res.sendStatus(403)
    } else {
        res.sendStatus(500)
    }
})

router.get('/login', async (req, res) => {
    let username = req.header("username");
    let password = req.header("password");
    if (typeof username === "undefined" && typeof password === "undefined") {
        res.sendStatus(400)
    }
    let data = await UserDbConnection.getUser(username,password)
    if (data.username === username) {
        let cookies = await CookieService.getCookies(username,password);
        res.send(cookies)
    } else {
        res.sendStatus(403)
    }
})



module.exports = router;