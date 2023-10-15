const express = require('express');
const router = express.Router();
//const bodyParser = require("body-parser");
const UserDbConnection = require("../repository/users");
const {fetchService} = require("../service/fetchService");

router.get('/getTimetable' , async (req, res) => {
    const username = req.query.username;
    res.send(await fetchService(username));
})

module.exports = router;