const express = require('express');
const router = express.Router();
//const bodyParser = require("body-parser");
//const UserDbConnection = require("../repository/users");
const {getRoute} = require("../service/mapsService");
const ApikeyService = require("../service/apiKeyService")

router.get('/getRoute' , async (req, res) => {
    let travelMode = req.query.travelMode
    let auth = req.query.auth
    let username = req.query.username
    if (await ApikeyService.checkApiKey(username, auth)) {
        let temp = await getRoute(travelMode)
        console.log("route")
        res.send(temp);
    } else {
        res.sendStatus(403)
    }
})


module.exports = router;