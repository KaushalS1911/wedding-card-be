require('dotenv').config();
const express = require("express");
const connectionDB = require("./configs/connection");
const exceptionHandler = require("./middlewares/exceptionErrorHandler");
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require("cookie-parser");

require("./configs/passport-google");
require("./configs/passport-facebook");

const app = express();
const PORT = process.env.PORT || 8080;

// Database Connection
connectionDB();

// CORS Middleware - FIXED
app.use(cors({
    origin: "*",
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// Session Configuration - FIXED
app.use(session({
    secret: process.env.JWT_SECRET_KEY || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false, httpOnly: true, sameSite: "lax"}
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => res.send("Hello From Server"));

// Import Routes
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const inquiryRouter = require("./routes/inquiry");
const commanRouter = require("./routes/comman");
const configRouter = require("./routes/config");
const blogRouter = require("./routes/blog");
const templateRouter = require("./routes/template");
const favouriteTemplatesRouter = require("./routes/favourite-templates");

// Use Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api", commanRouter);
app.use("/api/config", configRouter);
app.use("/api/blog", blogRouter);
app.use("/api/template", templateRouter);
app.use("/api/favourite-template", favouriteTemplatesRouter);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({status: 404, message: "Route does not exist"});
});

// Error Handler
app.use(exceptionHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Your Server is running at PORT ${PORT}`);
});