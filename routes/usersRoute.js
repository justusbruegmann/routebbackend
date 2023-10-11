const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const {getUser} = require("../repository/users");
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: false}))

router.get('/getUser' , async (req, res) => {
    res.send(await getUser({"username" : "test"}))
})



module.exports = router;