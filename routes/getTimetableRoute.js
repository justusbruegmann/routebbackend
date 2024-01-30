const express = require('express');
const router = express.Router();
//const bodyParser = require("body-parser");
//const UserDbConnection = require("../repository/users");
const timetableService = require("../service/timtableService");
const {fetchTimetable} = require("../service/fetchService");
const ApikeyService = require("../service/apiKeyService");
const UserDBConnection = require("../repository/usersRepository");

router.get('/getTimetable', async (req, res) => {
    //cookie is the webuntis cookies auth is the Apikey from us and the username is to check if the apikey is in the same document as the username
    const cookies = req.header("Cookie")
    let auth = req.header("auth")
    let username = req.header("username")
    //auth check if the user is allowed to get the timetable
    if (await ApikeyService.checkApiKey(username, auth)) {
        const studentId = await UserDBConnection.getStudentId(username)
        let timetable = await fetchTimetable(cookies, studentId)
        // checking for an internal server error / an error from webuntis
        if (timetable.status === 500) {
            res.sendStatus(500)
        } else {
            // if no error then we get the timetable an check if its longer than 1 because on saturday and sunday it would be 0
            // here we put the timetable in an function that cleans it from not importend field so we have an cleaner and smaller data
            // transmission to the user in my test the uncleand response is 32KB and the cleaned 5KB
            timetable = await timetableService.cleanTimetable(timetable)
            if (timetable.length > 0) {
                res.send(timetable)
            } else {
                res.sendStatus(500)
            }
        }
    } else {
        // if not allowed the user gets an 403
        res.sendStatus(403)
    }
})

router.get('/firstLesson', async (req, res) => {
    const cookies = req.header("Cookie")
    let auth = req.header("auth")
    let username = req.header("username")
    // look in the getTimetable function
    if (await ApikeyService.checkApiKey(username, auth)) {
        const studentId = await UserDBConnection.getStudentId(username)
        let timetable = await fetchTimetable(cookies, studentId)
        if (timetable.status === 500) {
            res.sendStatus(500)
        } else {
            //the funtion getFirstLesson return only the first lesson of the current day
            timetable = await timetableService.getFirstLesson(timetable)
            res.send(timetable)
        }
    } else {
        res.sendStatus(403)
    }
})


module.exports = router;
