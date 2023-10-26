const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const encryption = require("./utils/hashing");
// declarerate users route
const usersRoute = require("./routes/usersRoute");
const timetableRoute = require("./routes/getTimetableRoute");


// activate the Users Route
app.use("/users", usersRoute);
app.use("/timetable", timetableRoute);

const {register} = require('./service/cookieService');

// declarerate users route
const usersRoute = require("./routes/usersRoute");

// activate the Users Route
app.use("/Login", usersRoute);


app.get('/', (req, res) => {

  res.send('Hello World!');
});


app.listen(process.env.PORT, async () => {
    encryption.setup()
    console.log(await register('bruegmajus', '20060707', false));

    console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
