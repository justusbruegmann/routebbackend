const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
//const {fetchService} = require("./utils/fetchService");

// declarerate users route
const usersRoute = require("./routes/usersRoute");
const timetableRoute = require("./routes/getTimetableRoute");
const encryption = require("./utils/hashing");
const userDbConnection = require("./repository/users");
const {decrypt} = require("dotenv");

// activate the Users Route
app.use("/users", usersRoute);
app.use("/timetable", timetableRoute);

app.get('/', (req, res) => {

  res.send('Hello World!');
});


app.listen(process.env.PORT, async () => {
    encryption.setup()
    /*let userData = {
        "username": "bruegmajus",
        "password": encryption.encrypt("20060707"),
        "studentId": 35524,
        "isAdmin": false
    }
    userDbConnection.createUser(userData);*/

    console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});