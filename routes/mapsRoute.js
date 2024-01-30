const express = require('express');
const router = express.Router();
//const bodyParser = require("body-parser");
//const UserDbConnection = require("../repository/users");
const {getRoute} = require("../service/mapsService");
const ApikeyService = require("../service/apiKeyService")
const Utils = require("../utils/utils");

router.get('/getRoute', async (req, res) => {
    let travelMode = req.query.travelMode
    let plat = req.query.lat;
    let plong = req.query.long;
    let ptime = req.query.time
    plat = parseFloat(plat)
    plong = parseFloat(plong)
    let time;
    if (ptime === undefined) {
        time = Utils.formatTime(0,0)
    } else {
        time = ptime.split(":")
        time[0] = parseInt(time[0])
        time[1] = parseInt(time[1])
        try {
            time = Utils.formatTime(time[0], time[1])
        } catch (error) {
            console.log(error)
            res.sendStatus(500)
        }
    }
    let location = {"latLng": {"latitude": plat, "longitude": plong}}
    let auth = req.header("auth")
    let username = req.header("username")
    if (await ApikeyService.checkApiKey(username, auth)) {
        console.log(location)
        let temp = await getRoute(travelMode,time,location)
        console.log("route")
        res.send(temp);
    } else {
        res.sendStatus(403)
    }
})


module.exports = router;