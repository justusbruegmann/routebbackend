const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const {getUser, createUser, getUsers} = require('./repository/users')

// declarerate users route
const usersRoute = require("./routes/usersRoute");

// activate the Users Route
app.use("/Login", usersRoute);

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(process.env.PORT, async () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});