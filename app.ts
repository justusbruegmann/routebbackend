const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port : any = process.env.PORT;
import  * as dotenv from 'dotenv';
dotenv.config();
//to import enviorment variables
//process.env.Database_URL

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// set up the route
//const logInRoute = require("./routes/Login");

// activate the route
//app.use("/Login", logInRoute);

// server start
app.listen(port , () => {
    console.log("app is running on: " + port);
});