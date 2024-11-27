const express = require("express");
// console.log(express)
const app = express();
const Port = 3000;
const web = require("./routing/web");
const connectDB = require("./db/connectDB");
const fileUpload = require("express-fileUpload");
let cookieParser = require("cookie-parser");
 
//token get
app.use(cookieParser());

//connect flash and session
const session = require("express-session");
const flash = require("connect-flash");
//messages
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);
//Flash messages
app.use(flash());

// ejs (html css)
app.set("view engine", "ejs");

// css image link public
app.use(express.static("public"));

//image uppload
app.use(
  fileUpload({
    useTempFiles: true,
    // tempFileDir : '/tmp/'
  })
);

///connecting with mongoose db
connectDB();

// parse application/x-www-form-urlencoded   ( body parser link se liya hai)
app.use(express.urlencoded({ extended: false }));

//Routing
app.use("/", web);

// server start
app.listen(Port, console.log("server start localhost:3000"));