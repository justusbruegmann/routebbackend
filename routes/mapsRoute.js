const express = require('express');
const router = express.Router();
//const bodyParser = require("body-parser");
//const UserDbConnection = require("../repository/users");
const {getRoute} = require("../service/mapsService");
const ApikeyService = require("../service/apiKeyService")
const Utils = require("../utils/utils");

router.get('/getRoute', async (req, res) => {
    //getting the needed parrams
    let travelMode = req.query.travelMode
    let plat = req.query.lat;
    let plong = req.query.long;
    let ptime = req.query.time
    //convert to float from string
    plat = parseFloat(plat)
    plong = parseFloat(plong)
    let time;
    //not for every Travalmode an time is needed so we put one of 0 as the standard
    if (ptime === undefined) {
        time = Utils.formatTime(0,0)
    } else {
        time = ptime.split(":")
        time[0] = parseInt(time[0])
        time[1] = parseInt(time[1])
        //check if it is right and its
        try {
            time = Utils.formatTime(time[0], time[1])
        } catch (error) {
            res.sendStatus(500)
        }
    }
    // setting the location in an right object for google maps api
    let location = {"latLng": {"latitude": plat, "longitude": plong}}
    //authenticating the user because every request to google maps cost money and why send request if not real user would be dumb
    let auth = req.header("auth")
    let username = req.header("username")
    if (await ApikeyService.checkApiKey(username, auth)) {
        // if everything is right send request
        let temp = await getRoute(travelMode,time,location)
        console.log("route")
        res.send(temp);
    } else {
        res.sendStatus(403)
    }
})


module.exports = router;