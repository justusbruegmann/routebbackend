const express = require('express');
const router = express.Router();
//const bodyParser = require("body-parser");
//const UserDbConnection = require("../repository/users");
const timetableService = require("../service/timtableService");

router.get('/getTimetable' , async (req, res) => {
    const username = req.query.username;
    const data = await timetableService.cleanTimetable(username)
    console.log("done")
    res.send(data);
})

router.get('/firstLesson', async (req,res) => {
    const username = req.query.username;
    const data = await timetableService.getFirstLesson(username)
    res.send(data)
})

module.exports = router;