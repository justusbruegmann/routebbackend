const express = require('express');
const router = express.Router();
//const bodyParser = require("body-parser");
//const UserDbConnection = require("../repository/users");
const timetableService = require("../service/timtableService");
const {fetchTimetable} = require("../service/fetchService");
const ApikeyService = require("../service/apiKeyService");
const UserDBConnection = require("../repository/usersRepository");

router.get('/getTimetable', async (req, res) => {
    const cookies = req.header("Cookie")
    let auth = req.header("auth")
    let username = req.header("username")
    if (await ApikeyService.checkApiKey(username, auth)) {
        const studentId = await UserDBConnection.getStudentId(username)
        let timetable = await fetchTimetable(cookies, studentId)
        if (timetable.status === 500) {
            res.sendStatus(500)
        } else {
            timetable = await timetableService.cleanTimetable(timetable)
            if (timetable.length > 0) {
                res.send(timetable)
            } else {
                res.sendStatus(500)
            }
        }
    } else {
        res.sendStatus(403)
    }
})

router.get('/firstLesson', async (req, res) => {
    const cookies = req.header("Cookie")
    let auth = req.header("auth")
    let username = req.header("username")
    if (await ApikeyService.checkApiKey(username, auth)) {
        const studentId = await UserDBConnection.getStudentId(username)
        let timetable = await fetchTimetable(cookies, studentId)
        if (timetable.status === 500) {
            res.sendStatus(500)
        } else {
            timetable = await timetableService.getFirstLesson(timetable)
            res.send(timetable)
        }
    } else {
        res.sendStatus(403)
    }
})


module.exports = router;
