// App.js, or server.js contains the entry point to the web app.

/* Dependencies */

// Require Express framework for routing pages. This is further explained in /app/routes.js
const express = require("express");

// Require mongoose, an Object Document Mapper that allows for seamless communication between Node.js and MongoDb
const mongoose = require("mongoose");

// Require express-session. This allows for user sessions.
const session = require("express-session");

const MongoStore = require("connect-mongo")(session);

// Require flash. This allows flash error messages.
const flash = require("connect-flash");

const cookieParser = require("cookie-parser");

const fs = require("fs");
/*
    Require passport. This package allows for authentication of users throughout the app through the use of
    various authentication strategies. This is further explained in /config/passport.js
*/
const passport = require("passport");

// Require the path package. This is for naming paths in the directory.
const path = require("path");
// Set app, our webapp, to a new express object. This initializes a new app. From here, app represents our web-app.
const app = express();

// require the database config file. (Add EncodeURI)
require("./config/db.js");

// connect to passport configuration file, passing in passport package from above.
require("./config/passport")(passport);

// set our templating engine to Handlebars (hbs).
app.set("view engine", "hbs");

// allow for express to parse the body object.
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

/*
  TODO : ADD SESSION STORE FOR PRODUCTION ENVIRONMENTS
*/

const fn = path.join(__dirname, "/config/config.json");
const data = fs.readFileSync(fn);
const conf = JSON.parse(data);
let dbconf = conf.dbconf;

app.use(
  session({
    secret: "suchsecretwowe!",
    store: new MongoStore({ url: dbconf, autoRemove: "native" }),
    resave: false,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

// set a new static path for serving static files. Namely, the public folder.
app.use(express.static(path.join(__dirname, "public")));

// enable flash message for login/register errors
app.use(flash());

// import defined routes, passing in our passport strategy and our defined web-app.
require("./app/routes.js")(app, passport);

// app startup. If PORT is not defined, use port 3000. Log the port out to the console.
// Normally, the app is started as defined in the README (node app.js). But Heroku is weird about it...
app.listen(process.env.PORT || 3000);
console.log("This is the port: " + (process.env.PORT || 3000));
