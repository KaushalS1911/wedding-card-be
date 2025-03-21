const express = require("express");
const connectionDB = require("./configs/connection");
const exceptionHandler = require("./middlewares/exceptionErrorHandler");
const app = express();
const PORT = process.env.PORT || 8080;
const cookieParser = require('cookie-parser')
const cors = require('cors');
require("dotenv").config();

//routes
const authRouter = require("./routes/auth");
const contactRouter = require("./routes/contact");
const blogRouter = require("./routes/blog");
const categoryRouter = require("./routes/category");
const subCategoryRouter = require("./routes/subCategory");
const templateRouter = require("./routes/template");

//connection to database
connectionDB(process.env.DB_CONNECTION_STRING);

//Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

//Routes
app.get("/", (req, res) => {
    res.send("Hello From Server");
});

app.use("/api/auth", authRouter);
app.use("/api/contact", contactRouter)
app.use("/api/blog", blogRouter)
app.use("/api/category", categoryRouter)
app.use("/api", subCategoryRouter)
app.use("/api/template", templateRouter)

app.use("/", (req, res) => {
    res.status(404).json({status: 404, message: "Route does not exist"});
});
app.use(exceptionHandler);

app.listen(PORT, () => {
    console.log(`Your Server is running at PORT ${PORT}`);
});

