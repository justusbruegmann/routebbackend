const express = require('express');
const router = express.Router();
//const bodyParser = require("body-parser");
//const UserDbConnection = require("../repository/users");
const timetableService = require("../service/timtableService");

router.get('/getTimetable' , async (req, res) => {
    const username = req.query.username.toString();
    const password = req.query.password.toString();
    const data = await timetableService.cleanTimetable(username,password)
    console.log("done")
    res.send(data);
})

router.get('/firstLesson', async (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
    console.log(typeof username)
    console.log(typeof password)

    const data = await timetableService.getFirstLesson(username, password)
    res.send(data)
})

module.exports = router;
