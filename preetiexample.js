// Express is for building the Rest apis

// cors provides Express middleware to enable CORS with various options.

const express = require("express");

const bodyParser = require("body-parser");

const cors = require("cors");


const app = express();


var corsOptions = {

  origin: "http://localhost:8081"

};


app.use(cors(corsOptions));


// parse requests of content-type - application/json

app.use(bodyParser.json());


// parse requests of content-type - application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: true }));


// const db = require("./app/models");

// // db.sequelize.sync();

// db.sequelize.sync({ force: true }).then(() => {

//   console.log("Drop and re-sync db.");

// });


const db = require("./app/models");

db.sequelize.sync();


// simple route

app.get("/", (req, res) => {

  res.json({ message: "Welcome to Preeti's Data Ingestion application." });

});


// require("./app/routes/turorial.routes")(app);

require("./app/routes/datasetreg.routes")(app);

require("./app/routes/registreddataset.routes")(app);

require("./app/routes/registreduser.routes")(app);


// set port, listen for requests

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}.`);

});