const express = require('express');
const router = express.Router();
//const bodyParser = require("body-parser");
//const UserDbConnection = require("../repository/users");
const {getRoute} = require("../service/mapsService");

router.get('/getRoute' , async (req, res) => {
    let travelMode = req.query.travelMode
    let temp = await getRoute(travelMode)
    console.log("route")
    res.send(temp);
})


module.exports = router;