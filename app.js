const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const encryption = require("./utils/encryption");
const {getRoute} = require("./service/mapsService")

//const {fetchService} = require("./utils/fetchService");
// declarerate users route
const usersRoute = require("./routes/usersRoute");
const timetableRoute = require("./routes/getTimetableRoute");
const mapsRoute = require("./routes/mapsRoute")


// activate the Users Route
app.use("/users", usersRoute);
app.use("/timetable", timetableRoute);
app.use("/maps",mapsRoute)

app.get('/', (req, res) => {

  res.send('Hello World!');
});


app.listen(process.env.PORT, async () => {
    //emitter.setMaxListeners(50)
    encryption.setup()
    //server
    console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
