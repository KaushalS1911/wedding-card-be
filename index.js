const express = require("express");
const connectionDB = require("./configs/connection");
const exceptionHandler = require("./middlewares/exceptionErrorHandler");
const app = express();
const PORT = process.env.PORT || 8080;
const cookieParser = require('cookie-parser')
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./configs/passport');
require("dotenv").config();

//routes
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const inquiryRouter = require("./routes/inquiry");
const commanRouter = require("./routes/comman");
const configRouter = require("./routes/config");
const blogRouter = require("./routes/blog");
const templateRouter = require("./routes/template");
const favouriteTemplatesRouter = require("./routes/favourite-templates");

//connection to database
connectionDB();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(session({secret: 'secret_key', resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.get("/", (req, res) => {
    res.send("Hello From Server");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/inquiry", inquiryRouter)
app.use("/api", commanRouter)
app.use("/api/config", configRouter)
app.use("/api/blog", blogRouter)
app.use("/api/template", templateRouter)
app.use("/api/favourite-template", favouriteTemplatesRouter)

app.use("/", (req, res) => {
    res.status(404).json({status: 404, message: "Route does not exist"});
});
app.use(exceptionHandler);

app.listen(PORT, () => {
    console.log(`Your Server is running at PORT ${PORT}`);
});

